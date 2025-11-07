# Session Summary (Voice Messaging)

This method allows you to review the "Voice Session Summary" status and individual call legs.  
"Voice Session Summary" (VSS) endpoint. Your "Voice Session Summary" (VSS) endpoint can be configured on the sub-account level with the Voice Call Action [Webhooks](/connect/reference/create-a-new-webhook)  
This can be used alongside or instead of the [Call Status](/connect/reference/call-status), to simplify your monitoring.

## Request

When the session has ended, 8x8 platform will POST a JSON object to your URL.

The JSON object will contain the following values:

| Name | Type | Description |
| --- | --- | --- |
| namespace | String | 8x8's overall product namespace. For Voice products, the value will be "VOICE" |
| eventType | String | Event type that generated this callback. For session summary events the value will be "SESSION\_SUMMARY" |
| description | String | Description of the event type that triggered the callback. |
| sessionId | String | Unique id that represents Voice Messaging session [UUID] |
| subAccountId | String | Unique ID of account |
| sessionStatus | String | “sessionStatus” values of the two call legs. Possible values for “sessionStatus” are:<br>COMPLETED, NO\_ANSWER, BUSY, CANCELED, FAILED, ERROR**For Opt Out Scenario:**<br>- COMPLETED\_UNSUBSCRIBED (`user opt out`)<br>- COMPLETED\_UNSUB\_ERROR (`error encountered during blacklist process`)<br>- UNSUBSCRIBED\_CONTACT (`user is already in the blacklist group`) |
| startTime | String | Start time of voice messaging session |
| endTime | String | Start time of voice messaging session |
| lastAction | String | Shows the last executed command during the session  |
| callCount | Integer | Shows how many call legs have been bridged for the given session |
| details | Object | JSON object containing information about all call legs in the session |
| callId | String | Unique identifier of call leg |
| callDirection | String | Indicates the direction of the call leg (INBOUND or OUTBOUND) |
| callType | String | Type of the call leg. Values can be "PSTN" or "VOIP", depending on where the call was initiated from (telco operators or VoiceSDK users). For Voice Messaging the value will always be PSTN. |
| initiatedTimestamp | String | Initiated time of call leg |
| connectedTimestamp | String | Time when the call leg is connected |
| disconnectedTimestamp | String | Time when the call leg is disconnected |
| source | String | Source number (CallerID) set for the call leg |
| sourceFormat | String | The value for Voice Messaging will always be "MSISDN" |
| destination | String | Destination number set for the call leg |
| destinationFormat | String | The value for Voice Messaging will always be "MSISDN" |
| sourceCountryCode | String | Country code for the Source Number |
| destinationCountryCode | String | Country code for the Destination Number |
| sourceRefId | String | For OUTBOUND call legs, this property shows the referenceId of the Virtual Number that has been called. For INBOUND calls the value is null |
| callStatus | String | Call status of the call leg. The values can be:<br>COMPLETED, NO\_ANSWER, BUSY, CANCELED, FAILED |
| callDuration | Integer | Call duration of the call leg. |
| errorDetails | Object | JSON object containing information about all call leg errors in the session |
| errorMsg | String | The error details of the call leg |
| errorCode | String | Error code specified in the Error object |
| callQuality | Object | JSON object containing information about all call leg call quality indicators in the session |
| mos | Float | Mean Opinion Score (MOS) is a numerical measure of the human-judged overall quality of the call leg |
| packetLossRate | Float | The packet loss rate reflects the reliability of a communication network path. |
| jitter | Integer | Jitter reflects any time delay in sending data packets over your call connection. |

Example of a JSON object sent to your "Voice Session Summary" endpoint:

```json Session Summary (Success)
{
  "payload": {
    "sessionId": "1f048a84-ea6d-11ee-911b-078f7290bf52",
    "subAccountId": "8x8_test",
    "sessionStatus": "COMPLETED",
    "startTime": "2024-03-25T06:01:30Z",
    "endTime": "2024-03-25T06:01:50Z",
    "lastAction": "MAKE_CALL",
    "callCount": 1,
    "details": {
      "CallA": {
        "callId": "1f048a83-ea6d-11ee-911b-e9023a97c284",
        "callDirection": "OUTBOUND",
        "callType": "PSTN",
        "initiatedTimestamp": "2024-03-25T06:01:28Z",
        "connectedTimestamp": "2024-03-25T06:01:37Z",
        "disconnectedTimestamp": "2024-03-25T06:01:50Z",
        "source": "+12314377870",
        "destination": "+6568332048",
        "sourceFormat": "MSISDN",
        "destinationFormat": "MSISDN",
        "sourceCountryCode": "US",
        "destinationCountryCode": "SG",
        "SourceRefId": "null",
        "callStatus": "COMPLETED",
        "callDuration": 13,
        "callQuality": {
          "mos": 4.5,
          "packetLossRate": 0,
          "jitter": 20
        }
      }
    }
  },
  "namespace": "VOICE",
  "eventType": "SESSION_SUMMARY",
  "description": "Summary of a completed call session"
}
```

```json Session Summary (Failure)
{
  "payload": {
    "sessionId": "47f19e66-2163-11ee-8ccd-27b543a164ea",
    "subAccountId": "8x8_test",
    "sessionStatus": "ERROR",
    "startTime": "2024-07-13T09:54:38Z",
    "endTime": "2024-07-13T09:54:38Z",
    "lastAction": "MAKE_CALL",
    "callCount": 1,
    "errorDetails": {
      "errorMsg": "No coverage available for requested area",
      "errorCode": -2005
    },
    "details": {
      "callA": {
        "callId": "4809bb03-2163-11ee-8f06-8da8b5ddeca4",
        "callDirection": "OUTBOUND",
        "callType": "PSTN",
        "initiatedTimestamp": "2023-07-13T09:54:38Z",
        "disconnectedTimestamp": "2023-07-13T09:54:38Z",
        "source": "+6568332048",
        "destination": "+6591178965",
        "sourceFormat": "MSISDN",
        "destinationFormat": "MSISDN",
        "sourceCountryCode": "SG",
        "destinationCountryCode": "SG",
        "sourceRefId": "PSTN1",
        "callStatus": "ERROR",
        "callDuration": 0
      }
    }
  },
  "namespace": "VOICE",
  "eventType": "SESSION_SUMMARY",
  "description": "Summary of a completed call session"
}
 

```

## Response

Your endpoint should respond with 200 OK status

***

### Error Details and Error Code

| Status Code | Message                                                     |
| :---------- | :---------------------------------------------------------- |
| \-2001      | An internal error has occurred                              |
| \-2002      | An internal connectivity error has occurred                 |
| \-2003      | The call flow provided is invalid                           |
| \-2004      | No coverage available for requested area                    |
| \-2005      | Unable to synthesize text to speech                         |
| \-2008      | The provided source MSISDN or caller ID is not whitelisted. |
| \-9999      | An unknown error has occurred.                              |
