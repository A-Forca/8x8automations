# Single SMS

## Tutorial: Learn how to use API for sending single SMS

### **Introduction**

8x8 offers different API methods that allow you to send SMS programmatically.  

In this tutorial, we are going to cover the simplest method: [Send SMS](/connect/reference/send-sms)  

It is used to send SMS one by one.  

We also offer bulk methods that allow sending multiple SMS in one command - for more information, check the following methods in the documentation:  

[Send SMS batch](/connect/reference/send-sms-batch) and [Send SMS batch (compact)](/connect/reference/send-sms-batch-compact)  

If you follow the different steps of this tutorial, you will get to send an SMS directly from your command line utility using a simple curl command.

### Index

* Learn how to use the method for sending single SMS
* Prerequisites
* Account and credentials
* Signing-up
* Finding your apiKey bearer token (for API authentication)
* Identifying your Subaccountid
* API request
* Preparing the URL
* Preparing the authentication
* Preparing the data payload
* Putting it together and posting the curl request
* Going further
* API response
* API errors

In this tutorial, we are going to send the text “Bob, a special present for you from Santa” to the mobile phone number 12345678 registered on a Singaporean network (+65) using curl.  

For this, we are going to use an 8x8 account created with our email [amazingdeveloperr@gmail.com](mailto:amazingdeveloperr@gmail.com) .  

We are going to use our subaccountid `riders_hq`.  

The apiKey for our account is `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`.

### Prerequisites

* Command line interface compatible with CURL
* 8x8 CPaaS account
* apiKey (Bearer token)
* 8x8 CPaaS subaccountid
* Destination phone number
* SMS Body

---

### Account and credentials

*You will need to sign-up to use the API. The following steps will guide you through this process and highlight the information to keep aside.*

#### I. Signing-up

1. Head to [8x8 Connect sign-up page](https://connect.8x8.com/login/signup)
2. Enter your email and follow the instructions to define your password and finalize your account (by default, API password and account password are the same, you can modify this from your account settings)
3. Confirm your email address by clicking on the validation link you received in the activation email to activate your account.

![Signup 8x8 connect](../images/1678cef-Signup_8x8_connect.png "Signup 8x8 connect.png")

#### II. Finding your apiKey bearer token (for API authentication)

1. Head to [8x8 Connect Login Page](https://connect.8x8.com).
2. Click on LOG IN.
3. Enter your email address and password to get access to your account dashboard.
4. Head over to the **side menu > API keys** section
5. Create an API key if empty and then keep the API Key value, here: `5DhZxZR*************9pYmg`

![image](../images/e168c88-API_2.png "API 2.png")

#### III. Identifying your Subaccountid

1. Head over to the pricing section and use the subaccountid list to retrieve the `subaccountid` that you want to use
2. By default, your account comes with only one `subaccountid` for your high-quality service. It is designated by your `accountid` and the suffix `_hq`.
3. Note down this value, you will need it later.
4. In that example, the `subaccountid` is `riders_hq`

![image](../images/2c35b4c-API_3.png "API 3.png")

---

### API Request

The 8x8 SMS single method expects requests sent by developers to respect a specific format.  

In the following parts, we are going to go over the different elements of the request:

* the URL format
* the authentication
* the data payload.

At the end of the section, we will generate a curl command to send an SMS directly from the command line.

#### I. Preparing the request URL

##### Remarks

* We are going to send a POST request to the 8x8 API single URL endpoint.
* As detailed in the [Send SMS](/connect/reference/send-sms) , the URL is defined by the following pattern: `https://sms.8x8.com/api/v1/subaccounts/{subAccountId}/messages`

##### Tutorial URL

* In order to create the URL to use, we are going to replace `{subaccountid}` in the pattern above by `riders_hq`, the subaccountid that we are using in this tutorial
* In that example, the URL that we are going to send the request to is: `https://sms.8x8.com/api/v1/subaccounts/rider_hq/messages`

##### Data Center Region

* To ensure the use of the correct data center region, it is necessary to modify the base URL to correspond with the provisioned region of your account. Refer to the table below for the appropriate base URL associated with each data center region:

| URL                                              | Region                 |
|--------------------------------------------------|------------------------|
| [https://sms.8x8.com](https://sms.8x8.com)       | Asia Pacific (default) |
| [https://sms.us.8x8.com](https://sms.us.8x8.com) | North America          |
| [https://sms.8x8.uk](https://sms.8x8.uk)         | Europe                 |
| [https://sms.8x8.id](https://sms.8x8.id)         | Indonesia              |

* For more information on data center regions, please visit the following [page](/connect/docs/data-center-region).

##### curl

* In curl, we will have to indicate that we want to do a POST request to this URL by using the following command:

```bash
curl -X "POST" https://sms.8x8.com/api/v1/subaccounts/rider_hq/messages

```

#### II. Preparing the request authentication

#### Remarks

* As explained in the [Authentication Docs](/connect/docs/authentication), the API authentication uses an apiKey bearer token method.

#### Tutorial authentication

* In this tutorial, the apiKey for our account is `5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg`.

#### curl

* In a curl request, bearer tokens must be passed as a header like so: `-H "Authorization: Bearer {token}"`
* We just have to replace our `{token}` placeholder by our apiKey
* The authorization header will then look like that: `-H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg"`

#### III. Preparing the request data payload

* The API expects to receive a structured request containing the SMS data in a specific format.
* As detailed in the documentation, the data that we have to submit should be a JSON object structured as follows:

![image](../images/8c2ed20-JSON_Object_Properties.png "JSON Object Properties.png")

#### Tutorial request data payload

* The API expects to receive a structured request containing the SMS details and parameters. The format of the request is JSON and it can accept both optional and required parameters.
* For simplicity sake, we are going to use only the most important of the parameters (the others are detailed in the documentation):
  * **Source**:
    * this parameter defines the SMS SenderID, let’s use `"MyBrand"` 😎
  * **Destination**:
    * this is the phone number that we want to reach. As mentioned in the introduction, we want to send a message to 12345678 and it is a phone number registered in Singapore, which uses the international prefix +65.
    * For the destination parameter, we are going to use the value `"+6512345678"`
  * **Text**:
    * This is the content of the message.
    * To invoke a festive season feeling, let’s use the value: `“Bob, a special present for you from Santa.”`
  * **Encoding**:  
  
  * This parameter tells the destination handset which encoding to use to display the SMS. Our text only contains GSM7bit characters which is the most standard encoding but for the sake of safety let’s use `"AUTO"`  
  
  * it means that the API will automatically detect the characters used in the text and select the best encoding.  
  
  * It allows preventing the message from showing up as “ ⃞ ⃞ ⃞ ⃞, ⃞ ⃞ ⃞ ⃞” in the case where we would have used special characters or another alphabet.  
  
  *  
  
  Our final JSON object that we are going to send as the request data payload is then:

```json
{
  "source": "MyBrand",
  "destination": "+6512345678",
  "text": "Bob, a special present for you from Santa",
  "encoding": "AUTO"
}

```

#### curl

* In curl, we will transmit the JSON data inline and indicate that the data payload is in JSON format using the following commands:

```bash
-H "Content-Type: application/json" 
-d $'{ 
  "source": "MyBrand", 
  "destination": "+6512345678", 
  "text": "Bob, a special present for you from Santa", 
  "encoding": "AUTO" 
}'

```

#### IV. Putting it together and posting the curl request

* If we wrap up all the elements prepared in the steps above, we should put together the 3 elements of our request: **URL + Authentication + Data Payload**
* To send the API request to the SMS API endpoint with our message we should use the following command in our command line utility:

```bash
curl -X "POST" https://sms.8x8.com/api/v1/subaccounts/riders_hq/messages \
-H "Authorization: Bearer 5DhZxZRILVPKjXuFWsd7QGZ**********31n19pYmg" \
-H "Content-Type: application/json" \
-d $'{ "source": "MyBrand", "destination": "+6512345678", "text": "Bob, a special present for you from Santa", "encoding": "AUTO" }'

```

* And that’s it! Here is the result:

![437](../images/db2629f-Final_Image.png "Final Image.png")

#### Going further

#### I. API response

* When sending the curl command above from your command line utility, you notice that the API sends back a response that shows up in your terminal, for example in this tutorial:

```json
{
  "umid":"f9eaeb51-24fd-e611-813c-06ed3428fe67",
  "clientMessageId":null,
  "destination":"6512345678",
  "encoding": "GSM7",
  "status":{
  "code":"QUEUED",
  "description":"SMS is accepted and queued for processing"
  }
}

```

* The API response is used to provide feedback about the expected result of the API request (sending an SMS) and various additional information.
* If we take some time to analyze the different elements there, we can identify the following:
  * **umid**: it stands for unique message id, it is the unique id associated with this SMS by the 8x8 CPaaS platform.
  * **clientmessageid**: here, it is null because no value has been specified in the request but you have the possibility to attribute your own custom ids to your messages.
  * **destination**: this is the phone number to which the SMS was sent.
  * **encoding**: this is the encoding used to send the message, it depends on the character set to use for the content. Here GSM7 is the standard when no UNICODE character is required.
  * **status**: this array contains 2 elements: the status of the message and the description of this status
* For more information, check the dedicated section of the [Send SMS](/connect/reference/send-sms), "Response" section in the right panel.

#### II. API errors

* A developer World without error would not be funny!
* If ever you send malformed requests to the API, it will let you know by using some specific error codes in the response.
* You can find the different codes and their meanings in the [SMS Delivery receipts error codes](/connect/reference/delivery-receipts-error-codes) for delivery related errors as well as [API Error codes](/connect/reference/api-error-codes) for error codes that apply to all 8x8 CPaaS APIs.
