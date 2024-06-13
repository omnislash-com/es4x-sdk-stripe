/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Checkout");


suite.test("StripeAPI.checkout_createPaymentSession", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// create the payment session
		let	accountId = "acct_1NYeisQ2li0b1S5Y";
		let	items = [
			{
				"name": "August matchup",
				"description": "Registration for Tony Snell",
				"price": 10000,
				"metadata": {
					"item_id": 2,
					"item_type": "event",
					"item_dest_id": 1
				}
			},
			{
				"name": "Service fee",
				"price": 550
			}
		];
		let	serviceFee = 550 + 350;
		let	successUrl = "https://example.com/success";
		let	cancelUrl = "https://example.com/cancel";
		let	orderDescription = null;
		let	customerEmail = "mike.jegat@gmail.com";
		let	customerId = null;
		let	internalId = 3;
		let	metadata = {
			id: 3,
			confirmation_number: "aaaaa",
			root_id: 1
		};
		let	skipTransfer = true;
		let	transferGroup = "TESTGROUP";

		let	sessionInfo = await stripeApi.checkout_createPaymentSession(accountId, items, serviceFee, successUrl, orderDescription, customerEmail, customerId, cancelUrl, internalId, metadata, "usd", "", true, skipTransfer, transferGroup);

		context.assertNotNull(sessionInfo);
		context.assertEquals(sessionInfo.statusCode, 200);
		context.assertNotNull(sessionInfo.content);
		context.assertNotEquals(sessionInfo.content.url, "");
		console.log("-> session url: " + sessionInfo.content.url);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.checkout_getTotalBreakdownDetails", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		const id = 'cs_test_b1phSHQ6SVSS9VCxpejkVedmPclOZ0l3YrdsMc97cDVuldDFE4LNLV1ZAK'

		// do the query
		let	data = await stripeApi.checkout_getTotalBreakdownDetails(id);

		console.log(data)

		// check the response
		context.assertNotNull(data);
		context.assertEquals(data.statusCode, 200);
		context.assertNotNull(data.content);
		context.assertTrue(data.content.total_details.breakdown.discounts.length === 1);
		console.log("-> account read: " + data.content.id);
		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.checkout_createCaptureSession", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// create the payment session
		let	successUrl = "https://example.com/success";
		let	cancelUrl = "https://example.com/cancel";
		let	customerEmail = "mike.jegat@gmail.com";
		let	customerId = null;

		let	sessionInfo = await stripeApi.checkout_createCaptureSession(successUrl, customerEmail, customerId, cancelUrl);

		context.assertNotNull(sessionInfo);
		context.assertEquals(sessionInfo.statusCode, 200);
		context.assertNotNull(sessionInfo.content);
		context.assertNotEquals(sessionInfo.content.url, "");
		console.log("-> session url: " + sessionInfo.content.url);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
