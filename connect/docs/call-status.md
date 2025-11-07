# Call Status (Number Masking)

This method provides insights about call details and will be sent to your "Voice Call Summary" (VCS) endpoint. Your "Voice Call Summary" (VCS) endpoint can be configured on the sub-account level with the Number Masking [Webhooks](/connect/reference/create-a-new-webhook).

When receiving status updates for ongoing calls, the 8x8 platform will POST a JSON object to your "Voice Call Summary" (VCS) endpoint.

The JSON object will contain the following values:

| Name | Type | Description |
| --- | --- | --- |
| namespace | String | 8x8's overall product namespace. For Voice products the value will be "VOICE" |
| eventType | String | Event type that generated this callback. For call status events the value will be "CALL\_STATUS" |
| description | String | Description of the event type that triggered the callback. |
| eventId | String | Unique id that triggered the callback |
| callId | String | Id unique to a one call leg of the number masking session [UUID] |
| sessionId | String | Unique id that represents Number masking session [UUID] |
| subAccountId | String | Id of the 8x8 SubAccount that the callback belongs to. |
| callStatus | String | Status of the call leg that triggered the callback. Values can be:<br>CALL\_INITIATED<br>CALL\_RECEIVED<br>CALL\_CONNECTED<br>CALL\_DISCONNECTED<br>CALL\_UPDATED<br>DTMF\_RECEIVED |
| callDirection | String | Direction of the call leg that triggered the callback. Values can be "INBOUND" or "OUTBOUND" |
| callType | String | Type of the call leg. Values can be "PSTN" or "VOIP", depending on where the call was initiated from (telco operators or VoiceSDK users). For NumberMasking the value will always be PSTN. |
| source | String | Source number associated with the call leg that triggered this callback |
| destination | String | Destination number associated with the call leg that triggered this callback |
| sourceFormat | String | Format of the source number. For NumberMasking the value will always be MSISDN. |
| destinationFormat | String | Format of the destination number. For NumberMasking the value will always be MSISDN. |
| sourceCountryCode | String | Country code of the source number |
| destinationCountryCode | String | Country code of the destination number |
| sourceRefId | String | For INBOUND call legs this property shows the referenceId of the Virtual Number that has been called. For OUTBOUND calls the value is null |
| destinationRefId | String | For OUTBOUND call legs this property shows the referenceId of the Virtual Number that is used as callerId. For INBOUND calls the value is null |
| callDuration | String | Duration of the call leg (in seconds) that initiated the callback |
| eventData | String | Event data captured during the call. |
| sipCode | Integer | Final Sip status code for the call leg(s) defined by RFC 3261 |
| timestamp | String | Timestamp of a call event |

Additional parameters could be included depending on individual destination or account requirements.  

Example of a JSON object sent to your handleURL:

```json
{
  "namespace": "VOICE",
  "eventType": "CALL_STATUS",
  "description": "Status update of a call",
  "payload": {
    "eventId": "eb0fc709-9693-11ea-454d-1705dde98182",
    "callId": "a1d6a5e3-efec-11e9-b999-7d370b5f90d1",
    "sessionId": "a1d6a5e2-efec-11e9-b999-efc71013a78f",
    "subAccountId": "account_x",
    "callStatus": "CALL_INITIATED",
    "callDirection": "INBOUND | OUTBOUND",
    "callType": "PSTN | VOIP",
    "source": "+6283891703225",
    "destination": "+622150996455",
    "sourceFormat": "MSISDN",
    "destinationFormat": "MSISDN",
    "sourceCountryCode": "ID | Null",
    "destinationCountryCode": "ID | Null",
    "sourceRefId": "NumberRef1 | Null",
    "destinationRefId": "vn-ref-1 | Null",
    "callDuration": 10,
    "eventData": " ",
    "sipCode": 200,
    "timestamp": "2019-10-16T08:12:01Z"
  }
}

```

## Response

Your endpoint should respond with 200 OK status.
