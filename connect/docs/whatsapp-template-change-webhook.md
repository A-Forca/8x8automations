# WhatsApp Template Change Webhook

**WhatsApp Template Change Webhook** are notifications sent to you to inform about any updates or modifications to your WhatsApp template.

> 📘
>
> In case you're looking for delivery notifications for Chat Apps message, please refer to [Delivery receipts for outbound Chat Apps](/connect/docs/delivery-receipts-for-outbound-chatapps)
>

### Requirements

To receive WhatsApp template change webhook, you need:

- An account configured to use Chat Apps product.
- A webhook to indicate to us which URL 8x8 platform should send Chat Apps Business Management Updates to.

> 📘
>
> You can configure your callback using [Webhooks Configuration API](/connect/reference/add-webhooks-1)

### Retry logic

In case of connection error/timeout or HTTP response code 4XX or 5XX, there will be multiple retry attempts with progressive intervals: 1, 10, 30, 90 sec.

### Webhook format

Request body description

| Parameter name | Parameter type | Description                                                                                                           |
| --- | --- |-----------------------------------------------------------------------------------------------------------------------|
| eventId | string | Unique event identifier.                                                                                              |
| timestamp | string | Timestamp of event in ISO 8601 format.                                                                                |
| provider | string | Provider of this event. Equal to `WhatsApp`.                                                                          |
| businessAccountId | string | Business account identifier associated with provider.                                                                 |
| accountId | string | AccountId which the event is associated with.                                                                         |
| eventType | string | Webhook type.<br>Possible values are `template_category_update`, `template_status_update`, `template_quality_update`. |
| eventDetails | object | Event related information, see below.                                                                                 |

`eventDetails` object description

| Parameter name   | Parameter type | Description                                           |
| :--------------- | :------------- | :---------------------------------------------------- |
| templateId       | long           | WhatsApp Template ID.                                 |
| templateName     | string         | WhatsApp Template Name.                               |
| templateLanguage | string         | WhatsApp Template Language.                           |
| meta             | object         | Specific information related to the event, see below. |

`meta` object description

| Parameter name       | Parameter type | Description                                                                                                                                                                                                                                                                                                  | Applicable for eventType   |
|----------------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| previousCategory     | string         | Previous category for template.                                                                                                                                                                                                                                                                              | `template_category_update` |
| newCategory          | string         | New category for template.                                                                                                                                                                                                                                                                                   | `template_category_update` |
| previousQualityScore | string         | Previous quality score for template.<br>Possible values: `GREEN`, `YELLOW`, `RED`, `UNKNOWN`.                                                                                                                                                                                                                | `template_quality_update`  |
| newQualityScore      | string         | New quality score for template.                                                                                                                                                                                                                                                                              | `template_quality_update`  |
| status               | string         | New template status.<br>Possible values: `APPROVED`, `REJECTED`, `FLAGGED`, `PAUSED`, `PENDING_DELETION`.                                                                                                                                                                                                    | `template_status_update`   |
| reason               | string         | Template rejection reason.<br>Possible values: `ABUSIVE_CONTENT`, `INCORRECT_CATEGORY`, `INVALID_FORMAT`, `SCAM`, `NONE`.`NONE` is also the default, set when template is approved.                                                                                                                          | `template_status_update`   |
| disableInfo          | object         | Provided when template is scheduled to be disabled. Contains `disableDate`.                                                                                                                                                                                                                                  | `template_status_update`   |
| otherInfo            | object         | Provided for pause or unpause event. Contains two properties `title` and `description`.  <br/>  <br/>- `title` to indicate the event. Possible values: `FIRST_PAUSE`, `SECOND_PAUSE`, `RATE_LIMITING_PAUSE`, `UNPAUSE`, `DISABLED`.<br/>- `description` to describe why the template was paused or unpaused. | `template_status_update`   |

### Sample template update webhook

```coffeescript Category Update
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_category_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
          "previousCategory": "UTILITY",
          "newCategory": "MARKETING"
      }
    }
}
```

```coffeescript Quality Update
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_quality_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
        "previousQualityScore": "UNKNOWN",
        "newQualityScore": "GREEN"
      }
    }
}
```

```coffeescript Status Update - Approved
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_status_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
        "status" : "APPROVED",
        "reason": "NONE"
      }
    }
}
```

```coffeescript Status Update - Rejected
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_status_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
        "status" : "REJECTED",
        "reason": "INCORRECT_CATEGORY"
      }
    }
}
```

```coffeescript Status Update - Scheduled to Disable
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_status_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
        "status" : "FLAGGED",
        "disableInfo": {
          "disableDate": "DATE"
        }
      }
    }
}
```

```coffeescript Status Update - Paused
{
    "eventId": "0f88f5c4-fae7-4dcf-8ff2-b2990133edea",
    "timestamp": "2025-01-01T00:00:00.00Z",
    "provider": "WhatsApp",
    "businessAccountId": <BusinessAccountId>,
    "accountId": <AccountId>,
    "eventType": "template_status_update",
    "eventDetails":
    {
      "templateId" : <TEMPLATE_ID>,
      "templateName" : <TEMPLATE_NAME>,
      "templateLanguage" : <TEMPLATE_LANGUAGE>,
      "meta":
      {
        "status" : "PAUSED",
        "reason" : "NONE",
        "otherInfo": {
          "title": "FIRST_PAUSE",
          "description": "Pause description"
        }
      }
    }
}
```
