/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Price");


suite.test("StripeAPI.prices_listFromLookupKeys", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// get the list of prices
		let	lookup_keys = ["standard_monthly", "standard_yearly"];
		let	populateProduct = true;
		let	populateCurrencies = true;

		let	ret = await stripeApi.prices_listFromLookupKeys(lookup_keys, populateProduct, populateCurrencies);

		console.log(ret);
		context.assertNotNull(ret);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.prices_read", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// read a price
		let	id = "price_1QHZwODfcuRotOGvLsZioxfI";
		let	populateProduct = true;
		let	populateCurrencies = true;

		let	ret = await stripeApi.prices_read(id, populateProduct, populateCurrencies);

		console.log(ret);
		context.assertNotNull(ret);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});

suite.test("StripeAPI.prices_readFromLookupKeyToInfo", async function (context) {

	let async = context.async();

	try
	{
		// create the new STRIPE Api object
		let	stripeApi = new StripeAPI(vertx, config.secret_key);

		// get the list of prices
		let	lookup_key = "standard_yearly";
		let	currency = "eur";

		let	ret = await stripeApi.prices_readFromLookupKeyToInfo(lookup_key, currency);

		console.log(ret);
		context.assertNotNull(ret);

		async.complete();
	}
	catch(e)
	{
		console.trace(e);
		async.complete();
	}
});


suite.run();
