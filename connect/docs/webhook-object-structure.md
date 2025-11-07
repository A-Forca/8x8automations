# Webhook object structure

8x8 platform sends webhooks for a different event using the following common structure for request body:

| Property name | Property type | Description |
| --- | --- | --- |
| namespace | string\* | A generic namespace for a webhook. |
| eventType | string\* | The type of the event for webhook. |
| description | string | Human-readable description of the event |
| payload | object\* | The event information object |

Where `namespace` is one of the following:

* `SMS`
* `ChatApps`

The `eventType` is one of the following:

* `inbound_message_received`
* `outbound_message_status_changed`

### Webhook payload

* [Inbound SMS](/connect/reference/inbound-sms)
* [Delivery receipts for outbound SMS](/connect/reference/delivery-receipts-for-outbound-sms)
* [Inbound ChatApps message](/connect/reference/inbound-chatapps-message)
* [Delivery receipts for outbound ChatApps](/connect/reference/delivery-receipts-for-outbound-chatapps)
