# Triggers & Steps

> 🚧 **[BETA]**
>
> This product is currently in early access. Please reach out to your account manager to get more information.
>
>

## Triggers

Here are the different triggers we support, at the moment:

**inbound_sms** : meaning when you receive a new incoming SMS on the specified subaccount.

**inbound_chat_apps** : meaning when you receive a new incoming ChatApps message on the specified subaccount.

**http_request** : generic trigger that can start a workflow via HTTP events like webhooks with any kind of payload (application/json). This is great if you want to trigger workflows from external systems. Example HTTP request to start your workflow:

```bash
curl --location -X POST 'https://automation.8x8.com/api/v1/accounts/:your_account_id/triggers/http_request?subAccountId=:your_subaccount_id' \' \
--header 'Content-Type: application/json' \
--data-raw '{
  "f1": "value1",
  "f2": 123456,
  "f3": false,
  "o1": {
    "nf1": "value1",
    "nf2": "value2"
  } 
}'
```

One workflow definition can only have one trigger, defining a trigger is mandatory.
You can create similar workflows with different triggers, if needed.

## Steps

Workflow definitions are collections of workflow steps. Every step must have an id and a step type. The id of the step must be unique within the workflow definition. Steps may have properties that can be set when you are creating a workflow definition (e.g. set a HTTP header for a HTTP request) or at runtime by the workflow using outputs (e.g. HTTP response code of a HTTP request).
<br />

**Here are the different Steps we support:**

* **SMS**
* **ChatAppsMessage**
* **HttpRequest**
* **Wait**
* **If**
* **WaitForReply**
* **VoiceMessage**
* **WaitForDTMF**

More details on each step:

**Send an SMS** :

*SMS* step allows you to send a message to a recipient as a SMS.

```json
{
    "id": "step1",
    "stepType": "SMS",
    "inputs": {
        "subAccountId": "Test_12345_Sms",
        "destination": "+6512345678",
        "text": "Hello, world!"
    },
    "outputs": {
        "smsRequestId": "{{step.requestId}}",
        "smsUmid": "{{step.umid}}",
        "smsStatus": "{{step.status}}",
        "smsDescription": "{{step.description}}"
    },
    "nextStepId": "step2"
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Type   |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | string |
| inputs     | Input parameters for SMS request: <br /> - **subAccountId**: Sub account id to send the message from.  <br /> - **source**: Source number (senderId). <br /> - **destination**: MSISDN to send message to. <br /> - **text**: Message body. <br /> For information on all supported input options, refer to SMS documentation.                                                                                                                                        | object |
| outputs    | Properties of the step to save to workflow execution context to use in other steps (Optional). Supported properties are: <br /> - **requestId**: Unique identifier of the HTTP request. <br /> - **umid**: Unique identifier of the message. <br /> - **status**: Status of the message request. <br /> - **description**: Descriptive message on the status of the message. <br /> For information on all supported statuses please refer to our SMS documentation.  | object |
| nextStepId | Step id of the next step to execute (Optional). If a next step id is not specified, workflow will terminate after this step.                                                                                                                                                                                                                                                                                                                                          | string |

**Send a Chat Apps message** :

*ChatAppsMessage* step allows you to send a message using 8x8 Chat Apps messaging API.

```json
{
    "id": "step1",
    "stepType": "ChatAppsMessage",
    "inputs": {
        "subAccountId": "Test_12345_ChatApps",
        "user": {
            "msisdn": "+6512345678"
        },
        "type": "text",
        "content": {
            "text": "Hello, World!",
            "sms": {
                "encoding": "AUTO",
                "source": "SENDERID"
            }
        }
    },
    "outputs": {
        "requestId": "{{step.requestId}}",
        "requestUmid": "{{step.umid}}",
        "requestStatus": "{{step.status}}",
        "requestDescription": "{{step.description}}"
    },
    "nextStepId": "step2"
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Type   |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                          | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | string |
| inputs     | Chat Apps message request parameters: <br /> - **subAccountId**: Sub account id to send the message from. <br /> - **user**: Recipient information. <br /> - **type**: Type of message. <br /> - **content**: Message content. <br /><br /> For information on all supported user, type and content models please refer to our Chat Apps documentation.                                                                                                                         | object |
| outputs    | Properties of the step to save to workflow execution context to use in other steps (Optional). Supported properties are: <br /> - **requestId**: Unique identifier of the HTTP request. <br /> - **umid**: Unique identifier of the message. <br /> - **status**: Status of the message request. <br /> - **description**: Descriptive message on the status of the message. <br /><br /> For information on all supported statuses please refer to our Chat Apps documentation. | object |
| nextStepId | Step id of the next step to execute (Optional). If a next step id is not specified, workflow will terminate after this step.                                                                                                                                                                                                                                                                                                                                                    | string |

**Make a HTTP request** :

*HttpRequest* step allows you to make a custom HTTP request and consume its response. For HTTP requests with request data, automation currently supports application/json content type. Automation service will evaluate the dynamic request data at runtime, serialise the input body to json before sending the request.

```json
{
    "id": "step1",
    "stepType": "HttpRequest",
    "inputs": {
        "url": "https://sample.api.com/newrecord/",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer 4ff3987hf934hf3895b469dc0"
        },
        "body": {
           "property_1": 1,
           "property_2": "{{'umid: ' + data.umid}}", // dynamic field using javascript.
           "property_3": "{{data.receivedAt}}", // datetime field.
           "property_4": {
               "nested_property": "{{'msisdn: ' + data.source}}"
           } // Nested field.
          }
        },
    "outputs": {
        "httpCode": "{{step.responseCode}}",
        "httpReasonPhrase": "{{step.reasonPhrase}}",
        "httpResponse": "{{step.responseBody}}"
    },
    "nextStepId": "step2"
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                           | Type   |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                            | string |
| inputs     | Input parameters for make HTTP request: <br /> - **url**: Url with the path parameters. <br /> - **method**: HTTP method like GET, POST, PATCH, etc. <br /> - **headers**: HTTP headers as an object (Optional). <br /> - **parameters**: Query parameters as an object (Optional). <br /> - **body**: Request body. <br /> - **timeoutSeconds**: Request timeout in seconds (Optional). <br /><br /> | object |
| outputs    | Properties of the step to save to workflow execution context to use in other steps (Optional). Supported properties are: <br /> - **responseCode**: HTTP status code. <br /> - **reasonPhrase**: HTTP reason phrase. <br /> - **responseBody**: HTTP response body. <br /><br />                                                                                                                      | object |
| nextStepId | Step id of the next step to execute (Optional). If a next step id is not specified, workflow will terminate after this step.                                                                                                                                                                                                                                                                          | string |

**Set a delay** :

Wait step allows you to make the workflow wait for a specified period of time before executing the next step. For example, you might have a workflow triggered by an incoming message received outside of office hours and you may want to make the workflow wait till office hours to send an automatic reply.

```json
{
    "id": "step1",
    "stepType": "Wait",
    "inputs": {
        "duration": "0.00:01:00"
    },
    "nextStepId": "step2"
}
```

| Property   | Description                                                                                                                                          | Type   |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                               | string |
| stepType   | Step type.                                                                                                                                           | string |
| inputs     | Wait step supports the following input parameters. <br /> - **duration**: time to wait before executing the next step (format: d.HH:mm:ss). <br /><br /> | object |
| nextStepId | Step id of the next step to execute (Optional). If a next step id is not specified, workflow will terminate after this step.                         | string |

**If condition** :

The **if** condition allows you to create multiple paths in a workflow. While you can use Branch step with just one branch to create an **if** condition, **If** step allows you to specify a conditional path more easily if you don't need complex branching.
In the below example, the two new properties for **If** are **do** and **inputs.condition**. If the **inputs.condition** evaluates to **true**, all the steps specified inside do will be executed.

```json
{
    "id": "step1",
    "stepType": "If",
    "inputs": {
                "condition": "{{!isTimeOfDayBetween(data.payload.status.timestamp, '08:00:00', '17:00:00', 'Singapore Standard Time')}}"
    },
    "do": [
        [
            {
                "stepType": "HttpRequest",
                "id": "call_webhook",
                "nextStepId": "send_ca",
                "inputs": {
                    "url": "http://localhost:8080/mock",
                    "method": "GET"
                }
            },
            {
                "stepType": "ChatAppsMessage",
                "id": "send_ca",
                "inputs": {
                    "subAccountId": "Test_12345_ChatApps",
                    "user": {
                        "msisdn": "{{data.payload.user.msisdn}}"
                    },
                    "type": "text",
                    "content": {
                        "text": "Hello, world!"
                    }
                }
            }
        ]
    ]
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Type   |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                          | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                                      | string |
| inputs     | If step supports the following input parameters: <br /> - **condition**: An expression that evaluates to **true** or **false**. <br />                                                                                                                                                                  | object |
| do | Sequence of steps to be executed if the condition in inputs evaluates to true.                                                                                                                                                                                                                                                                                   | string |

**Wait for Reply** :

The WaitForReply step type allows your workflow to pause till you receive a reply from an end user. For example, you can create a workflow which sends a message to an end user, wait for their reply and act based on various scenarios based content of the reply, for example.

If you have a workflow that that is waiting for a reply from user and the user replies, the automation service makes sure that the paused workflow resumes on their reply instead of starting new workflows of the same type.

```json
{
    "stepType": "WaitForReply",
    "id": "step1",
    "inputs": {
        "from": "+6500000000",
        "channel": "whatsapp",
        "timeout": "00:05:00"
    },
    "outputs": {
        "reply": "{{step.reply}}"
    },
    "selectNextStep": {
        "success_step": "{{step.reply != null}}",
        "failure_step": "{{step.reply == null}}"
    }
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Type   |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | string |
| inputs     | If step supports the following input parameters. <br /> - from: Sender of the inbound message (or an expression that evaluates the sender). If you are waiting for a reply on SMS channel, wait on msisdn (**data.payload.user.msisdn**). If you are waiting on a chat apps channel, wait on channel user id (**data.payload.user.channelUserId**) (exact path depends on the MO version you are on.)  <br /> - channel: Channel on which the sender should be replying. E.g. sms, whatsapp, viber, etc. <br /> - timeout: Wait timeout. If the user does not reply within this timespan, workflow continues to next step. Timeout parameter is optional. If not set, a system level default (usually one day) is used. Accepts a string in the format of “d.HH:mm:ss“. If you omit the “HH:mm:ss“ part, timespan is interpreted as days. **Examples: 1.** “duration“: “1.6:30:15“ indicates 1 day, 6 hours, 30 minutes and 15 seconds. **Examples 2.** “duration“: “00:30:00“ indicates 30 minutes. **Examples 3.** “duration“: “5“ indicates 5 days. <br /> | object |
| outputs | WaitForReply exposes the data in the reply in the in the property reply. You can save it to workflow context using step.reply and use it in a following step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | array |
| selectNextStep | Step selector for various outcomes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | string |

**Voice Message** :

The VoiceMessage step type allows your workflow to send a Voice Message using 8x8 Voice API. For example, you can create a workflow which sends a voice message reminder to an end user.

As per the 8x8 Voice API, you can choose from 3 types of voice messages:

* say: use text to speech to read your message to the end users
* say&capture: use text to speech to read your message and allows to capture DTMF tone from the end users
* playFile: play a recorded file to the end users

```json
{
    "id": "step1",
    "stepType": "VoiceMessage",
    "inputs": {
        "subaccountId": "Test_12345_Voice",
        "clientRequestId": "myId123"
        "action": "say",
        "params": {
            "source": "+6500000000",
            "destination": "6500000000",
            "text": "Hello, world!",
            "repetition": 1,
            "voiceProfile": "en-US-ZiraRUS",
            "speed": 1
        }
    },
    "outputs": {
        "response": "{{step.response}}"
    },
    "nextStepId": "step2"
}
```

| Property   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Type   |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                          | string |
| stepType   | Step type.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | string |
| inputs     | Inputs supported by Call step: <br /> - subAccountId: Voice enabled subaccount id <br /> - clientRequestId: Client message request id. <br /> - action: Call action. Allowed actions are say, say&capture, playFile. Refer to [voice API documentation](/connect/reference/send-single-1) for more information. <br /> - params: Call parameters. Call parameters supported by voice api as documented in [voice API](/connect/reference/send-single-1). <br /> | object |
| outputs         | Output properties supported by VoiceMessage step: <br /> - response: Response received from the voice API. Refer to voice [API documentation](/connect/reference/send-single-1) for the exact response. <br />                                                                                                                                                                                                                                                  | object |
| nextStepId | Step id of the next step to execute (Optional). If a next step id is not specified, workflow will terminate after this step.                                                                                                                                                                                                                                                                                                                                    | string |

**Wait For DTMF** :

The WaitForDTMF step type allows your workflow to wait for a user input (DTMF tone) after a Voice message step using say&capture action. Hence the WaitForDTMF step should be preceded by a VoiceMessage step.

Important thing to note about WaitForDTMF step is in how to choose the correlationId, which is what is used to correlate an inbound call with the wait for DTMF step.

correlationId is chosen based on clientRequestId (if present) or the uid in the DTMF response. Recommendation is to set a unique (per DTMF request-response transaction) clientRequestId in the Call that requests the DTMF response. For instance, you can use the uuid() function to generate a uuid for the client request id and use it as the correlation id (which is recommended by the voice team) or you can save the uid of the call response to workflow context and use it as the correlation id.

```json
{
    "id": "step1",
    "stepType": "WaitForDTMF",
    "inputs": {
        "dtmfRequestId": "{{data.clientRequestId}}",
        "timeout": "00:02:00"
    },
    "outputs": {
        "dtmf": "{{step.dtmfData.actionDetails.dtmf}}"
    },
    "selectNextStep": {
        "dtmf_1": "{{data.dtmf == '1'}}",
        "dtmf_2": "{{data.dtmf == '2'}}",
        "dtmf_3": "{{data.dtmf == '3'}}",
        "invalid_dtmf": "{{data.dtmf != null && data.dtmf != '1' && data.dtmf != '2' && data.dtmf != '3'}}",
        "no_reply": "{{data.dtmf == null}}"
    }
}
```

| Property       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Type   |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| id             | Unique id of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | string |
| stepType       | Step type.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | string |
| inputs         | Inputs supported by WaitForDTMF step: <br /> - dtmfRequestId: A unique identifier to correlate the DTMF response with DTMF request. <br /> - timeout: Wait timeout. If the user does not reply within this timespan, workflow continues to next step. Timeout parameter is optional. If not set, a system level default (usually one day) is used. <br />Accepts a string in the format of “d.HH:mm:ss“. If you omit the “HH:mm:ss“ part, timespan is interpreted as days. Examples: <br />1. “duration“: “1.6:30:15“ indicates 1 day, 6 hours, 30 minutes and 15 seconds. <br />2. “duration“: “00:30:00“ indicates 30 minutes. <br />3. “duration“: “5“ indicates 5 days. <br /> | object |
| outputs        | Output properties supported by WaitForDTMF step: <br /> - dtmfData: DTMF response received from the voice API. Refer to [voice API documentation](/connect/reference/send-single-1) for the exact response. <br />                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | object |
| selectNextStep | Step selector for various outcomes. (Alternatively, you can use nextStepId and point to a branch step and work from there.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | string |
