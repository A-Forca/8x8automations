# Call Action Handling (IVR)

## Responding to Call Action Request

To start your call flow you need to reply to the call action request with an HTTP 200 response code including a Call Action in the HTTP response body. The supported Call Actions are:

* `makeCall` - Initiates an outgoing call to the desired destination. This function should be used to connect the first call with another party.
* `say` - Generates and plays a TTS to the calling user.
* `sayAndCapture` - Plays a voice file in to the call and then captures users DTMF input and reports back the DTMF via Voice Call Action (VCA) webhook.
* `playFile` - Downloads the sound/voice file provided and plays it back in the currently active call.
* `hangup` - Disconnects all active calls. This will terminate the session, triggering the session summary webhook.

## makeCall

This function should be used to connect the first call with another party.

The following is an example of the JSON response you would need to provide:

```json
{
   "clientActionId": "ivr1_level2",
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
| callRecording | Boolean | (Optional) Trigger to start recording the IVR session. Before using this option please reach out to your Account Manager since this option might include additional costs. Additionally please make sure that the Call Recording has been configured on your account. To configure call recording please take a look at [Call Recordings](/connect/reference/call-recordings) |

## say

This action converts the given text in to a speech and plays it in the currently active call.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "ivr1_level2",
  "callflow": [
    {
      "action": "say",
      "params": {
        "text": "Hello This is a test message",
        "voiceProfile": "en-US-ZiraRUS",
        "repetition": 1,//optional(default is 1)
        "speed": 1.0,//optional(default is 1)
      }
    }
  ]
}

```

The action should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| action | String | say – Text to speech function. |
| text | String | The text to speech message that will be played on the call. |
| voiceProfile | String | The voice profile of the spoken text, see in the table below the supported voice profiles. Please use [Voice Profile API](/connect/reference/get-voice-profile-information) to retrieve `voiceProfile` |
| repetition | Integer | Defines the number of times the text will be repeated during the call. Default repetition is 1. Max repetition is 3 |
| speed | Float | Controls the speed of the speech. Maximum speed is 2.0 and minimum speed is 0.5. |

## SayAndCapture

This action plays a text to speech file in to the call and then captures user's DTMF input and reports back the DTMF via Voice Call Action (VCA) webhook.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "ivr1_level2",
  "callflow": [
    {
  "action": "sayAndCapture",
    "params": {
        "promptMessage": "Enter 1 if you would like to talk", //Mandatory
        "successMessage": "Thank you, have a nice day!",      //Optional 
        "failureMessage": "Invalid input received.",          //Optional
        "voiceProfile": "en-US-BenjaminRUS",                  //Mandatory
        "speed": 1.0,             //Optional. Defaults to 1.0.
        "completeOnHash": true,   //Optional. Defaults to true. If false, maxDigits must be provided and > 0 and < 26.
        "minDigits": 2,           //Optional. If provided, maxDigits is mandatory.
        "maxDigits": 2,           //Optional. Defaults to 25.
        "digitTimeout": 10000,    //Optional. If provided, overallTimeout is mandatory. Must be less than overallTimeout.
        "overallTimeout": 10000,  //Optional. Defaults to 30000. 
        "noOfTries": 3            //Optional. Defaults to 3. 
      }
    }
  ]
}

```

The action should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| action | String | SayAndCapture – Play a Text to speech voice file and prompting user to enter a DTMF. |
| promptMessage | String | Text Input for the text-to-speech message. |
| successMessage | String | Text-to-speech message that is played for successful digit capture. |
| failureMessage | String | Text-to-speech message that is played in case of capture errors. Capture errors are either timeouts or the input digit count is out of the range. |
| voiceProfile | String | The voice profile of the spoken text, see in the table below the supported voice profiles. Please use [Voice Profile API](/connect/reference/get-voice-profile-information) to retrieve `voiceProfile`. |
| speed | Float | Controls the speed of the speech. Maximum speed is 2.0 and minimum speed is 0.5. |
| completeOnHash | Boolean | If `completeOnHash` is false, once the user entered digits reachers maxDigits , the action will end. If the `completeOnHash` is set to true, then any time user enters #, the entered digits will be validated and the action will end in either success or failure. |
| minDigits | Integer | The minimum required digits entered to be a valid input. |
| maxDigits | Integer | The maximum digits accepted. |
| overallTimeout | Integer | The time allowed for the user to complete entering all digits in milliseconds. |
| noOfTries | Integer | How many times the sayAndCapture will loop in case of failed inputs. |

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
> Downloaded voice files are cached for 1 hour for faster access, if used in consequent requests. If the file content is changed within 1 hour after the first request, make sure to change the file name for the changes to be reflected in the calls afterwards.
>
>

## hangup

This action should be used to hang up the incoming call.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "ivr1_level2",
  "callflow": [ 
    {
      "action": "hangup" 
    }
  ]
}

```

Note: The Hangup action terminates the active call session.
