using Monzo;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.Website.ViewModels;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MyFinances.Website.Controllers
{
    public sealed class MonzoController : Controller
    {
        private readonly IMonzoAuthorizationClient _monzoAuthorizationClient;
        private readonly IFinanceService financeService;
        private readonly IBaseService baseService;
        private readonly ISpendingService spendingService;

        private readonly string clientId = ConfigurationManager.AppSettings["MonzoClientId"];
        private readonly string clientSecret = ConfigurationManager.AppSettings["MonzoClientSecret"];
        private readonly string rootUrl = ConfigurationManager.AppSettings["RootUrl"];

        public MonzoController(
            IFinanceService financeService, 
            ISpendingService spendingService,
            IBaseService baseService)
        {
            _monzoAuthorizationClient = new MonzoAuthorizationClient(clientId, clientSecret, rootUrl);
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
;        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Login()
        {
            string state = Utils.GenerateRandomString(64);

            Session["state"] = state;

            // send user to Monzo's login page
            return Redirect(_monzoAuthorizationClient.GetAuthorizeUrl(state, Url.Action("OAuthCallback", "Monzo", null, Request.Url.Scheme)));

        }

        [HttpPost]
        public async Task<ActionResult> AddTransaction(string monzoTransId, string name, decimal amount, string date, bool isFinance, int selectedId, int? secondCatId = null)
        {
            var dto = new SpendingDTO
            {
                Name = name,
                Amount = amount,
                SecondCatId = secondCatId,
                Date = DateTime.ParseExact(date, "yyyy-MM-ddTHH:mm", new CultureInfo("en-GB")),
                MonzoTransId = monzoTransId
            };

            dto.FinanceId = !isFinance ? (int?)null : selectedId;
            dto.CatId = !isFinance ? selectedId : (int?)null; 

            if (dto.FinanceId.HasValue && dto.CatId.HasValue)
                dto.CatId = null;

            if (!dto.FinanceId.HasValue && !dto.CatId.HasValue)
                throw new ApplicationException("Must have FinanceId or catId");

            await spendingService.InsertAsync(dto);

            return View("Close");
        }

        [HttpGet]
        public async Task<ActionResult> AddTransaction(string monzoTransId, string name, long amount, string date, bool? isFinance, int? Id, CategoryType? secondTypeId)
        {
            var categories = await baseService.GetAllCategories(Enums.CategoryType.Spendings, catsWithSubs: false);
            var viewModel = new AddTransactionVM();

            viewModel.IsFinance = isFinance ?? false;

            if (Id.HasValue)
            {
                 viewModel.SelectedId = Id.Value;
            }

            if (secondTypeId.HasValue && secondTypeId != 0)
            {
                var secondCategories = await baseService.GetAllCategories(secondTypeId, catsWithSubs: false);
                viewModel.SecondCategories = secondCategories;
            }

            viewModel.Categories = categories;
            viewModel.Amount = amount;
            viewModel.Date = date;
            viewModel.MonzoTransId = monzoTransId;

            if (amount < 0)
            {
                var finances = await financeService.GetFinances(resyncNextDueDates: false);

                viewModel.Finances = finances;
                viewModel.Name = name;

                return View("AddSpending", viewModel);
            }
            else 
            {
                return View("AddIncome", viewModel);
            }
        }

        public async Task<ActionResult> ApproveDataAccess(string accessToken)
        {
            // fetch transactions etc
            using (var client = new MonzoClient(accessToken))
            {
                var accounts = await client.GetAccountsAsync();
                var balance = await client.GetBalanceAsync(accounts[0].Id);
                var transactions = (await client.GetTransactionsAsync(accounts[0].Id, expand: "merchant"))
                    .OrderByDescending(x => x.Created)
                    .Take(100)
                    .ToList();

                var spentToday = transactions
                    .Where(x => x.Created.Date == DateTime.UtcNow.Date && x.Amount < 0)
                    .Sum(x => x.Amount / 100m);
                    
                var viewModel = new AccountSummaryModel
                {
                    SpentToday = spentToday,
                    Account = accounts[0],
                    Balance = balance,
                    Transactions = transactions
                };

                return View("OAuthCallback", viewModel);
            }
        }

        [HttpGet]
        public async Task<ActionResult> OAuthCallback(string code, string state)
        {
            // verify anti-CSRF state token matches what was sent
            string expectedState = Session["state"] as string;

            if (!string.Equals(expectedState, state))
            {
                throw new SecurityException("State mismatch");
            }

            Session.Remove("state");

            // exchange authorization code for access token
            //var accessToken = await _monzoAuthorizationClient.GetAccessTokenAsync(code, Url.Action("OAuthCallback", "Monzo", null, Request.Url.Scheme));
            var accessToken = await GetOAuthToken(code);

            // we now have the access token and will be prompted in Monzo app to 
            // grant access to the data, this must be approved before executing next line of code!
            return View("ApproveDataAccess", new AccountSummaryModel { Token = accessToken.Value });
        }

        // Call this from Callback location to get access code after Auth redirect.
        public async Task<AccessToken> GetOAuthToken(string authCode)
        {
            var restClient = new RestClient("https://api.monzo.com/oauth2/token");

            var request = new RestRequest(Method.POST);

            request.AddParameter("grant_type", "authorization_code");
            request.AddParameter("client_id", clientId);
            request.AddParameter("client_secret", clientSecret);
            request.AddParameter("redirect_uri", Url.Action("OAuthCallback", "Monzo", null, Request.Url.Scheme));
            request.AddParameter("code", authCode);

            var response = await restClient.ExecuteAsync(request);
            var content = response.Content;

            var accessResponse = JsonConvert.DeserializeObject<AccessToken>(content);
            return accessResponse;
        }
    }
}
