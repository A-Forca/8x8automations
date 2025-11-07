# Session Summary (Number Masking)

This method allows you to review the "Voice Session Summary" status and individual call legs.  

"Voice Session Summary" (VSS) endpoint. Your "Voice Session Summary" (VSS) endpoint can be configured on the sub-account level with the Voice Call Action [Webhooks](/connect/reference/create-a-new-webhook)  

This can be used alongside or instead of the [Call Status](/connect/reference/call-status), to simplify your monitoring.

## Request

 When the session has ended, 8x8 platform will POST a JSON object to your URL.

The JSON object will contain the following values:

| Name | Type | Description                                                                                                                                                                                |
| --- | --- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| namespace | String | 8x8's overall product namespace. For Voice products, the value will be "VOICE"                                                                                                             |
| eventType | String | Event type that generated this callback. For session summary events the value will be "SESSION\_SUMMARY"                                                                                   |
| description | String | Description of the event type that triggered the callback.                                                                                                                                 |
| sessionId | String | Unique id that represents Number masking session [UUID]                                                                                                                                    |
| subAccountId | String | Unique ID of account                                                                                                                                                                       |
| sessionStatus | String | “sessionStatus” values of the two call legs. Possible values for “sessionStatus” are: <br>COMPLETED, NO\_ANSWER, BUSY, CANCELED, FAILED, ERROR                                             |
| startTime | String | Start time of call masking session                                                                                                                                                         |
| endTime | String | Start time of call masking session                                                                                                                                                         |
| lastAction | String | Shows the last executed command during the session ([makeCall](/connect/docs/call-action-handling#makecall) or [say](/connect/docs/call-action-handling#say))                              |
| callCount | Integer | Shows how many call legs have been bridged for the given session                                                                                                                           |
| details | Object | JSON object containing information about all call legs in the session                                                                                                                      |
| callId | String | Unique identifier of call leg                                                                                                                                                              |
| callDirection | String | Indicates the direction of the call leg (INBOUND or OUTBOUND)                                                                                                                              |
| callType | String | Type of the call leg. Values can be "PSTN" or "VOIP", depending on where the call was initiated from (telco operators or VoiceSDK users). For NumberMasking the value will always be PSTN. |
| initiatedTimestamp | String | Initiated time of call leg                                                                                                                                                                 |
| connectedTimestamp | String | Time when the call leg is connected                                                                                                                                                        |
| disconnectedTimestamp | String | Time when the call leg is disconnected                                                                                                                                                     |
| source | String | Source number (CallerID) set for the call leg                                                                                                                                              |
| sourceFormat | String | The value for Number Masking will always be "MSISDN"                                                                                                                                       |
| destination | String | Destination number set for the call leg                                                                                                                                                    |
| destinationFormat | String | The value for Number Masking will always be "MSISDN"                                                                                                                                       |
| sourceCountryCode | String | Country code for the Source Number                                                                                                                                                         |
| destinationCountryCode | String | Country code for the Destination Number                                                                                                                                                    |
| sourceRefId | String | For OUTBOUND call legs, this property shows the referenceId of the Virtual Number that has been called. For INBOUND calls the value is null                                                |
| destinationRefId | String | For INBOUND call legs, this property shows the referenceId of the Virtual Number that is used as callerId. For OUTBOUND calls the value is null                                            |
| callStatus | String | Call status of the call leg. The values can be: <br>COMPLETED, NO\_ANSWER, BUSY, CANCELED, FAILED                                                                                          |
| callDuration | Integer | Call duration of the call leg.                                                                                                                                                             |
| errorDetails | Object | JSON object containing information about all call leg errors in the session                                                                                                                |
| errorMsg | String | The error details of the call leg                                                                                                                                                          |
| errorCode | String | Error code specified in the Error object                                                                                                                                                   |
| callQuality | Object | JSON object containing information about all call leg call quality indicators in the session                                                                                               |
| mos | Float | Mean Opinion Score (MOS) is a numerical measure of the human-judged overall quality of the call leg                                                                                        |
| packetLossRate | Float | The packet loss rate reflects the reliability of a communication network path.                                                                                                             |
| jitter | Integer | Jitter reflects any time delay in sending data packets over your call connection.                                                                                                          |

Example of a JSON object sent to your "Voice Session Summary" endpoint:

```json
Success 

{
  "payload": {
    "sessionId": "1f048a84-ea6d-11ee-911b-078f7290bf52",
    "subAccountId": "8x8_test",
    "sessionStatus": "COMPLETED",
    "startTime": "2024-03-25T06:01:30Z",
    "endTime": "2024-03-25T06:01:50Z",
    "lastAction": "MAKE_CALL",
    "callCount": 2,
    "details": {
      "callB": {
        "callId": "1fbdef11-ea6d-11ee-9e30-e53b76c602ef",
        "callDirection": "OUTBOUND",
        "callType": "PSTN",
        "initiatedTimestamp": "2024-03-25T06:01:30Z",
        "connectedTimestamp": "2024-03-25T06:01:37Z",
        "disconnectedTimestamp": "2024-03-25T06:01:50Z",
        "source": "+6568332048",
        "destination": "+6591178965",
        "sourceFormat": "MSISDN",
        "destinationFormat": "MSISDN",
        "sourceCountryCode": "SG",
        "destinationCountryCode": "SG",
        "sourceRefId": "PSTN1",
        "callStatus": "COMPLETED",
        "callDuration": 13,
        "callQuality": {
          "mos": 4.5,
          "packetLossRate": 0,
          "jitter": 19
        }
      },
      "callA": {
        "callId": "1f048a83-ea6d-11ee-911b-e9023a97c284",
        "callDirection": "INBOUND",
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
        "destinationRefId": "PSTN1",
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

```json
Failure
{
  "payload": {
    "sessionId": "47f19e66-2163-11ee-8ccd-27b543a164ea",
    "subAccountId": "wavecell_voice",
    "sessionStatus": "ERROR",
    "startTime": "2023-07-13T09:54:38Z",
    "endTime": "2023-07-13T09:54:38Z",
    "lastAction": "PLAY_TTS",
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

## Session statuses

Here is the list of all possible session statuses:

| CallA Status | CallB Status | Status | Comment |
| --- | --- | --- | --- |
| COMPLETED | COMPLETED | COMPLETED | Successfully established call between two call parties |
| COMPLETED | NO ANSWER | NO ANSWER | The called party did not answer the call |
| COMPLETED | BUSY | BUSY | The called party’s phone was busy |
| COMPLETED | FAILED | FAILED | The outbound call towards the called party’s phone number failed. Possible reasons include the number is switched off or not reachable, invalid phone number, connection error, etc. |
| CANCELED | CANCELED | CANCELED | The calling party disconnected the call before a “Status” for the outbound call leg was received. This can occur if a user disconnects before ringing is completed or as soon as the caller hears an operator tone suggesting the phone number is invalid / switched off. |
| COMPLETED | NULL | COMPLETED | It indicates that the call flow did not have an outbound call leg. This can happen when the called phone number has been answered by a TTS prompt. |
| ERROR | NULL | ERROR | It indicates that the inbound leg had an error while processing the call. This can happen when the Voice Call Action webhook fails or when there is no call coverage to the target country. Additional error details are provided when this happens. |
| COMPLETED | ERROR | ERROR | It indicates that the outbound leg had an error while processing the call. Additional error details are provided when this happens. |

## Response

Your endpoint should respond with 200 OK status

---

### Error Details and Error Code

| -2004 | No coverage available for requested area |
| --- | --- |
| -2005 | Unable to synthesize text to speech |
| -2006 | Unable to download file for playback. |
| -2007 | The validity period of the call flow request has expired. |
| -2008 | The provided source MSISDN or caller ID is not whitelisted. |
| -2009 | The scenario parameters provided is invalid. |
| -9999 | An unknown error has occurred. |
