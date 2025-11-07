# Tutorial: Customer Survey via WhatsApp

## Introduction

In this tutorial, you'll learn how to create a WhatsApp chatbot that prompts users with survey questions and sends their responses to Google Sheets. This process can also be adapted for other survey tools like Qualtrics or SurveyMonkey.

The default tutorial includes three questions, but you can customize it with your own questions and modify the workflow as needed. Use this tutorial as a foundation to develop your own tailored customer surveys.

## Prerequisites

**Ensure you have:**

* An **8x8** account
* A **WhatsApp Business API** account with 8x8
* Access to **Google Sheets** and its API
  * You can also choose to substitute another sheet or survey tool.
* **Pipedream Account**
  * You can also choose to substitute a similar API connector tool like Zapier, Make or even your own API server.

## Video Demo

This is a accompanying video meant to show the WhatsApp Customer Survey as a demo.

<iframe
  src="https://www.youtube.com/embed/2MuSX20i9EA?si=UE8cEQhaz37wLt0a"
  height="500px"
  width="100%"
  allow="picture-in-picture; web-share"
  allowFullScreen>
</iframe>

## Step 1: Setup the Automation Builder Workflow

You can find an example Automation Workflow workflow below, which you can use to import into the Automation Builder UI in [Connect](https://connect.8x8.com/automation).

While we will not explain the different components of the tutorial here, if you need a refresher please see our section on Automation Builder [Steps](triggers-and-steps-library) and [Triggers](triggers).

tutorial_wa_survey.json

```json
{
  "definition": {
    "id": "65b79d9a-cc6c-4f04-834f-0afee555ba01",
    "name": "Tutorial G Sheets Survey",
    "version": 4,
    "steps": [
      {
        "stepType": "ChatAppsMessage",
        "id": "send_ca",
        "do": [],
        "nextStepId": "waitforreply_9395",
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          },
          "type": "text",
          "content": {
            "text": "Welcome to the 8x8 Customer Satisfication Survey.  You will be asked 3 questions regarding our 8x8 Products.\n\nQuestion 1: What 8x8 Products do you Use?"
          }
        },
        "outputs": {
          "mobileNumber": "variable 0",
          "customerName": "variable 1"
        },
        "selectNextStep": {}
      },
      {
        "stepType": "WaitForReply",
        "id": "waitforreply_9395",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "from": "{{data.mobileNumber}}",
          "channel": "whatsapp",
          "timeout": "0.00:00:10"
        },
        "outputs": {
          "waitforreply_9395_step_text": "{{step.reply.payload.content.text}}"
        },
        "selectNextStep": {
          "chatappsmessage_1242": "{{ step.reply != null }}",
          "chatappsmessage_5691": "{{ step.reply == null }}"
        }
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_1242",
        "do": [],
        "nextStepId": "waitforreply_9504",
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "Question 2: How would you rate your overall experience from a scale of 10 to 1? \n\n10 being the best experience and 1 being the worst experience."
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_5691",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "No responses in allotted time, ending the survey. Your responses have not been recorded."
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "WaitForReply",
        "id": "waitforreply_9504",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "from": "{{data.mobileNumber}}",
          "channel": "whatsapp",
          "timeout": "0.00:00:10"
        },
        "outputs": {
          "waitforreply_9504_step_text": "{{step.reply.payload.content.text}}"
        },
        "selectNextStep": {
          "chatappsmessage_3769": "{{ step.reply != null }}",
          "chatappsmessage_7411": "{{ step.reply == null }}"
        }
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_3769",
        "do": [],
        "nextStepId": "waitforreply_9823",
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "Question 3: What are the major issues that you faced with 8x8 Products?"
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_7411",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "No responses in allotted time, ending the survey. Your responses have not been recorded."
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "WaitForReply",
        "id": "waitforreply_9823",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "from": "{{data.mobileNumber}}",
          "channel": "whatsapp",
          "timeout": "0.00:00:10"
        },
        "outputs": {
          "waitforreply_9823_step_text": "{{step.reply.payload.content.text}}"
        },
        "selectNextStep": {
          "chatappsmessage_0901": "{{ step.reply != null }}",
          "chatappsmessage_4456": "{{ step.reply == null }}"
        }
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_0901",
        "do": [],
        "nextStepId": "httprequest_4536",
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "Thank you for your responses to our survey! Your responses are being recorded."
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "ChatAppsMessage",
        "id": "chatappsmessage_4456",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "subAccountId": "<Replace with your Subaccount>",
          "type": "text",
          "content": {
            "text": "No responses in allotted time, ending the survey. Your responses have not been recorded."
          },
          "user": {
            "msisdn": "{{data.mobileNumber}}"
          }
        },
        "outputs": {},
        "selectNextStep": {}
      },
      {
        "stepType": "HttpRequest",
        "id": "httprequest_4536",
        "do": [],
        "nextStepId": null,
        "inputs": {
          "method": "POST",
          "url": "https://eo3yuu49vzo9m6.m.pipedream.net",
          "headers": {},
          "parameters": {},
          "body": {},
          "timeoutSeconds": 30
        },
        "outputs": {},
        "selectNextStep": {}
      }
    ]
  },
  "subAccountId": "<Replace with your Subaccount>",
  "trigger": "http_request",
  "status": "enabled"
}

```

Once the workflow is imported, it should appear within Automation Builder similar to the one below.

![image](../images/faf55c4-Jun-20-2024_16-59-04.gif)
It is comprised of Messaging Apps, Branches, Wait for Replies and a single HTTP Request Step. If you choose to modify the flow you may also need to modify the request body to Pipedream at the end depending on the questions that you ask.

## Step 2: Setup Google Sheet

Setup a Google Sheet with the following columns on your Google Account which we will use later within Pipedream to populate.

![image](../images/2f3913c-image.png)

Here is an example table that you can be copy/pasted to your Google Sheet.

| Mobile Number | Response 1:<br>What 8x8 Products do you Use? | Response 2: How would you rate your overall experience from a scale of 10 to 1? | Response 3: What are the major issues that you faced with 8x8 Products? |
| --- | --- | --- | --- |
|  |  |  |  |

## Step 3: Setup Pipedream

Setup a new workflow with an **HTTP Trigger** followed by a **Google Sheets: Add Single Row Step**

![image](../images/b4333bb-image.png)

The  **HTTP Trigger** should have these following configurations:

![image](../images/cc24cff-image.png)
  
Within the **HTTP Trigger,** go to **Generate Test Event** and use the following JSON as the Test Event's input. This will allow us to correctly populate the values for the following Google Sheet step.

![image](../images/e2dff8a-Screenshot_2024-06-20_at_5.28.36_PM.png)

```json
{
  "response1": "WhatsApp, SMS",
  "response2": "10",
  "response3": "No Issues!",
  "mobileNumber": "+6599999999"
}

```

The **Google Sheets Step** should have the following configuration.

![image](../images/5ab2223-Screenshot_2024-06-20_at_5.30.40_PM.png)

Within **Pipedream**, you should be able to see the HTTP responses sent by Automation Builder which may be useful in case any debugging is required.

![image](../images/f8264b4-Screenshot_2024-06-21_at_10.11.34_AM.png)

## Step 4: Send WhatsApp Message

After setting up the above, you should be able to send a the WhatsApp Trigger message to your WhatsApp Account and complete the survey as follows.

![image](../images/6d1475c-image.png)

This should result in a row being added to your Google Sheet with the response.

![image](../images/4338b18-image.png)

## Conclusion

While we use **Google Sheets** in this tutorial, the same idea can be extended to a dedicated Customer Survey software like **Qualtrics, SurveyMonkey, Alchemer**, **etc**. Similarly while we used **Pipedream** for this tutorial, another tool that offers similar HTTP Trigger and Google Sheet Integration capabilities can also be used in it's place.

**Expanded Explanation**

* **Increased Response Rate:** Reduces friction, making it easier for users to participate.
* **Higher Engagement Levels:** Uses interactive features to keep respondents interested.
* **Enhanced Reach and Accessibility:** Broadens audience reach due to WhatsApp's popularity.
* **Reduced Technical Issues:** Minimizes problems like slow loading and compatibility issues.

We encourage to take this tutorial as a template and try it out with your own systems to craft a survey using automation builder.
