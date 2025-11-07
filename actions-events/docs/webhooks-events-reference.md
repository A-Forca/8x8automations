# Webhooks Events Reference

Webhook events are how 8x8 notifies bots or integrations when an event occurs such as when an agent sends a message.

Events are sent as **`POST`** calls to your webhook.

## List of webhook events

The following table lists events that can be sent to your webhook:

| Webhook Event | Description |
| --- | --- |
| **`CONVERSATION_UPDATE`** | *See [**`CONVERSATION_UPDATE`**](/actions-events/docs/webhooks-events-reference#conversation_update)* |
| **`QUEUED`**  | *See [**`QUEUED`**](/actions-events/docs/webhooks-events-reference#queued)* |
| **`MEMBERS_CHANGED`**  | *See [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed)*  |
| **`TRANSFER`** | See [**`TRANSFER`**](/actions-events/docs/webhooks-events-reference#transfer) |
| **`MESSAGE`**  | See [**`MESSAGE`**](/actions-events/docs/webhooks-events-reference#message)  |
| **`ACTIVITY`**  | See [**`ACTIVITY`**](/actions-events/docs/webhooks-events-reference#activity)  |
| **`WEB_HOOK_VERIFY`** | See [**`WEB_HOOK_VERIFY`**](/actions-events/docs/webhooks-events-reference#web_hook_verify) |

## Event format

All 8x8 events have the common property **`eventType`** that provides the information for processing and handling the event. Each event contains a set of specific detailed properties.

Based on the **`eventType`** and the webhook version, you can determine the other properties expected in the event envelope.

```json
{
  "eventType": "CONVERSATION_UPDATE",
  ...
}

```

### CONVERSATION_UPDATE

The **`CONVERSATION_UPDATE`**  event is sent whenever the conversation changes.

The **`queueId`**  and **`queueName`**  attributes provide information about the queue in which your conversation is waiting. You can use the queue ID to fetch additional information (e.g., statistical data) about the queue like the **average waiting time in queue** or **queue size**.

```json
{
  "eventType": "CONVERSATION_UPDATE",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "state": "active",
    "assignment": {
      "type": "agent",
      "id": "agb7CaTIXvQPWmPKmTu1rJjw",
      "resourceId": "string"
    },
    "user": {
      "name": "string",
      "userId": "string",
      "email": "user@example.com",
      "phone": "string",
      "company": "string",
      "caseId": "string",
      "language": "en",
      "additionalProperties": 
        [
          {
            "key": "string", 
            "value": "string"
          }
        ]
    }
  }
}

```

### QUEUED

The **`QUEUED`**  event is sent whenever the interaction is being queued for processing.

The **`queueId`**  and **`queueName`**  attributes provide information about the queue in which your conversation is waiting. You can use the queue ID to fetch additional information (e.g., statistical data) about the queue like the **average waiting time in queue** or **queue size**.

```json
{
  "eventType": "QUEUED",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "queueId": "string",
    "queueName": "string"
  }
}

```

### MEMBERS_CHANGED

The **`MEMBERS_CHANGED`** event is sent whenever members other than the bot joined or left the conversation

Agent joined event notification indicates that the agent has seen the messages that were added to the conversation, prior to the integration, and has observed any follow-up messages.

The **`id`** attribute provides information about the agent handling the interaction or the user.

```json
{
  "eventType": "MEMBERS_CHANGED",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "memberType": "user", // [user, agent]
    "change": "joined",   // [joined, left]
    "id": "string"
  }
}

```

### TRANSFER

A **`TRANSFER`** event is sent whenever the handling agent transferred the conversation to another queue. This indicates that the [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed)  event for a memberType **"agent"** with a change of type **"left"** does not mark the end of the conversation and that another [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed)  event follows, with a change of type **"joined"** for a memberType **"agent"**.

```json
{
  "eventType": "TRANSFER",
  "conversationId": "ID-0",
  "timestamp": 0
}

```

### MESSAGE

A **`MESSAGE`** event is sent whenever one of the participants adds a new message to the conversation. The **`TEXT`** event contains attribute information and is conveyed by the agent in string format.

```json
{
  "eventType": "MESSAGE",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "isEcho": true,
    "sender": {
      "id": "string",
      "type": ""
    },
    "text": "string",
    "attachments": [
      {
        "id": "string"
      }
    ],
    "cards": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {}
      }
    ]
  }
}

```

### ACTIVITY

A **`ACTIVITY`** event is sent whenever a non-message action was taken by the user and it would benefit the bot to know the result of that action in order to serve it with the next message. As [Adaptive Cards V1.3](https://adaptivecards.io/) are supported, the *Action.Submit* data will be passed back to bot so he can evaluate the response

```json
{
  "eventType": "ACTIVITY",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "name": "adaptiveCard/action",
    "value": {
      "type": "Action.Submit",
      "data": {...}
    }
  }
}

```

Users typing events will be caught as an activity. Users actively timing will be present in the users' list, and if you receive an activity event of type typing with an empty list, it means they stopped.

```json
{
  "eventType": "ACTIVITY",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "name": "typing",
    "value": {
      "users": [
        {
          "type": "agent",
          "id": "string"
        }
      ]
    }
  }
}

```

When the user responds to a quick reply widget, an activity is sent with the value selected (title) and the identification (payload).

```json
{
  "eventType": "ACTIVITY",
  "conversationId": "ID-0",
  "timestamp": 0,
  "data": {
    "name": "quickReply/action",
    "value": {
      "type": "postback",
      "data": {
        "title": "123",
        "payload": "1"
      }
    }
  }
}

```

### WEB_HOOK_VERIFY

When you add a webhook you receive a **`WEB_HOOK_VERIFY`** verification event to confirm that a server is listening behind the server address. This functionality prevents typos, invalid URLs, and other issues that may require further troubleshooting. The server that receives this verification event must respond with a 2XX status code.

```json
{
  "notificationVersion": "Chat Gateway v1.0",
  "eventType": "WEB_HOOK_VERIFY"
}

```
