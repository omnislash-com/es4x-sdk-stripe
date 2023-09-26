/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: PaymentIntent");


suite.test("StripeAPI.paymentIntent_createAndConfirm", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// create the payment session
		let	accountId = "acct_1NYeisQ2li0b1S5Y";
		let	amount = 10000;
		let	serviceFee = 550 + 350;
		let	orderDescription = null;
		let	customerEmail = "mike.jegat@gmail.com";
		let	customerId = "cus_ONY27zDlOdmaaD";
		let	internalId = 3;
		let	metadata = {
			id: 3,
			confirmation_number: "aaaaa",
			root_id: 1
		};

		let	paymentIntent = await stripeApi.paymentIntent_createAndConfirm(accountId, amount, serviceFee, customerId, orderDescription, customerEmail, internalId, metadata);

		console.log(paymentIntent);


		context.assertNotNull(paymentIntent);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
