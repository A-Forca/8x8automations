# Webhook Setup Guide for IVR

First you should have an URL endpoint configured in order to receive webhooks. Your endpoint will need to response to the webhooks in order to trigger following actions in an IVR

Then we will need to setup two webhooks, **a VCA (Voice Call Action) Webhook** and a **VSS (Voice Session Summary) Webhook.**

**[VCA Webhook](/connect/docs/voice-call-action-webhook)** - Fired during a call after a single action is completed. By responding to the webhook, this gives you the ability to define what action to take next during the call by returning a callflow JSON object as the response to the webhook.

**[VSS Webhook](/connect/reference/session-status)** - Fired after a call is completed. This summarises the call and how a call ended in order to follow up further. For example if a call successfully ended, you can use the status to log in your system that a call was completed. If a call ended due to an error, you may want to log that in your system to retry the call.

## Video Guide

This video guide corresponds to the information on this page but in video form. It should help to clarify how we expect the webhooks to be setup and also how the webhooks are expected to be used.

<iframe
  src="https://www.youtube.com/embed/aYERSDzKpCs?si=sIoBSy3BR2tqN1_l"
  height="500px"
  width="100%"
  allow="picture-in-picture; web-share"
  allowFullScreen>
</iframe>

## VCA Webhook Setup

This is the URL to send a POST request to in order to create a new VCA webhook.

`POST https://voice.8x8.com/api/v1/subaccounts/{{subaccount_id}}/webhooks`

Below is the request body to send to this URL to create the VCA Webhook.

```json
{
    "active": true,
    "type": "VCA",
    "url": "https://{{Your URL Endpoint}}"
}

```

Please ensure to substitute the following variables above in the URL and the request body :

**Subaccount\_id** - This should refer to your 8x8 subaccount

**Your URL Endpoint** - This should refer to your server's endpoint where 8x8 should send a request.

## VSS Webhook Setup

This is the URL to send a POST request to in order to create a new VCA webhook.

`POST https://voice.8x8.com/api/v1/subaccounts/{{subaccount_id}}/webhooks`

Below is the request body to send to this URL to create the VCA Webhook.

```json
{
    "active": true,
    "type": "VSS",
    "url": "https://{{Your URL Endpoint}}"
}

```

Please ensure to substitute the following variables above in the URL and the request body :

**Subaccount\_id** - This should refer to your 8x8 subaccount

**Your URL Endpoint** - This should refer to your server's endpoint where 8x8 should send a request.

## Check Webhook Configuration

In order to ensure your webhooks are setup properly, you can use the API endpoint below to get a list of your currently active webhooks.

`GET https://voice.8x8.com/api/v1/subaccounts/{{subaccount_id}}/webhooks`

There is no request body required, the response should be similar to the text below.

```json
{
    "subAccountId": "InternalDemoCPaaS_8dD15_voice",
    "count": 2,
    "webhooks": [
        {
            "type": "VSS",
            "url": "{{Your URL Endpoint}}",
            "enabled": true,
            "httpAuthHeaderAvailable": false
        },
        {
            "type": "VCA",
            "url": "{{Your URL Endpoint}",
            "enabled": true,
            "httpAuthHeaderAvailable": false
        }
    ],
    "statusCode": 0,
    "statusMessage": "ok"
}

```

You should see two different webhooks configured, one of type VSS and one of type VCA. Note that you can configure the VSS and VCA URLs to be different if needed.

## Delete Webhook

In order to delete a VCA webhook, you can send a DELETE request to the following URL.

`DELETE https://voice.8x8.com/api/v1/subaccounts/{{subaccount_id}}/webhooks/VCA`

Similarly, in order to delete a VSS webhook, you can send a DELETE request to the following URL.

`DELETE https://voice.8x8.com/api/v1/subaccounts/{{subaccount_id}}/webhooks/VSS`
