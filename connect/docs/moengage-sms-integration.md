# MoEngage - SMS Integration

## Introduction

8x8 CPaaS (Communications Platform as a Service) offers a robust suite of APIs and tools for integrating voice, video, chat, WhatsApp (among other messaging apps channels) and SMS capabilities into your applications.

> 📘 **Prerequisites**
>
> Ensure that you have your 8x8 account, subaccount and an API key. If there are any issues with your 8x8 credentials reach out to [cpaas-support@8x8.com](mailto:cpaas-support@8x8.com)
>
>

## Video Demo

This is an accompanying video guide. It shows how the integration is setup and used in action.

<iframe
  src="https://www.youtube.com/embed/QhzQopj4NOk?si=ZyzU4FhwrOiO4YNt"
  height="500px"
  width="100%"
  allow="picture-in-picture; web-share"
  allowFullScreen>
</iframe>

## Configure 8x8 as a Custom SMS Connector (Service Provider)

This article helps you configure 8x8 as a Custom SMS Connector (Service Provider) on the MoEngage platform for businesses that use MoEngage for their communication campaign scheduling.

### Requirements

Before proceeding, ensure that you have the following parameters to make calls to the 8x8 SMS API. Both parameters below can be found in your 8x8 Connect Portal in the [API Keys section](https://connect.8x8.com/messaging/api-keys).

| Parameter      | Description                                                                                                                                                                                                |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **API Key**    | Used to authenticate with 8x8's APIs. Please see [this](/connect/docs/authentication) page for details.                                                                           |
| **Subaccount** | Your 8x8 subaccount. Your 8x8 account should have a subaccount created for it by default. You can request a new subaccount from our support team at [cpaas-support@8x8.com](mailto:cpaas-support@8x8.com). |

## Configure in Revamped UI

Log in to the MoEngage Dashboard and follow these steps:

1. Navigate to **Settings -> Channel -> SMS**.
2. On the **Sender Configuration** tab, click **+ Add sender.** The Add sender page is displayed.
3. In step 1 "Service Provider", click **+ Add custom service provider**. The Add Custom Connector sender page is displayed.
4. Add the following details in step 2 "Sender Details".

| Field | Description |
| --- | --- |
| **Mark as Default** | Turn this toggle on to mark the sender as the default sender for the service provider being configured. If marked as default, this sender will be used for sending all SMS campaigns from MoEngage unless you select a different sender while creating the campaign. |
| **Service Provider Name** | This field identifies the service provider you are configuring on the MoEngage Dashboard and has to be unique. Enter **"8x8 SMS”.** |
| **Sender Name** | This field identifies the sender. Enter **"8x8 SMS".** |
| **Sender Type** | Select the sender type. Available options are:<br>Transactional: Select this option to use the sender for sending alerts about transactions, OTPs, security information, or any information that can be classified as transactional in nature.<br>Promotional: Select this option to use the sender for sending information about your brand, promoting deals, or engaging with users. |

5. Configure the Webhook by adding the following details:

| Field | Description |
| --- | --- |
| **API URL** | This field contains information about the URL that should be used to send an API request to the sender. You can get this information from the API documentation of the sender. Enter the API Endpoint of the sender here. The API URL for 8x8 is: [https://sms.8x8.com/api/v1/subaccounts/{Subaccount}/messages](https://sms.8x8.com/api/v1/subaccounts/%7Bsubaccount%7D/messages)**{subaccount}** in the URL should be replaced by your 8x8 subaccount. This can be found from the 8x8 Connect Dashboard in the [API Keys section](https://connect.8x8.com/messaging/api-keys). |
| **Method** | Select **POST** as the HTTP method. |
| **URL parameters** | Add the URL Parameters to be passed to the API as Key-Value pairs using this option. You can get this information from the API documentation of the sender. For example, if the API URL call uses the GET method, all the parameters such as API Key, Authorization, and so on, are passed as URL Parameters. |
| **Headers** | Add the Request Headers to be passed to the API as Key-Value pairs using this option.**Content-Type:** application/json**Authorization:** Bearer {Api Key}<br>You can find your API key in the 8x8 Connect Dashboard's [API Key section](https://connect.8x8.com/messaging/api-keys). |
| **Body type** | Configure the body for your requests. Select JSON and add the<br>following details:<br>In the **message** field, add Moesms_message to pass the MoEngage message into the request.<br>In the **sender** field, add the Sender ID in your 8x8 account.<br>In the **recipient** field, add Moesms_destination to add the recipient to the message. |

6. Click **Send Test SMS** to verify your configuration.
7. Click **Save** to save the sender configuration.
8. You can configure delivery tracking after creating the sender in the MoEngage Dashboard.
9. You can map the attributes of the delivery tracking response manually or automatically.
