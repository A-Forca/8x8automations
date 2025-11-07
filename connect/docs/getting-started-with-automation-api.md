# Getting started with Automation API

> 🚧 **[BETA]**
>
> This product is currently in early access. Please reach out to your account manager to get more information.
>
>

## Overview

The Automation API allows you to create and manage complex business workflows. A workflow is a sequence of triggers, conditions and actions which we will be running for you, it can be seen as a business logic.

We will be using the following terms in this document:

- **Workflow definition**, the blueprint of a business flow.
- **Workflow instance**, the runtime object that executes the business logic defined in the corresponding workflow definition.
- **Trigger**, an external event that starts a workflow without manual intervention.
- **Step**, a basic building block of a workflow definition which represents an action to be taken.
- **Branch**, a step that allows you to define alternate paths for the workflow based on conditions.
- **Workflow context**, data captured in a workflow instance which persists between steps.

## Use Cases

The Automation API allows you to tackle many business processes, here are some examples of the most common use cases:

- **Auto Reply**: for each incoming message (SMS or ChatApps) I want to send an automatic reply to the user. It can be to acknowledge reception or to share a link for support enquiries.

- **Out of Office**: outside of business hours, I want to send an automatic reply to the users, to let them know when I will get back to them.

- **Fallback**: for each undelivered outbound message, I want to call another API to make sure my message got delivered through another channel.

- **Split messages**: for all messages coming from a +1 (US) number, I want to send them to a CRM using a custom API call. For all other messages, I want to send them to a different CRM.

- **Custom integration**: I want some of the incoming messages to be pushed to my ordering system, for this I will use the Automation service to make a custom API call to my system.

- **Content based rule**: I'm running a campaign where users need to send a specific message to my number. I can filter only the message with this content, to confirm customers they are enrolled and push the registered user numbers to my system, using an API call.

- **Mix and match**: mix any of the examples above. For example, for messages outside of business hours coming from a +44 (UK) number, I want to send an auto reply. For all messages coming from +65 (Singapore) number, I want to do a custom API call and for all the other messages do nothing.

These are just some example, as you can design the workflow definitions, you can create many more flows to support other use cases. Feel free to contact us for support.

## Authentication

Automation API uses Bearer authentication scheme. All requests to automation server must contain the *HTTP authorization* header with the value *Bearer {apiKey}*  where *{apiKey}* for the account can be obtained from 8x8 Connect [https://connect.8x8.com/](https://connect.8x8.com/). The account must be registered in the automation service before it can be used (please reach out to your account manager for more information).

## How to use the API

Here is how you would likely interact with the Automation API:

**WORKFLOW CREATION**

1) Create a new workflow definition, you are submitting your blueprint
   -> [/connect/reference/create-definition](/connect/reference/create-definition)

**WORKFLOW DEFINITION MANAGEMENT**

2) Get your workflow definitions, to make sure your definition is there
   -> [/connect/reference/get-all-definitions](/connect/reference/get-all-definitions)

3) Retrieve your workflow, based on the workflowId, to verify it
   ->  [/connect/reference/get-specific-definition](/connect/reference/get-specific-definition)

4) If you want to modify your definition, you can use this
   -> [/connect/reference/update-existing-definition](/connect/reference/update-existing-definition)

5) If you want to delete your definition, you can use this
   -> [/connect/reference/delete-definitions](/connect/reference/delete-definitions)

**WORKFLOW INSTANCE  MANAGEMENT**
6) To test your workflow, you can trigger it manually
   -> [/connect/reference/start-workflow-instance](/connect/reference/start-workflow-instance)

7) To retrieve the workflow instance of a specific workflow definition
   -> [/connect/reference/get-workflow-instances](/connect/reference/get-workflow-instances)

8) To suspend, resume or terminate a workflow instance
   -> [/connect/reference/patch-workflow-instance](/connect/reference/patch-workflow-instance)

9) To get errors of a workflow instance
   -> [/connect/reference/get-instance-errors](/connect/reference/get-instance-errors)

As you can see, only the step #1 is mandatory.
If you know that your workflow is valid, and that you can test it without the API (by actually sending an incoming message for example), you only need to perform the first step (create a workflow definition).

The other items are here to help you manage your workflow definition, test them manually and debug them.

## Workflow definition example

Here is a simple example of a workflow definition.

This definition contains the following attributes:

- the trigger is any Inbound Chat Apps message on the subaccount Test_12345_ChatApps
- there are no conditions, all instances will result in sending a Chat Apps message
- the instance will send an auto reply message to any incoming Chat Apps message

```json
{
        "subAccountId": "Test_12345_ChatApps",
        "trigger": "inbound_chat_apps",
        "status": "enabled",
        "definition": {
            "name": "Auto Reply ChatApps",
            "steps": [
                {
                    "id": "send_CA",
                    "stepType": "ChatAppsMessage",
                    "inputs": {
                        "subAccountId": "Test_12345_ChatApps",
                        "user": {
                            "msisdn": "{{data.payload.user.msisdn}}"
                        },
                        "type": "text",
                        "content": {
                            "text": "Hello, thank you for your message, we will get back to you as soon as possible."
                        }
                    }
                }
            ]
        }
    }

```
