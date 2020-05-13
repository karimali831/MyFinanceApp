﻿using Monzo;
using MyFinances.Helpers;
using MyFinances.Website.ViewModels;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
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
        private readonly string clientId = ConfigurationManager.AppSettings["MonzoClientId"];
        private readonly string clientSecret = ConfigurationManager.AppSettings["MonzoClientSecret"];
        private readonly string rootUrl = ConfigurationManager.AppSettings["RootUrl"];

        public MonzoController()
        {
            _monzoAuthorizationClient = new MonzoAuthorizationClient(clientId, clientSecret, rootUrl);
        }

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

                var viewModel = new AccountSummaryModel
                {
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
