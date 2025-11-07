# Conversation

After you have created:

* [**Webhooks**](/actions-events/docs/webhooks-2)
* A [**Chat queue**](https://docs.8x8.com/8x8WebHelp/VCC/configuration-manager-unified-login/content/queuespageoverview.htm) with assigned agents
* A [**Channel**](/actions-events/docs/channel#create-a-channel-using-api) with associated webhook and chat queue

you can begin testing the Chat Gateway flow through the creation of a conversation.

## Create a conversation

Complete the following steps to create a conversation:

1. Obtain your [**API key**](/actions-events/docs/api-key)
2. Call [**create a new conversation**](/actions-events/reference/createcctransaction-1) using the channel you created.
3. Obtain the **`conversationId`** value from the generated response

The created conversation triggers a new interaction linked to the conversation. The interaction is enqueued to the specified chat queue.

An available agent is offered the interaction. Once an agent has accepted the interaction, it joins the conversation thread and the agent sees all the messages added to the conversation.

8x8 sends an [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed)  event on the webhook associated with the channel.

Any message added in the conversation triggers a new [**`MESSAGE`**](/actions-events/docs/webhooks-events-reference#message) notification.

If any of the members other than the bot, joined or left the conversation, a [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed) event notification will be received.

A [**`TRANSFER`**](/actions-events/docs/webhooks-events-reference#transfer) event is sent whenever the handling agent transferred the conversation to another queue. This indicates that the [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed) event for a memberType "agent" with a change of type "left" does not mark the end of the conversation and that another [**`MEMBERS_CHANGED`**](/actions-events/docs/webhooks-events-reference#members_changed) event follows, with a change of type "joined" for a memberType "agent".

An [**`ACTIVITY`**](/actions-events/docs/webhooks-events-reference#activity) event is sent whenever a non-message action was taken by the user and it would benefit the bot to know the result of that action in order to serve it with the next message. As Adaptive Cards V1.3 are supported, the Action.Submit data will be passed back to bot so he can evaluate the response

Using the [**Conversations APIs**](/actions-events/reference/getccinteractions) you can see the conversation information and the created messages as well as information about how an agent handled a conversation and the specific interactions.
