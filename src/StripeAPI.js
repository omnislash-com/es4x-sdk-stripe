import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';
import { LogUtils } from 'es4x-utils/src/utils/LogUtils';
import { WebClientMgr } from 'es4x-utils/src/network/WebClientMgr';
import { QueryUtils } from 'es4x-utils/src/network/QueryUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';
import { ArrayUtils } from 'es4x-utils/src/utils/ArrayUtils';

class	StripeAPI
{
	static	get	API_HOST()		{ return "api.stripe.com";	}
	static	get	API_VERSION()	{ return "v1";	}


	constructor(_vertx, _defaultSecretKey)
	{
		this.__vertx = _vertx;
		this.__webClient = null;

		this.__secretKey = _defaultSecretKey;
	}

	getWebClient()
	{
		// lazy load the web client only when we need it
		if (this.__webClient == null)
		{
			this.__webClient = new WebClientMgr(this.__vertx);
		}

		// return it
		return this.__webClient;		
	}

	async	query(_method, _path, _data = null, _secretKey = "")
	{
		// prepare the header
		let	secretKey = StringUtils.IsEmpty(_secretKey) ? this.__secretKey : _secretKey;
		let	headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Bearer ' + secretKey
		};

		// format the data to send
		let	dataToSend = null;
		if (_data != null)
		{
			// first we flatten it
			let	flattenObj = ObjUtils.Flatten(_data, false, true, "", false, true, true);
			console.log(flattenObj);
			
			// serialize it
			dataToSend = ObjUtils.SerializeObject(flattenObj);
		}

		// add the version to the path
		let	fullPath = "/" + StripeAPI.API_VERSION + _path;

		// run the query
		let	response = await this.getWebClient().query(_method, StripeAPI.API_HOST, fullPath, dataToSend, headers, true, false);

		return response;
	}

	// connected account: create
	// doc: https://stripe.com/docs/api/accounts/create
	async	connect_createAccount(_type = "express", _secretKey = "")
	{
		// prepare the data
		let	data = {
			type: _type
		};
		let	path = "/accounts";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);
	}

	// connected account: read
	// doc: https://stripe.com/docs/api/accounts/retrieve?lang=curl
	async	connect_readAccount(_id, _secretKey = "")
	{
		let	path = "/accounts/" + _id;

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	// connected account: create account link
	// doc: https://stripe.com/docs/api/account_links/create
	async	connect_createAccountLink(_id, _refreshUrl, _returnUrl, _secretKey = "")
	{
		// prepare the data
		let	data = {
			account: _id,
			refresh_url: _refreshUrl,
			return_url: _returnUrl,
			type: "account_onboarding"
		};
		let	path = "/account_links";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);		
	}

	// connected account: create login link
	// doc: https://stripe.com/docs/connect/integrate-express-dashboard#create-login-link
	async	connect_createLoginLink(_id, _secretKey = "")
	{
		// prepare the data
		let	path = "/accounts/" + _id + "/login_links";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, null, _secretKey);		
	}

	// create a Checkout session
	// doc: https://stripe.com/docs/api/checkout/sessions/create
	// - structure of each item:
	// -- name
	// -- price
	// -- quantity (optional, defaut 1)
	// -- description (optional)
	// -- metadata (optional)
	// doc about splitting charge and transfers:
	// - https://stripe.com/docs/connect/separate-charges-and-transfers
	// - https://stripe.com/docs/api/transfers/create
	async	checkout_createPaymentSession(_id, _items, _serviceFee, _successUrl, _orderDescription = null, _customerEmail = null, _customerId = null, _cancelUrl = null, _internalId = null, _metaData = null, _currency = "usd", _secretKey = "", _savePayment = true, _skipTransfer = false, _transferGroup = "")
	{
		_customerEmail = StringUtils.IsEmpty(_customerEmail) ? null : _customerEmail;

		// prepare the data
		let	data = {
			line_items: StripeAPI.PrepareLineItems(_items, _currency),
			mode: "payment",
			success_url: _successUrl,
			cancel_url: StringUtils.IsEmpty(_cancelUrl) ? null : _cancelUrl,
			client_reference_id: _internalId,
			currency: _currency,
			customer: StringUtils.IsEmpty(_customerId) ? null : _customerId,
			customer_email: StringUtils.IsEmpty(_customerEmail) ? _customerEmail : null,
			customer_creation: StringUtils.IsEmpty(_customerId) ? "always" : null,
			metadata: _metaData,
			payment_intent_data: {
				description: StringUtils.IsEmpty(_orderDescription) ? null : _orderDescription,
				metadata: _metaData
			},
			allow_promotion_codes: true,
		};

		// transfer?
		if (_skipTransfer == false)
		{
			data.payment_intent_data["application_fee_amount"] = _serviceFee;
			data.payment_intent_data["transfer_data"] = {
				destination: _id
			};
		}

		// transfer group?
		if (StringUtils.IsEmpty(_transferGroup) == false)
		{
			data.payment_intent_data["transfer_group"] = _transferGroup;
		}

		// save payment?
		if (_savePayment == true)
		{
			data.payment_intent_data["setup_future_usage"] = "off_session";
		}

		let	path = "/checkout/sessions";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);		
	}

	// get total details breakdown: read
	// doc: https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-total_details-breakdown-discounts
	async	checkout_getTotalBreakdownDetails(_id, _secretKey = "")
	{
		let	path = "/checkout/sessions/" + _id + "?expand[]=total_details.breakdown";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	// get coupon info
	async checkout_getCouponInfo(_id, _secretKey = "")
	{
		let totalBreakdownDetails = await this.checkout_getTotalBreakdownDetails(_id, _secretKey)
		
		if (totalBreakdownDetails.content && ObjUtils.GetValueToInt(totalBreakdownDetails, "content.total_details.amount_discount")) 
		{
			let data = {
				coupon_id: ObjUtils.GetValueToString(totalBreakdownDetails, "content.total_details.breakdown.discounts[0].discount.coupon.id"),
				coupon_promo_id: ObjUtils.GetValueToString(totalBreakdownDetails, "content.total_details.breakdown.discounts[0].discount.promotion_code"),
				coupon_amount: ObjUtils.GetValueToInt(totalBreakdownDetails, "content.total_details.amount_discount")
			}

			return data
		}

		return null
	}

	// https://stripe.com/docs/api/payment_intents/create
	async	paymentIntent_createAndConfirm(_id, _amount, _serviceFee, _customerId, _orderDescription = null, _customerEmail = null, _internalId = null, _metaData = null, _currency = "usd", _secretKey = "", _skipTransfer = false, _transferGroup = "")
	{
		_customerEmail = StringUtils.IsEmpty(_customerEmail) ? null : _customerEmail;

		// retrieve the payment id
		let	paymentId = await this.customer_getPaymentMethodIdForOffSession(_customerId, _secretKey);
		if (StringUtils.IsEmpty(paymentId) == true)
			return null;

		// prepare the data
		let	data = {
			amount: _amount,
			currency: _currency,
			confirm: true,
			customer: _customerId,
			description: StringUtils.IsEmpty(_orderDescription) ? null : _orderDescription,
			metadata: _metaData,
			off_session: true,
			payment_method: paymentId,
			receipt_email: StringUtils.IsEmpty(_customerEmail) ? _customerEmail : null,
//			client_reference_id: _internalId,
		};

		// transfer?
		if (_skipTransfer == false)
		{
			data["application_fee_amount"] = _serviceFee;
			data["transfer_data"] = {
				destination: _id
			};
		}

		// transfer group?
		if (StringUtils.IsEmpty(_transferGroup) == false)
		{
			data["transfer_group"] = _transferGroup;
		}

		let	path = "/payment_intents";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);				
	}

	// retrieve payment intent
	// doc: https://stripe.com/docs/api/payment_intents/retrieve?lang=curl
	async	paymentIntent_retrieve(_id, _secretKey = "")
	{
		let	path = "/payment_intents/" + _id;

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	async	paymentIntent_getLastCharge(_id, _secretKey = "")
	{
		// retrieve it
		let	paymentIntentInfo = await this.paymentIntent_retrieve(_id, _secretKey);

		// find the last charge id
		return ObjUtils.GetValueToString(paymentIntentInfo, "content.latest_charge");
	}

	static	PrepareLineItems(_items, _currency)
	{
		let	finalItems = [];
		for(let item of _items)
		{
			finalItems.push(StripeAPI.PrepareLineItem(item, _currency));
		}
		return finalItems;
	}

	// - structure of each item:
	// -- name
	// -- price
	// -- quantity (optional, defaut 1)
	// -- description (optional)
	// -- metadata (optional)
	static	PrepareLineItem(_item, _currency)
	{
		let	newItem = {
			price_data: {
				currency: _currency,
				product_data: {
					name: ObjUtils.GetValueToString(_item, "name", "Item"),
					description: ObjUtils.GetValue(_item, "description"),
					metadata: ObjUtils.GetValue(_item, "metadata"),
				},
				unit_amount: ObjUtils.GetValueToInt(_item, "price")
			},
			quantity: ObjUtils.GetValueToInt(_item, "quantity", 1)

		};

		return newItem;
	}

	// Create a customer
	// doc: https://stripe.com/docs/api/customers/create
	async	customer_create(_metaData = null, _email = null, _name = null, _description = null, _secretKey = "")
	{
		// prepare the data
		let	data = {
			metadata: _metaData,
			email: StringUtils.IsEmpty(_email) ? null : _email,
			name: _name,
			description: StringUtils.IsEmpty(_description) ? null : _description,
		};

		let	path = "/customers";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);			
	}

	// Gets the customer
	// doc: https://stripe.com/docs/api/customers/retrieve
	async	customer_get(_customerId, _secretKey = "")
	{
		let	path = "/customers/" + _customerId;

		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	// List payment methods
	// doc: https://stripe.com/docs/api/payment_methods/customer_list
	async	customer_listPaymentMethods(_customerId, _secretKey = "")
	{
		let	path = "/customers/" + _customerId + "/payment_methods";

		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	async	customer_getPaymentMethodIdForOffSession(_customerId, _secretKey = "")
	{
		// get the customer info
		let	customerInfo = await this.customer_get(_customerId, _secretKey);

		// do we have a default source?
		let	defaultPaymentId = ObjUtils.GetValueToString(customerInfo, "content.default_source");
		if (StringUtils.IsEmpty(defaultPaymentId) == false)
			return defaultPaymentId;

		// get the list of payment method
		let	methodsRet = await this.customer_listPaymentMethods(_customerId, _secretKey);

		// get the list of methods
		let	allMethods = ObjUtils.GetValue(methodsRet, "content.data", []);

		// return the id of the first one
		return ObjUtils.GetValueToString(allMethods, "[0].id");
	}

	// create a new transfer
	// doc: https://stripe.com/docs/api/transfers/create
	async	transfer_create(_destinationId, _amount, _description = "", _transferGroup = "", _metaData = null, _currency = "usd", _secretKey = "", _sourceTransaction = "")
	{
		// prepare the data
		let	data = {
			amount: _amount,
			currency: _currency,
			destination: _destinationId,
			description: StringUtils.IsEmpty(_description) ? null : _description,
			metadata: _metaData,
			transfer_group: StringUtils.IsEmpty(_transferGroup) ? null : _transferGroup,
			source_transaction: StringUtils.IsEmpty(_sourceTransaction) ? null : _sourceTransaction
		};

		let	path = "/transfers";

		// perform the query
		return await this.query(QueryUtils.HTTP_METHOD_POST, path, data, _secretKey);			
	}

	// doc: https://stripe.com/docs/webhooks#verify-manually
	static	VerifySignature(_signature, _data, _key, _test = false)
	{
		// Split the signature with ,
		let	chunks = _signature.split(",");

		// find the timestamp and the scheme
		let	timestamp = "";
		let	scheme = "";
		let	schemeId = _test ? "v0" : "v1";
		for(let chunk of chunks)
		{
			// split with =
			let	subChunks = chunk.split("=");

			if (subChunks.length == 2)
			{
				// timestamp?
				if (subChunks[0] == "t")
					timestamp = subChunks[1];
				// scheme?
				else if (subChunks[0] == schemeId)
					scheme = subChunks[1];
			}
		}

		// not found
		if ( (StringUtils.IsEmpty(timestamp) == true) || (StringUtils.IsEmpty(scheme) == true) )
			return false;

		// create the payload
		let	payload = timestamp + "." + JSON.stringify(_data);

		// hash the payload
		let	payloadHash = StringUtils.HMACSHA256(_key, payload);

		console.log("Timestamp = " + timestamp);
		console.log("Payload = " + payload);
		console.log("Calculated: " + payloadHash);
		console.log("VS " + scheme);

		return payloadHash == scheme;
	}

	// doc: https://stripe.com/docs/api/coupons/retrieve
	async	coupon_findCoupon(_id, _secretKey = "")
	{
		let	path = "/coupons/" + _id;

		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}

	// doc: https://stripe.com/docs/api/promotion_codes/retrieve
	async	promotionCode_findPromotionCode(_id, _secretKey = "")
	{
		let	path = "/promotion_codes/" + _id ;

		return await this.query(QueryUtils.HTTP_METHOD_GET, path, null, _secretKey);
	}
}

module.exports = {
	StripeAPI
};