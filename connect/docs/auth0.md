# Auth0

## Auth0 integration

### About Auth0

[Auth0](https://auth0.com) is an identity management platform that let applications developers easily implement authentication and authorisation logic into their applications.  

Coupled with 8x8 SMS connectivity, it allows developers to send one-time passwords via the Auth0 platform to their users all over the World.

### Integrating Auth0 with 8x8 SMS API

To leverage SMS API to send OTP codes to your users, you will be using the hook feature in Auth0.  

More specifically, you will be using the "Send a phone message" hook and adapt it to send requests to 8x8 SMS API.

#### Prerequisites

* [Auth0 account](https://auth0.com/signup?place=header&type=button&text=sign%20up)
* [8x8 CPaaS subaccount](https://connect.8x8.com/messaging/api-keys)
* [8x8 CPaaS apikey](https://connect.8x8.com/messaging/api-keys)

#### Steps

1. In your [Auth0 portal](https://manage.auth0.com/dashboard/), go to the Auth pipeline > Hooks section.
2. Select "Create a hook" in the top right corner.
3. You can call it by any name, let's call it "8x8".
4. Select type "Send phone message" and click on "Create".
5. Scroll down on the Hooks page to the "Send phone message" section and click on the pencil/edit button to edit the hook you just created.
6. Click on the wrench icon (settings) and select "Secrets".
7. Select "Add Secret" and input for secret key: `subaccount` and for secret value, your 8x8 SMS subaccount (can be obtained in [8x8 Connect portal - API Keys section](https://connect.8x8.com/messaging/api-keys)).  

8.Select "Add Secret" and input for secret key: `apikey` and for secret value, your 8x8 SMS apikey (can be obtained in [8x8 Connect portal - API Keys section](https://connect.8x8.com/messaging/api-keys)).
8. Close the secrets and settings section.
9. Copy and paste this code in the code section of the hook in place of the code already there:

```javascript
module.exports = function (recipient, text, context, cb) {
    const axios = require("axios").default,
        API_KEY = context.webtask.secrets.apikey,
        SUBACCOUNT = context.webtask.secrets.subaccount,
        BASE_URL = "https://sms.8x8.com/api/v1/";
    let instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
    });
    instance({
        method: "post",
        url: `subaccounts/${SUBACCOUNT}/messages`,
        data: {
            "encoding": "AUTO",
            "destination": recipient,
            "text": text
        }
    })
        .then((response) => {
            cb(null, {});
        })
        .catch((error) => {
            cb(error);
        });

};

```

11. Save the code.
12. Click the play button to open the runner.
13. Wait for the logs stream to load.
14. Press the run button (Bottom right) .
15. Check that you have no errors in the hook log stream and the response has a status code of 200.
16. Check 8x8 Connect logs and verify that you Auth0 submitted an SMS to the test number with your account.
17. You're all set! You can now use this hook in your Auth pipeline!

#### Video steps
