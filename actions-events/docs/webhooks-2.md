# Webhooks

Before you can set up your Chat channel, you must first create a Webhook. Whenever an agent adds a message to a conversation that you create using the Chat API, 8x8 makes an HTTP call to the Webhook URL.

A Webhook can be created either via UI or via API.

## Create a Webhook using Configuration Manager

1. Access your **[Configuration Manager](https://docs.8x8.com/8x8WebHelp/VCC/configuration-manager-general/content/cfgoverview.htm)** implementation.
2. Go to **Integrations > Webhooks**.

![3322](../images/fbd3cf3-Screenshot_2021-07-06_at_16.03.36.png "Screenshot 2021-07-06 at 16.03.36.png")
3. Click **Add webhook**

![add webhook](../images/495e6f2-add-webhook.png)

3. Click **Save**

## Create a Webhook using API

1. Access your **[API key](/actions-events/docs/api-key)**
2. Call the **[Create a WebHook endpoint](/actions-events/reference/createwebhook-1)**
