# Inbound SMS

8x8 SMS API exposes a webhook mechanism to let you receive Inbound SMS (SMS sent to your virtual numbers) on a callback URL of your choice.  
Whenever you receive inbound SMS, the 8x8 SMS platform sends a `POST` request to the endpoint of your choice with a `JSON` body containing the inbound SMS and the associated data.

### Requirements

To use inbound SMS capabilities, liaise with your account manager to activate the following:

- A **virtual mobile number** where your user will send their SMS
- An **inbound SMS callback URL**: set the URL, where 8x8 platform should forward the inbound messages addressed to your virtual number

> 📘
>
> You can configure your callback using [Webhooks Configuration API](/connect/reference/get-webhooks-2)
>
>

### Inbound SMS flow

1. A user sends an SMS to one of your virtual numbers
2. 8x8 receives the SMS on your behalf
3. 8x8 programmatically sends the SMS to the callback URL configured for your virtual number using  `POST` request.
4. The `POST` request body, in the `JSON` format contains the SMS body and all associated data (`UMID`, source, destination, encoding, timestamp)

### Retry logic

In case of connection error/timeout or HTTP response code 4XX or 5XX, there will be multiple retry attempts with progressive intervals: 1, 10, 30, 90 sec.

### Webhook format

Request body description

| Parameter name | Parameter type | Description                                                                  |
| --- | --- |------------------------------------------------------------------------------|
| namespace | string | A generic namespace for incoming webhook.<br>Equal to `SMS` for inbound SMS. |
| eventType | string | Webhook type. <br>Equals to `inbound_message_received` for inbound SMS.          |
| description | string | Human-readable description of the incoming event                             |
| payload | object | Inbound message information, see below.                                      |

Payload object description

| Parameter name | Parameter type | Description                                                                                                   |
| :------------- | :------------- | :------------------------------------------------------------------------------------------------------------ |
| umid           | uuid           | Unique message ID for the inbound message                                                                     |
| subAccountId   | string         | Id of the sub-account which owns the virtual number.                                                          |
| timestamp      | string         | UTC date and time when the message was received expressed in ISO 8601 format.                                 |
| source         | string         | Originating address of the SMS (sender number)                                                                |
| destination    | string         | The destination address of the SMS (virtual number)                                                           |
| body           | string         | Content of the SMS                                                                                            |
| encoding       | string         | The encoding used in the SMS body (GSM7 / UCS2)                                                               |
| smsCount       | integer        | Number of SMS segment in the message                                                                          |
| price          | object         | Price information of the message, please see [Price object reference](/connect/reference/price-object-reference) for details |

> ❗️
>
> If the request you receive has a different structure from described in this document, please contact our support to activate the latest format for your account.

### Sample inbound SMS callback body

```json Inbound SMS webhook body
{
  "namespace": "SMS",
  "eventType": "inbound_message_received",
  "description": "SMS inbound message",
  "payload": {
    "umid": "9e09ac86-bd74-5465-851d-1eb5a5fdbb9a",
    "subAccountId": "SubAccount-1",
    "timestamp": "2016-01-01T14:34:56.017Z",
    "source": "+6581968289",
    "destination": "+4534735477",
    "body": "Test MO message",
    "encoding": "GSM7",
    "smsCount": 2,
    "price": {
      "total": 0.0446592,
      "perSms": 0.0446592,
      "currency": "EUR"
    }
  }
}
```
