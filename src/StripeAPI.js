import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';
import { LogUtils } from 'es4x-utils/src/utils/LogUtils';
import { WebClientMgr } from 'es4x-utils/src/network/WebClientMgr';
import { QueryUtils } from 'es4x-utils/src/network/QueryUtils';
import { StringUtils } from 'es4x-utils/src/utils/StringUtils';

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
			dataToSend = ObjUtils.SerializeObject(_data, "&", "=");
			console.log(dataToSend);
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

}

module.exports = {
	StripeAPI
};