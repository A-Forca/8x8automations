# WhatsApp Phone Number Quality Change Webhook

**WhatsApp Phone Number Change Webhook** are notifications sent to you to inform about changes to your business phone number's [messaging limit](https://developers.facebook.com/docs/whatsapp/messaging-limits) and [throughput level](https://developers.facebook.com/docs/whatsapp/cloud-api/overview#throughput).

### Requirements

To receive WhatsApp phone number quality change webhook, you need:

- An account configured to use Chat Apps product.
- A webhook to indicate to us which URL 8x8 platform should send Chat Apps Business Management Updates to.

> 📘
>
> You can configure your callback using [Webhooks Configuration API](/connect/reference/add-webhooks-1)
>

### Retry logic

In case of connection error/timeout or HTTP response code 4XX or 5XX, there will be multiple retry attempts with progressive intervals: 1, 10, 30, 90 sec.

### Webhook format

Request body description

| Parameter name    | Parameter type | Description                                                                                                              |
| :---------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------- |
| eventId           | string         | Unique event identifier.                                                                                                 |
| timestamp         | string         | Timestamp of event in ISO 8601 format.                                                                                   |
| provider          | string         | Provider of this event. Equal to `WhatsApp`.                                                                             |
| businessAccountId | string         | Business account identifier associated with provider. This value will represent the WhatsApp Business Account (WABA) Id. |
| accountId         | string         | AccountId which the event is associated with.                                                                            |
| eventType         | string         | Type of event. Equal to `phone_number_quality_update`.                                                                   |
| eventDetails      | object         | Event related information, see below.                                                                                    |

`eventDetails` object description

| Parameter name     | Parameter type | Description                                           |
| :----------------- | :------------- | :---------------------------------------------------- |
| displayPhoneNumber | string         | Business display phone number                         |
| meta               | object         | Specific information related to the event, see below. |

`meta` object description

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| event | string | Messaging limit change or throughput change event.<br>Possible values are`DOWNGRADE`— Messaging limit has decreased.`FLAGGED` — Messaging quality will be decreased if the number continues to receive negative feedback.`ONBOARDING` — Phone number is still being registered.`THROUGHPUT_UPGRADE` — Throughput level has increased.`UNFLAGGED` — Business phone number is eligible to receive a messaging limit increase if it continues to receive positive feedback.`UPGRADE` — Messaging limit has increased. |
| currentLimit | string | Indicates current messaging limit or throughput level.<br>Possible values are`TIER_50` — Indicates a messaging limit of 50.`TIER_250` — Indicates a messaging limit of 250.`TIER_1K` — Indicates a messaging limit of 1,000.`TIER_10K` — Indicates a messaging limit of 10,000.`TIER_100K` — Indicates a messaging limit of 100,000.`TIER_NOT_SET` — Indicates the business phone number has not been used to send a message yet.`TIER_UNLIMITED` — Indicates the business phone number has higher throughput. |
| oldLimit | string | Old limit and only included for messaging limit changes. |

### Sample webhook

```coffeescript Messaging Limit Upgrade
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "phone_number_quality_update",
    "eventDetails": {
        "displayPhoneNumber": "15550783881",
        "meta": {
            "event": "UPGRADE",
            "currentLimit": "TIER_10K",
            "oldLimit": "TIER_1K"
        }
    }
}
```

```coffeescript Throughput Upgrade
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "phone_number_quality_update",
    "eventDetails": {
        "displayPhoneNumber": "15550783881",
        "meta": {
            "event": "THROUGHPUT_UPGRADE",
            "currentLimit": "TIER_UNLIMITED"
        }
    }
}
```
