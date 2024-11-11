# Introduction
This library offers a SDK to access Stripe services for the [ES4X Runtime](https://github.com/reactiverse/es4x).

Right now only a few methods have been created:
- **Connect accounts**
- **Checkout Session**

# Usage
## Add dependency
For now just add the Github url to your dependencies in the **package.json** file:
```
"dependencies": {
	"@vertx/core": "4.1.0",
	"@vertx/web": "4.2.5",
	"@vertx/web-client": "4.2.5",
	"es4x-sdk-stripe": "git+https://github.com/omnislash-com/es4x-sdk-stripe.git#main"
}
```

# Maintenance
Update ES4X Utils:
```bash
npm run update:helpers
```


curl -G https://api.stripe.com/v1/prices -u "sk_test_51POQH4DfcuRotOGvkVCSoJc07Cs8fSlwFGZ3dr2p1WhnAZ7fyTxZi86TlX6lMlsVZ9SrYAltIzaxi3JmsB07Hbmt00JylR9bs2:" -d "lookup_keys[]"="standard_monthly" -d "lookup_keys[]"="standard_yearly" -d "currency"="eur"


