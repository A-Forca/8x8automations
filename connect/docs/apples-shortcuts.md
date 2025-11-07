# Apple's Shortcuts

Previously known as Workflow, Apple’s new automation app, [Shortcuts](https://support.apple.com/en-au/HT209055), lets users create powerful workflows and automation with simple building blocks that can be triggered with a tap of a button. One of the best things about Shortcuts is its ability to interact with any web API.

## What you'll need

* 8x8 Connect Account
* 8x8 SMS and Chat Apps Service
* The Shortcuts app [from the App Store](https://apple.co/2DlWWv5)

![248](../images/db8175b-Apple_short_1.jpg "Apple short 1.jpg")

## Send Bulk SMS Using Apple’s Shortcuts

1. Open Shortcuts and tap Create Shortcut, or + from the upper-right corner of the screen.

![248](../images/de9e0e7-Apple_short_2_.jpg "Apple short 2 .jpg")
![248](../images/793adf9-Apple_short_3.jpg "Apple short 3.jpg")

Then, search for URL, and type in your SMS API endpoint, as shown. Your endpoint can be found in your [API Keys](https://connect.8x8.com/messaging/api-keys), and will be in the following format: `https://sms.8x8.com/api/v1/subaccounts/{subAccountId}/messages`

![248](../images/765ae74-Apple_short_4.jpg "Apple short 4.jpg")
![248](../images/1200905-Apple_Short_5.jpg "Apple Short 5.jpg")

2. Add another action by searching for “Get Contents of URL”. Under Advanced, select POST as your Method.

![248](../images/6ce5b30-Apple_Short_6.jpg "Apple Short 6.jpg")
![248](../images/f520c6a-Apple_Short_7.jpg "Apple Short 7.jpg")
![248](../images/a37d4b2-apple_short_8.jpg "apple short 8.jpg")

Add Headers as follows:

```text
Authorization | Bearer {api key}
Content-type | application/JSON

```

![248](../images/ca69630-apple_short_9.jpg "apple short 9.jpg")

3. Add a request body by selecting JSON. Fill out the following fields in your request body:

```text
Destination – The mobile number you are sending the SMS to
Source – Your Sender ID
Text – Your text message content

```

![248](../images/6a96419-Apple_short_10.jpg "Apple short 10.jpg")

4. Now run it by clicking on the play sign on the bottom right. You should receive an SMS (if you use your own mobile phone) and see a JSON response.

![248](../images/4aad756-Apple_short_11.jpg "Apple short 11.jpg")
![248](../images/90d4905-Apple_short_13.jpg "Apple short 13.jpg")

## Sending Bulk SMS Using An Excel File

8x8’s SMS API supports sending SMS for multiple numbers using a .csv or excel file. Using this [API endpoint](/connect/reference/send-many-sms), you will be able to create a Shortcut that will send SMS to multiple numbers. To simplify things for you, we’ve already made the shortcut that you can reuse or modify to your own preference. [Access our shortcut now](https://www.icloud.com/shortcuts/61ac868c82404fcc9f221ac401ebe623).

All you have to do is change the following information on the shortcut we’ve shared.  

For the SMS API endpoint, it should follow the following format: `https://sms.8x8.com/api/v1/subaccounts/{subAccountId}/messages/batch`

Your headers should be as follows:

```text
Authorization | Bearer {api key}
Content-type | application/json

```

To run your shortcut, you need an excel file with the phone numbers stored on your iOS device. Just share the excel file with Shortcuts, we’ll use [this shortcut](https://routinehub.co/shortcut/1192) to parse the excel files before sending the data to the API. Fill in the message body and sender ID that you’d like to send from, and that’s it!
