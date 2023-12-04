/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Coupon");

suite.test("StripeAPI.coupon_findCoupon", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		const id = 'MOdzwUsm'

		// do the query
		let	coupon = await stripeApi.coupon_findCoupon(id);

		console.log(coupon)

		// check the response
		context.assertNotNull(coupon);
		context.assertEquals(coupon.statusCode, 200);
		context.assertNotNull(coupon.content);
		console.log("-> coupon read: " + coupon.content.id);
		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.run();
