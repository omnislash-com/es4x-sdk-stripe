/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Customer");


suite.test("StripeAPI.customer_create", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// create the payment session
		let	name = "Michael";
		let	description = null;
		let	email = "mike.jegat@gmail.com";
		let	metadata = {
			id: 3,
			type: "user"
		};

		let	info = await stripeApi.customer_create(metadata, email, name, description);

		context.assertNotNull(info);
		context.assertEquals(info.statusCode, 200);
		context.assertNotNull(info.content);
		context.assertNotEquals(info.content.id, "");
		context.assertEquals(info.content.email, email);
		console.log("=> customer id = " + info.content.id);
		
		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});


suite.test("StripeAPI.customer_get", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// get the list of payment methods
		let	customerId = "cus_ONY27zDlOdmaaD";

		let	info = await stripeApi.customer_get(customerId);

		context.assertNotNull(info);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.customer_listPaymentMethods", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// get the list of payment methods
		let	customerId = "cus_ONY27zDlOdmaaD";

		let	info = await stripeApi.customer_listPaymentMethods(customerId);

		context.assertNotNull(info);

		// get the list
		let	cards = ObjUtils.GetValue(info, "content.data", []);
		context.assertTrue(cards.length > 0);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.customer_getPaymentMethodIdForOffSession", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// get the list of payment methods
		let	customerId = "cus_ONY27zDlOdmaaD";

		let	paymentId = await stripeApi.customer_getPaymentMethodIdForOffSession(customerId);

		context.assertNotEquals(paymentId, "");
		console.log("Payment id => " + paymentId);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
