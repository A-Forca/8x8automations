# Inbound Messaging Apps message

Inbound Messages are messages sent to you by users, on one of the channels you linked with your 8x8 account. Once this happens, 8x8 sends you this message to your webhook.

### Requirements

To use 8x8 inbound Messaging Apps capabilities, you need:

- An account configured to use [Messaging Apps](/connect/reference/list-of-supported-chatapps-channels) product.
- A webhook to indicate to us which URL 8x8 platform should forward the inbound messages addressed to you.

> 📘
>
> You can configure your callback using [Webhook Configuration API](/connect/reference/webhooks-configuration-api)
>
>

### Inbound message flow example

1. A user sends a message to your WhatsApp or Viber number
2. 8x8 Platform receives the message on your behalf
3. 8x8 Platform programmatically transmits the message to the callback URL configured for your webhook including all the information linked to the message.

### Retry logic

In case of connection error/timeout or HTTP response code 4XX or 5XX, there will be multiple retry attempts with progressive intervals: 1, 10, 30, 90 sec.

### Webhook format

Request body description

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| namespace | string | A generic namespace for incoming webhook.<br>Equal to `Messaging Apps` for inbound Messaging Apps message. |
| eventType | string | Webhook type.<br>Equals to `inbound_message_received` for inbound Messaging Apps message. |
| description | string | Human-readable description of the incoming event |
| payload | object | Inbound message information, see below. |

Payload object description

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| umid | uuid | Unique message ID for the inbound message |
| subAccountId | string | Id of the sub-account which owns the virtual number. |
| timestamp | string | UTC date and time when the message was received expressed in ISO 8601 format. |
| user | object | Information about the user the message is associated with. |
| recipient | object | Recipient information, see below |
| type | string | Inbound message type. Possible values:<br>- `none`<br>- `text`<br>- `audio`<br>- `video`<br>- `image`<br>- `location`<br>- `file`<br>- `carousel`<br>- `list`<br>- `buttons`<br>- `template`<br>- `interactive` |
| content | object | Message content |
| replyToUmid | uuid | Optional context data, if this inbound message is referring to a previous inbound message (ex, quoted messages on WhatsApp). |

User information object description

| Parameter name | Parameter type | Description                                                            |
| :------------- | :------------- | :--------------------------------------------------------------------- |
| msisdn         | string         | Phone number expressed in E.164 international format.                  |
| channelUserId  | string         | Id of the user in the channel                                          |
| name           | string         | User's name in the channel. For example, username of the WhatsApp user |

Recipient information object description

| Parameter name | Parameter Type | Description                                                                                                                |
| :------------- | :------------- | :------------------------------------------------------------------------------------------------------------------------- |
| channel        | string         | Channel type, please see [List of supported Messaging Apps channels](/connect/reference/list-of-supported-chatapps-channels) for details. |
| channelId      | string         | Channel user identifier.                                                                                                   |

Content information object description

| Parameter name | Parameter type | Description                                                |
| :------------- | :------------- | :--------------------------------------------------------- |
| text           | string         | Message text (for payload with type = `text`)              |
| url            | string         | The URL of the media attachment (rich content) if any      |
| payload        | string         | Content payload (for interactive messages)                 |
| location       | object         | Location object (for payload with type = `location`)       |
| interactive    | object         | Interactive object (for payload with type = `interactive`) |

Location information object description

| Parameter name | Parameter type | Description |
| :------------- | :------------- | :---------- |
| latitude       | decimal        | Latitude    |
| longitude      | decimal        | Longitude   |

Interactive information object description

| Parameter name | Parameter type | Description |
| --- | --- | --- |
| type | string | Type of the message. Possible values:<br>- `button_reply`<br>- `list_reply` |
| button\_reply | object | Button reply object. Sent when a customer clicks a button. |
| list\_reply | object | List reply object. Sent when a customer selects an item from a list. |

Button reply information object description

| Parameter name | Parameter type | Description            |
| :------------- | :------------- | :--------------------- |
| id             | string         | Unique ID of a button. |
| title          | string         | Title of a button.     |

List reply information object description

| Parameter name | Parameter type | Description                         |
| :------------- | :------------- | :---------------------------------- |
| id             | string         | Unique ID of the selected list item |
| title          | string         | Title of the selected list item.    |
| description    | string         | Description of the selected row.    |

> ❗️
>
> If the request you receive has a different structure from described in this document, please contact our support to activate the latest format for your account.
>

### Sample Messaging Apps inbound message

```json
{
  "namespace": "ChatApps",
  "eventType": "inbound_message_received",
  "description": "ChatApps inbound message",
  "payload": {
    "umid": "9e09ac86-bd74-5465-851d-1eb5a5fdbb9a",
    "subAccountId": "SubAccount-1",
    "timestamp": "2016-01-01T14:34:56.017Z",
    "user": {
      "msisdn": "+12025550023",
      "channelUserId": "12025550023"
    },
    "recipient": {
      "channel": "whatsapp",
      "channelId": "269a57f4-3522-eb11-8278-00155d9f27ac"
    },
    "type": "Text",
    "content": {
      "text": "Test message"
    },
    "replyToUmid": "777a57f4-bd74-eb11-851d-00155d9fer55"
  }
}
```
