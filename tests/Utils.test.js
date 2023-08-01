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
	
	let	key = "whsec_7L9HryRDS6mNmW6wiftsUOmCPQO7aVeu";
	let	signature = "t=1690921897,v1=1b47417e05ac9118ac87ab8192e1960d81886641338580808dd878996147c4f4,v0=e7b3d6b10f5175b47fac8fe1c71c0ec67d6632f7648a01b503d28261adf5c26a";
	let	data = {};
	let	isTest = true;

	let	isOk = StripeAPI.VerifySignature(signature, data, key, isTest);

	context.assertEquals(isOk, true);
	
});

suite.run();
