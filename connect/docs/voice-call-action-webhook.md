# Voice Call Action Webhook

Call action events prompt the customer to take an action to change the call flow. Your "Voice Call Action" (VCA) endpoint can be configured on the sub-account level with the IVR product[Webhooks](/connect/reference/create-a-new-voice-webhook).The structure of the Call Action event object is identical to that of [Call Status](/connect/reference/call-status) event. However the expected response is different.

## Call Action Request (IVR)

8x8 platform will POST a JSON object to your URL.

Sample of Call Action Event

```json
{
  "namespace": "VOICE",
  "eventType": "CALL_ACTION",
  "description": "Action request of a call",
  "payload": {
    "eventId": "77e6a667-133a-11ef-9dd4-e911cc6fc82f",
    "callId": "627e25f1-133a-11ef-b08c-e33c09483244",
    "sessionId": "a4fad4b3-b388-12ee-b217-2fb8260fcf59",
    "subAccountId": "account_x",
    "callStatus": "ACTION_COMPLETED",
    "callDirection": "OUTBOUND",
    "callType": "PSTN",
    "source": "+6568888888",
    "destination": "+6598888888",
    "sourceFormat": "MSISDN",
    "destinationFormat": "MSISDN",
    "sourceCountryCode": "SG",
    "destinationCountryCode": "SG",
    "sourceRefId": "SOME-VN-REF-ID",
    "destinationRefId": "ANOTHER-VN-REF-ID",
    "callDuration": 0,
    "eventData": {            
      "dtmf": "1", //Nullable    
    },
    "sipCode": 200,
    "timestamp": "2024-05-16T04:12:11.217Z"
    "clientActionId": "ivr1_level1"
  }
}

```

The JSON object will contain the following values:

| Name | Type | Description |
| --- | --- | --- |
| namespace | String | 8x8's overall product namespace. For Voice products the value will be "VOICE" |
| eventType | String | Event type that generated this callback. For call action events the value will be "CALL\_ACTION" |
| description | String | Description of the event type that triggered the callback. |
| eventId | String | Unique id that triggered the callback |
| callId | String | Id unique to a one call leg of the number masking session [UUID] |
| sessionId | String | Unique id that represents Number masking session [UUID] |
| subAccountId | String | Id of the 8x8 SubAccount that the callback belongs to. |
| callStatus | String | Status of the call leg that triggered the callback. Values can be:<br>"ACTION\_COMPLETED"<br>"CALL\_RECEIVED" (applicable to Inbound IVR and Number Masking) |
| callDirection | String | Direction of the call leg that triggered the callback. Values can be "INBOUND" or "OUTBOUND" |
| callType | String | Type of the call leg. Values can be "PSTN" (telco operators) or "VOIP"(app to app calling users) users), depending on where the call was initiated from. |
| source | String | Source number associated with the call leg that triggered this callback |
| sourceFormat | String | Format of the source number. For NumberMasking the value will always be "MSISDN" |
| destinationFormat | String | Format of the destination number. For NumberMasking the value will always be "MSISDN" |
| sourceCountryCode | String | Country code of the source number |
| destinationCountryCode | String | Country code of the destination number |
| sourceRefId | String | For OUTBOUND call legs, this property shows the referenceId of the Virtual Number that has been called. For INBOUND calls the value is null |
| destinationRefId | String | For INBOUND call legs, this property shows the referenceId of the Virtual Number that is used as callerId. For OUTBOUND calls the value is null |
| callDuration | String | Duration of the call leg (in seconds) that initiated the callback |
| dtmf | String | DTMF captured if SayAndCapture action is requested. Will be null if nothing is captured. |
| sipCode | Integer | Final Sip status code for the call leg(s) defined by RFC 3261 |
| timestamp | String | Timestamp of a call event |
| clientActionId | String | clientActionId that was provided in the previous VCA callback. |

> 🚧 **ClientActionId**
>
> `clientActionId` is only supported in Voice Call Action Webhook
>
>

clientActionId in Voice Call Action Response

```json
{
    "clientActionId": "ivr1_level2", // Optional. Only supported in Call Action Webhook.
    "callflow": [
        {
            "action": "makeCall", 
            "params": {
                "source": "+65123456789",
                "destination": "+6543212345",
                "callRecording": true
            }
        }
    ]
}

```

---
