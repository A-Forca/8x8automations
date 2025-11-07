# Mobile Verification

## Tutorial: Learn how to use API for Mobile Verification Code Generation & Validation

### Introduction

One of the most common use cases for SMS is about conveying a one-time password (OTP) to an end user's mobile phone.

8x8 offers a dedicated API service to make SMS OTP verification process easier for you.

In this tutorial, we are going to cover the following two methods: [Mobile Verification - Code Generation](/connect/reference/verify-request-v2) and [Mobile Verification - Code Validation](/connect/reference/code-validation-v2). As their names put it, they are about generating then sending a code to a user and then verifying it.

If you follow the different steps of this tutorial, you will get to generate a code and verify it directly from your command line utility using a simple curl command.

### Prerequisites

* Command line interface compatible with CURL
* 8x8 CPaaS account
* apiKey (Bearer token)
* 8x8 CPaaS subaccountid
* Destination phone number
* SMS Body
* Brand name (SMS SenderID)

---

### Account and credentials

*You will need to sign up to use the API. The following steps will guide you through this process and highlight the information to keep aside.*

#### I. Signing-up

1. Head to [8x8 Connect sign-up page](https://connect.8x8.com/login/signup)
2. Enter your email and follow the instructions to define your password and finalize your account (by default, API password and account password are the same, you can modify this from your account settings)
3. Confirm your email address by clicking on the validation link you received in the activation email to activate your account.

![Signup 8x8 connect](../images/45380f8-Signup_8x8_connect.png "Signup 8x8 connect.png")

#### II. Finding your apiKey token (for API authentication)

1. Head to [8x8 Connect Login Page](https://connect.8x8.com).
2. Click on LOG IN.
3. Enter your email address and password to get access to your account dashboard.
4. Head over to the **side menu > API keys** section
5. Create an API key if empty and then keep the API Key value, here: `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`

![image](../images/441a309-API_2.png "API 2.png")

#### III. Identifying your Subaccountid

1. Head over to the pricing section and use the subaccountid list to retrieve the `subaccountid` that you want to use
2. By default, your account comes with only one `subaccountid` for your high-quality service. It is designated by your `accountid` and the suffix `_hq`.
3. Note down this value, you will need it later.
4. In that example, the `subaccountid` is `riders_hq`

![image](../images/9c38989-API_3.png "API 3.png")

---

### Part 1: Generating and sending a code using the Mobile Verification API - Code Generation method

The 8x8 Mobile Verification - Code Generation method expects requests sent by developers to respect a specific format.  

In the following parts, we are going to go over the different elements of the request:

* the URL format
* the authentication
* the data payload.

At the end of the section, we will generate a curl command to generate an SMS containing a one-time password directly from the command line.

#### I. Preparing the request URL

##### Remarks

* We are going to send a POST request to the Mobile Verification API - Code Generation endpoint.
* As detailed in the [documentation](/connect/reference/verification-api), the URL is defined by the following pattern: `https://verify.8x8.com/api/v2/subaccounts/{subAccountId}/sessions`

##### Tutorial URL

* In order to create the URL to use, we are going to replace `{subaccountid}` in the pattern above by `riders_hq`, the subaccountid that we are using in this tutorial
* In that example, the URL that we are going to send the request to is: `https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions`

##### Data Center Region

* To ensure the use of the correct data center region, it is necessary to modify the base URL to correspond with the provisioned region of your account. Refer to the table below for the appropriate base URL associated with each data center region:

| URL | Region |
| --- | --- |
| [https://verify.8x8.com](https://verify.8x8.com) | Asia Pacific (default) |
| [https://verify.us.8x8.com](https://verify.us.8x8.com) | North America |
| [https://verify.8x8.uk](https://verify.8x8.uk) | Europe |
| [https://verify.8x8.id](https://verify.8x8.id) | Indonesia |

* For more information on data center regions, please visit the following [page](/connect/docs/data-center-region).

#####

##### curl

* In curl, we will have to indicate that we want to do a POST request to this URL by using the following command:

```bash
curl -i -X "POST" https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions

```

* The `-i` flag (case-sensitive) will allow to print the request and response body and headers
* The `-X` flag is used to specify the HTTP method to use for the request (POST, HEAD, PUT, GET, DELETE...) - Here we are using a POST request.

#### II. Preparing the request authentication

#### Remarks

* As explained in the [docs](/connect/docs/authentication), the API authentication uses an apiKey bearer token method.

#### Tutorial authentication

* In this tutorial, the apiKey for our account is `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`.

#### curl

* In a curl request, bearer tokens must be passed as a header like so: `-H "Authorization: Bearer {token}"`
* We just have to replace our `{token}` placeholder by our apiKey
* The authorization header will then look like that: `-H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg"`

#### III. Preparing the request data payload

* The API expects to receive a structured request containing the SMS data in a specific format.
* As detailed in the [documentation](/sms/API-Reference/mobile-verification-api/send-otp), the data that we have to submit should be a JSON object containing at least a **destination** field. Let's keep it simple and add a brand name as well as a country code since our destination phone number is in the national format (as opposed to the international format):

*Example of JSON object:*

```json
{
  "destination": "98765432",
  "country": "SG",
}

```

#### curl

* In curl, we will transmit the JSON data inline and indicate that the data payload is in JSON format using the following commands:

```bash
-H "Content-Type: application/json" 
-d $'{
  "destination": "98765432",
  "country": "SG"
}'

```

#### IV. Putting it together and posting the curl request

* If we wrap up all the elements prepared in the steps above, we should put together the 3 elements of our request: **URL + Authentication + Data Payload**
* To send the API request to 8x8 Mobile Verification - Code Generation endpoint we should use the following command in our command line utility:

```bash
curl -i -X "POST" https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions -H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg" -H "Content-Type: application/json" -d $'{ "destination": "6598765432", "country": "SG"}'

```

* And that’s it! Here is the result on the destination device:

![image](../images/748c827-Iv_Curl.png "Iv Curl.png")

#### V. API response

* When sending the curl command above from your command line utility, you notice that the 8x8 API sends back a response that shows up in your terminal, for example in this tutorial:

```json
{
  "sessionID": "7c1137e8fb1ceb11827c00155dc319db",
  "verifyUri": "/api/v2/subaccounts/riders_hq/sessions/",
  "destination": 6598765432,
  "status": "WAITING",
  "attempt": 0,
  "expiresAt": "2020-11-02T11:14:44.70Z",
  "retryAfter": "2020-11-02T11:09:54.70Z"
}

```

* The API response is used to provide feedback about the expected result of the API request (sending an SMS) and various additional information.
* If we take some time to analyze the different elements there, we can identify the following:
  * **uid**: this is the unique identifier set by the API to identify this request. It will be used to check its status and the codes provided.
  * **resourceUri**: it indicates the uniform resource identifier within 8x8 API
  * **destination**: this is the phone number to which the SMS was sent.
  * **status**: the status of the Mobile Verification request
  * **attempt**: this counter shows how many unsuccessful attempts have been made to verify this code
  * **expiresAt**: this is the timestamp that indicates when the code will expire
  * **retryAfter**: this timestamp indicates when the system will allow sending another SMS if a new request is sent
* For more information, check the dedicated section of the [API documentation](/sms/API-Reference/mobile-verification-api/send-otp), in the "Response" section

### Part 2: Verifying a code received using the Mobile Verification API - Code Validation method

So our user received successfully his SMS containing the code required to verify his mobile phone number (*see [Part 1 - IV]*).

Here below are the elements from the part 1 that are going to be used in this part 2:

* **apiKey** = `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`
* **Subaccountid** = *riders_hq*
* **sessionId** = *7c1137e8fb1ceb11827c00155dc319db*
* **code** = *5612*

#### Request URL

According to the [documentation](/sms/API-Reference/mobile-verification-api/verify-otp), the 8x8 Mobile Verification - Code Validation method is much simpler to use: it simply expects a **GET request** sent to a URL built using 2 different parameters:

* **the subaccountid:** *riders_hq*
* **the sessionID returned by the API during part 1:** *7c1137e8fb1ceb11827c00155dc319db*

➡ the URL where to send the GET request should follow this structure:  

`https://verify.8x8.com/api/v2/subaccounts/{subAccountId}/sessions/{sessionId}`

In our example, we just have to use the parameters' values listed above to compose our URL: `https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions/7c1137e8fb1ceb11827c00155dc319`

#### curl

In curl, we will have to indicate that we want to do a POST request to this URL by using the following command:

```bash
curl -i -X "GET" https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions/7c1137e8fb1ceb11827c00155dc319

```

#### II. Preparing the request authentication

#### Remarks

* As explained in the [docs](/connect/docs/authentication), the API authentication uses an apiKey bearer token method.

#### Tutorial authentication

* In this tutorial, the apiKey for our account is `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`.

#### curl

* In a curl request, bearer tokens must be passed as a header like so: `-H "Authorization: Bearer {token}"`
* We just have to replace our `{token}` placeholder by our apiKey
* The authorization header will then look like that: `-H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg"`

#### III. Preparing the request data payload

#### Remarks

* Contrary to the POST request in part 1, the data here is passed using a query string: the parameters are appended directly in the URL where we send the GET request
* This method can be used to consult the status of a request without actually verifying it: if no code value is appended in the GET request URL, then the API will respond with the status of the request without changing it.
* To perform the validation action, a code value must be appended in the GET request URL: if the code is the right one and has not expired, the status of the request will be changed to VERIFIED. If the code is not the right one, the attempt counter will be incremented.

#### Appending the code in the query string for our code validation

* Our code value is 5612
* A query string is appended at the end of the URL using `?` as separator and then `{parameter_name}={parameter_value}`

➡ We will have to append the following query string to our URL: `?code=5612`

#### IV. Putting it together and posting the curl request

* If we wrap up all the elements prepared in the steps above, we should put together the 3 elements of our request: **URL + Query string appended + Authentication**
* To send the API request to 8x8 Mobile Verification - Code Validation endpoint we should use the following command in our command line utility:

```bash
curl -X GET  'https://verify.8x8.com/api/v2/subaccounts/riders_hq/sessions/7c1137e8fb1ceb11827c00155dc319?code=5612' -H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg"

```

* And that’s it! Here is the response from our terminal:

```json
{
  "uid": "7c1137e8fb1ceb11827c00155dc319",
  "resourceUri": "/api/v2/subaccounts/riders_hq/sessions/7c1137e8fb1ceb11827c00155dc319",
  "destination": 6598765432,
  "status": "VERIFIED",
  "attempt": 0,
  "expiresAt": "2020-11-02T13:19:56.70Z",
  "nextSmsAfter": "2020-11-02T13:14:44.70Z"
}

```

You can see that the status of the request is now verified: the code provided was the right one which means that your user provided a legitimate mobile phone number where he received the code generated by the API, you can let him through!
