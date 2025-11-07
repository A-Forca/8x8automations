# Key Elements

Before getting started using the Chat Gateway, we recommend familiarizing yourself with the concepts and chat elements that you will be working with and are referenced in the following diagram:

## Channel

The channel is the medium through which the user relays their inquiry within their Contact Center implementation. This can be any of the traditional communication channels such as phone, email, or chat.

## Conversation

A conversation is the information that is exchanged between a Contact Center agent and a user. In order to initiate this exchange of messages, you can use the Chat Gateway API to create a conversation and add the user's messages to it.

A conversation can support three types of assignments: queue, agent, and script. If you choose the queue type assignment when creating a new conversation, the interaction will be placed in the specified queue and can be taken up by any agent assigned to that particular queue. Once an agent accepts the interaction, the assignment details for that conversation will be changed to agent and its specific identifier. The assigned agent will then be able to read the messages and respond accordingly.

For the script assignment type, the purpose when creating a conversation is to initiate the processing of the assigned social script in order to provide quick replies from our own scripting to our web widget. This allows customers to navigate through questions that use the features introduced to the widget via the Chat Gateway. As a result, the web chat script will be forwarded to the social script at any time.

It is common practice to use a conversation for each user case and reuse them if the case is reopened.

## Message

A message is a statement conveyed from one conversation participant to the other.

## Participant

A participant communicates in the conversation or is the one who sends and receives messages. It can be the user, a bot, or an agent

## Routing Option

A routing entity is a resource that defines the rules through which a conversation is routed to an agent. The agent can join the conversation and address the user's inquiry.

## Attachment

This is the ability to send a file (image/video/document) to an agent and to receive one back

## Webhook

A webhook (also called a web callback), is a way for an app to provide another application with real-time information and notification.

For the case of a Chat Gateway integration, 8x8 has to notify your application or bot whenever an agent joins the conversation and adds messages.

Therefore, 8x8 will call the webhook URL whenever a new message is being added by any participant to a conversation or a system event is triggered (interaction queued/transferred, agent joined/left, etc.)
