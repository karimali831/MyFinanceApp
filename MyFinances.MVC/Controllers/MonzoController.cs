using Monzo;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.ViewModels;
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
        private readonly IMonzoService monzoService;

        private readonly string clientId = ConfigurationManager.AppSettings["MonzoClientId"];
        private readonly string clientSecret = ConfigurationManager.AppSettings["MonzoClientSecret"];
        private readonly string rootUrl = ConfigurationManager.AppSettings["RootUrl"];

        public MonzoController(IMonzoService monzoService)
        {
            _monzoAuthorizationClient = new MonzoAuthorizationClient(clientId, clientSecret, rootUrl);
            this.monzoService = monzoService ?? throw new ArgumentNullException(nameof(monzoService));
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
        public async Task<ActionResult> AddIncome(string monzoTransId, decimal amount, string date, int selectedId, int? secondCatId = null)
        {
            var dto = new IncomeDTO
            {
                Amount = amount,
                SourceId =     selectedId,
                SecondSourceId = secondCatId,
                Date = DateTime.ParseExact(date, "yyyy-MM-ddTHH:mm", new CultureInfo("en-GB")),
                MonzoTransId = monzoTransId
            };

            await monzoService.AddIncome(dto);

            return View("Close");
        }

        [HttpPost]
        public async Task<ActionResult> AddSpending(string monzoTransId, string name, decimal amount, string date, bool isFinance, int selectedId, int? secondCatId = null, decimal? potTopup = null)
        {
            // add to savings-pot
            if (potTopup.HasValue && potTopup.Value != 0 && !isFinance)
            {
                var potIncomeDto = new IncomeDTO
                {
                    Amount = potTopup.Value,
                    SourceId = (int)Categories.SavingsPot,
                    Date = DateTime.ParseExact(date, "yyyy-MM-ddTHH:mm", new CultureInfo("en-GB")),
                    MonzoTransId = monzoTransId
                };

                var potSpendingDto = new SpendingDTO
                {
                    Name = $"{name} (savings top-up)",
                    Amount = potTopup.Value,
                    CatId = (int)Categories.Savings,
                    Date = DateTime.ParseExact(date, "yyyy-MM-ddTHH:mm", new CultureInfo("en-GB")),
                    MonzoTransId = monzoTransId
                };

                await monzoService.AddIncome(potIncomeDto);
                await monzoService.AddSpending(potSpendingDto);
            }

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

            await monzoService.AddSpending(dto);

            return View("Close");
        }

        [HttpGet]
        public async Task<ActionResult> AddTransaction(string monzoTransId, string name, long amount, string date, bool? isFinance, int? Id, CategoryType? secondTypeId)
        {
            var viewModel = new AddTransactionVM
            {
                IsFinance = isFinance ?? false
            };

            if (Id.HasValue)
            {
                 viewModel.SelectedId = Id.Value;
            }

            viewModel.Date = date;
            viewModel.MonzoTransId = monzoTransId;
            viewModel.Amount = amount; 

            if (amount < 0)
            {
                var finances = await monzoService.GetFinances();
                viewModel.Finances = finances;
                viewModel.Name = name;
                viewModel.Type = CategoryType.Spendings;

                if (!viewModel.IsFinance.Value)
                {
                    decimal fullAmount = Math.Ceiling(-amount / 100m);
                    viewModel.PotTopup = fullAmount - (-amount / 100m);
                }
 
                viewModel.ActualAmount = (-amount / 100m);
            }
            else
            {
                viewModel.Type = CategoryType.Income;
                viewModel.ActualAmount = (amount / 100m);
            }

            // get categories and sub-categories
            var categories = await monzoService.GetCategories(amount < 0 ? CategoryType.Spendings : CategoryType.IncomeSources);
            viewModel.Categories = categories;

            if (secondTypeId.HasValue && secondTypeId != 0)
            {
                var secondCategories = await monzoService.GetCategories(secondTypeId);
                viewModel.SecondCategories = secondCategories;
            }

            return View("AddTransaction", viewModel);
        }

        public async Task<ActionResult> ApproveDataAccess(string accessToken)
        {
            // fetch transactions etc
            using (var client = new MonzoClient(accessToken))
            {
                var accounts = await client.GetAccountsAsync();
                var balance = await client.GetBalanceAsync(accounts[0].Id);
                var getTransactions = (await client.GetTransactionsAsync(accounts[0].Id, expand: "merchant"))
                    .OrderByDescending(x => x.Created)
                    .Take(100)
                    .ToList();

                var spentToday = getTransactions
                    .Where(x => x.Created.Date == DateTime.UtcNow.Date && x.Amount < 0)
                    .Sum(x => x.Amount / 100m);

                var transactions = new List<MonzoTransaction>();

                if (getTransactions.Any())
                {
                    foreach (var trans in getTransactions)
                    {
                        transactions.Add(new MonzoTransaction
                        {
                            Id = trans.Id,
                            Amount = trans.Amount,
                            Created = trans.Created,
                            Name = trans.Merchant?.Name ?? trans.Description,
                            Logo = trans.Merchant?.Logo,
                            Category = trans.Category
                        });
                    }
                }

                var viewModel = new AccountSummaryModel
                {
                    SpentToday = spentToday,
                    Account = accounts[0],
                    Balance = balance,
                    Transactions = transactions
                };

                var syncTransactions = await monzoService.SyncTransactions(transactions);
                viewModel.SyncedTransactions = syncTransactions;

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
