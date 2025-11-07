# Call Action Handling (Number Masking)

This method provides insights about call details and will be sent to your "Voice Call Action" (VCA) endpoint. Your "Voice Call Action" (VCA) endpoint can be configured on the sub-account level with the Number Masking [Webhooks](/connect/reference/create-a-new-webhook).

## Call Action Request

When receiving an incoming call to your virtual number 8x8 platform will POST a JSON object to your URL.

The JSON object will contain the following values:

| Name | Type | Description |
| --- | --- | --- |
| namespace | String | 8x8 product channel definition |
| eventType | String | Current call handle event type. CALL\_ACTION |
| description | String | Description of the current call handle event type |
| payload | object | contains call information about the current number masking session |
| eventId | String | Id unique to an event of the current number masking session [UUID] |
| callId | String | Id unique to a call leg of the current number masking session [UUID] |
| sessionId | String | Id unique to the current number masking session [UUID] |
| subAccountId | String | unique id for your subaccount |
| callStatus | String | Status of the current call leg. Values can be:<br>CALL\_RECEIVED (only for number masking) |
| callDirection | String | Direction of the call leg. INBOUND (Inbound only for number masking) |
| callType | String | For Number Masking the call type is always PSTN |
| source | String | Source number of the call leg. |
| destination | String | Destination number of the call leg. |
| sourceFormat | String | Source format for number masking is always MSISDN |
| sourceCountryCode | String | Country code of the source number |
| destinationCountryCode | String | Country code of the destination number |
| destinationRefId | String | Reference Id for the virtual number (this is from your [Get My Virtual Number Endpoint](/connect/reference/number-health-service) |
| callDuration | Integer | Call duration for the current call leg. For the number masking scenario, `callDuration` would be "0". |
| sipCode | Integer | Final Sip status code for the call leg defined by RFC 3261 |
| Timestamp | Timestamp | Timestamp of the processed event |

Example of a JSON object sent to your handleURL:

VCA - Call Action Request

```json
{
  "namespace": "VOICE",
  "eventType": "CALL_ACTION",
  "description": "Action request of a call",
  "payload": {
    "eventId": "eb0fc709-9693-11ea-454d-1705dde98182",
    "callId": "a1d6a5e3-efec-11e9-b999-7d370b5f90d1",
    "sessionId": "a1d6a5e2-efec-11e9-b999-efc71013a78f",
    "subAccountId": "your_subaccount_id",
    "callStatus": "CALL_RECEIVED",
    "callDirection": "INBOUND",
    "callType": "PSTN",
    "source": "+65123456789",
    "destination": "+65987654321",
    "sourceFormat": "MSISDN",
    "destinationFormat": "MSISDN",
    "sourceCountryCode": "SG",
    "destinationCountryCode": "SG",
    "destinationRefId": "vn-ref-1",
    "callDuration": 0,
    "sipCode": 200,
    "timestamp": "2019-10-16T08:12:01Z"
  }
}

```

## Responding to Call Action Request

To start your call flow you need to reply to the call action request with an HTTP 200 response code including a Call Action in the HTTP response body. The supported Call Actions are:

* makeCall - Initiates an outgoing call to the desired destination. This function should be used to connect the first call with another party.
* say - Generates and plays a TTS to the calling user.
* hangup - Disconnects all active calls. This will terminate the session, triggering the session summary webhook.

## makeCall

This function should be used to connect the first call with another party.

The following is an example of the JSON response you would need to provide:

```json
{
   "clientActionId": "NumberMaskingId1",
   "callflow": [
      {
         "action": "makeCall",
         "params": {
            "source": "6512345678",
            "destination": "6587654321",
            "callRecording": true //Optional. Use only if call recording has been set up.
         }
      }
   ]
}

```

The action should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| action | String | MakeCall – Action to Connect/Bridge call between two users |
| destination | String | Number of the called party in E.164 format (The second user's number). |
| source | String | Number of the calling party in E.164 format. This should be the Virtual Number allocated to your sub-account |
| callRecording | Boolean | (Optional) Trigger to start recording the Number Masking session. Before using this option please reach out to your Account Manager since this option might include additional costs. Additionally please make sure that the Call Recording has been configured on your account. To configure call recording please take a look at [Call Recordings](/connect/reference/call-recordings) |

## say

This action should be used to play a text to speech message on the call.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "NumberMaskingId1",
  "callflow": [
    {
      "action": "say",
      "params": {
        "text": "Hello This is a test message",
        "voiceProfile": "en-US-ZiraRUS",
        "repetition": 1,//optional(default is 1)
        "speed": 1.0,//optional(defailt is 1)
      }
    }
  ]
}

```

The above example would be used if you want the message

The action should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| action | String | say – Text to speech function |
| text | String | The text to speech message that will be played on the call |
| voiceProfile | String | The voice profile of the spoken text, see in the table below the supported voice profiles. Please use [Voice Profile API](/connect/reference/get-voice-profile-information) to retrieve `voiceProfile` |
| repetition | Integer | Defines the number of times the text will be repeated during the call. |
| speed | Float | Controls the speed of the speech |

## playFile

Downloads the sound/voice file provided and plays it back in the currently active call.

File type requirements:

* Supported file types are .wav and mp3.
* API only accepts file that is smaller than 5MB.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "ivr1_level2",
  "callflow": [
    {
    "action": "playFile",
    "params": {
      "fileUrl": "https://sample-videos.com/audio/mp3/wave.mp3",  // mandatory
      "repetition": 1   //optional
      }
    }
  ]
}

```

The action should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| action | String | say – play a recorded file into a currently active call funtion |
| fileUrl | String | The public link of the hosted voice file |
| repetition | Integer | Defines the number of times the text will be repeated during the call. Default repetition is 1. Max repetition is 3 |

> 📘Downloaded Voice files
>
> Downloaded voice files are cached for 1 hour for faster access, if used in consequent requests. If the file content is changed within 1 hour after the first request, make sure to change the file name for the changes to be reflected in the calls afterward
>
>

## hangup

This action should be used to hang up the incoming call.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "NumberMaskingId1",
  "callflow": [ 
    {
      "action": "hangup" 
    }
  ]
}

```

Note: The Hangup action terminates the active call session.

## Commands Example

On the following example it is demonstrated how multiple actions can be used in the same call action handle reply:

```json
{
  "clientActionId": "NumberMaskingId1",
  "callflow": [ 
    {
      "action": "say",
        "params": {
          "text": "Hello This is a test message",
          "voiceProfile": "en-US-ZiraRUS",
          "repetition": 1,//optional(default is 1)
          "speed": 1.0,//optional(defailt is 1)
      }
    },
    {
      "action": "hangup" 
    }
  ] 
}

```
