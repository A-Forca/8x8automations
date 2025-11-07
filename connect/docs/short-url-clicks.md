# Short URL Clicks

8x8 SMS API provides a webhook that notifies you whenever someone clicks a shortened URL in an SMS message sent from your sub-account.

If URL shortening is enabled for your sub-account, any links in your messages are automatically converted to short URLs. When a recipient clicks one of those links, 8x8 sends a `POST` request to your configured webhook endpoint with details about the click.

### Requirements

To use the Short URL Click webhook feature, coordinate with your account manager to activate the following:

- Short URL feature enabled for your sub-account: allows 8x8 to automatically shorten links in your outbound SMS.
- Short URL Click webhook: the callback URL where 8x8 will send click events whenever a recipient clicks a shortened link in your SMS.

> 📘  
> You can configure your callback using [Webhooks Configuration API](/connect/reference/get-webhooks-2)

### Webhook format

#### Request body description

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| namespace | string | A generic namespace for incoming webhook.<br>Equal to `SMS`. |
| eventType | string | Webhook type.<br>Equals to `short_url_clicked`. |
| description | string | Human-readable description of the event. |
| payload | object | Contains the short URL click information. |

#### Payload object description

| Parameter name | Parameter type | Description |
| :------------- | :------------- | :----------- |
| eventId | uuid | Unique identifier for the click event. |
| occurredAt | string | UTC timestamp of when the click occurred (ISO 8601). |
| umid | uuid | Unique ID of the original SMS message. |
| destination | string | Phone number of the recipient (E.164 format). |
| shortUrl | string | The shortened URL that was clicked. |
| targetUrl | string | The final destination URL. |

---

### Sample webhook body

```json
{
  "namespace": "SMS",
  "eventType": "short_url_clicked",
  "description": "Short URL from SMS clicked",
  "payload": {
    "eventId": "0f6a0c0f-8b67-4a3a-a6c3-7b0ecf0d2b1a",
    "occurredAt": "2025-10-03T12:00:00Z",
    "umid": "9e09ac86-bd74-5465-851d-1eb5a5fdbb9a",
    "destination": "+12025550293",
    "shortUrl": "https://2g.to/abc123/abc",
    "targetUrl": "https://example.com/landing?c=fall_campaign"
  }
}
```

### Retry logic

In case of connection error/timeout or HTTP response code 4XX or 5XX, there will be multiple retry attempts with progressive intervals: 1, 10, 30, 90 sec.
