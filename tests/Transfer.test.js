/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Transfer");


suite.test("StripeAPI.transfer_create", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// create the transfer
		let	accountId = "acct_1NYeisQ2li0b1S5Y";
		let	amount = 150;
		let	description = null;
		let	metadata = {
			id: 3,
			confirmation_number: "aaaaa",
			root_id: 1
		};
		let	transferGroup = "TESTGROUP2";

		let	transferInfo = await stripeApi.transfer_create(accountId, amount, description, transferGroup, metadata, "usd", "");

		console.log(transferInfo);

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
