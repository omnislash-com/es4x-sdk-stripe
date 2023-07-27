/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Connect");


suite.test("StripeAPI.connect_createAccount", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// do the query
		let	retCreate = await stripeApi.connect_createAccount();

		// check the response
		context.assertNotNull(retCreate);
		context.assertEquals(retCreate.statusCode, 200);
		context.assertNotNull(retCreate.content);
		console.log("-> account created: " + retCreate.content.id);

		// verify the account
		let	accountId = ObjUtils.GetValueToString(retCreate, "content.id");

		// read it
		let	retRead = await stripeApi.connect_readAccount(accountId);

		// check the response
		context.assertNotNull(retCreate);
		context.assertEquals(retCreate.statusCode, 200);
		context.assertNotNull(retCreate.content);
		context.assertEquals(retCreate.content.id, retRead.content.id);
		console.log("-> account read: " + retRead.content.id);

		// generate url to onboard
		let	returnUrl = config.connect.return_url;
		let	refreshUrl = config.connect.refresh_url;
		let	retLink = await stripeApi.connect_createAccountLink(accountId, refreshUrl, returnUrl);

		context.assertNotNull(retLink);
		context.assertEquals(retLink.statusCode, 200);
		context.assertNotNull(retLink.content);
		context.assertNotEquals(retLink.content.url, "");
		console.log("-> onboarding url: " + retLink.content.url);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
