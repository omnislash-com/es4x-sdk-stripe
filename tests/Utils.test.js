/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from 'es4x-utils/src/utils/DateUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';

import { StripeAPI } from '../src/StripeAPI';
const	config = require('./test_config.json');

const suite = TestSuite.create("ES4X Test: Utils");


suite.test("StripeAPI.VerifySignature", function (context) {

	//NOT WORKING

	let	key = "";
	let	signature = "";
	let	data = {};
	let	isTest = true;

	let	isOk = StripeAPI.VerifySignature(signature, data, key, isTest);

	context.assertEquals(isOk, true);
	
});

suite.run();
