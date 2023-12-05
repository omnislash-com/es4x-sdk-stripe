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
		let	skipTransfer = true;
		let	transferGroup = "TESTGROUP2";

		let	paymentIntent = await stripeApi.paymentIntent_createAndConfirm(accountId, amount, serviceFee, customerId, orderDescription, customerEmail, internalId, metadata, "usd", "", skipTransfer, transferGroup);

		console.log(paymentIntent);

		context.assertNotNull(paymentIntent);
		context.assertEquals(paymentIntent.statusCode, 200);

		// retrieve the id
		let	paymentIntentId = ObjUtils.GetValueToString(paymentIntent, "content.id");
		console.log("ID = " + paymentIntentId);

		// let's try to get it and its last charge
		let	lastCharge = await stripeApi.paymentIntent_getLastCharge(paymentIntentId);
		console.log("LAST CHARGE = " + lastCharge);

		context.assertEquals(StringUtils.IsEmpty(lastCharge), false);

		// do the transfer
		let	transferInfo = await stripeApi.transfer_create(accountId, serviceFee, "Test transfer", transferGroup, metadata, "usd", "", lastCharge);
		context.assertNotNull(transferInfo);
		context.assertEquals(transferInfo.statusCode, 200);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
