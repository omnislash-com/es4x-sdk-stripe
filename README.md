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
