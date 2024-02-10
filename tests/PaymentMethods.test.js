/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: PaymentMethods");


suite.test("StripeAPI.paymentMethods_detach", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);
		
        let	paymentId = "card_1Oi35ALioETkVPjcu2TaoqaQ";

		let	paymentMethodInfo = await stripeApi.paymentMethods_detach(paymentId);

		context.assertNotNull(paymentMethodInfo);
		context.assertEquals(paymentMethodInfo.statusCode, 200);
		context.assertNotNull(paymentMethodInfo.content);
        console.log("-> payment method url: " + paymentMethodInfo.content.url);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
