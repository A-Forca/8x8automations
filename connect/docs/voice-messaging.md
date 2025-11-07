# Getting started with Voice API

8x8 voice services are offered through the callflows API. Specific actions within the callflows API would enable users. Currently, callflows APIs support the following Callflow Actions

- `makeCall` - Initiates an outgoing call to the desired destination. This function should be used to connect the first call with another party
- `say` - Generates and plays a TTS to the calling user.
- `sayAndCapture`- Plays a voice file into the call, captures the user's DTMF input, and reports back the DTMF via Voice Call Action (VCA) webhook.
- `playFile` - Downloads the sound/voice file provided and plays it back in the currently active call.
- `hangup` - Disconnects all active calls. This will terminate the session, triggering the session summary webhook.

Our documentation is based on the use cases

**Voice Messaging**

- User would be able to send a voice message either by utilising text-to-speech (`say`) or playing an audio file (`playfile`)

**IVR**

- User would be able to utilise the full range of callflow actions to create their inbound or outbound IVR

**Number Masking Service**

- User can carry out anonymised calling for supported use cases. More details can be found at [Number Masking Documentation](/connect/reference/getting-started-with-number-masking)

>
> ❗️ Virtual numbers need to be purchased either through your account manager or by dropping a support email to [support@cpaas.8x8.com](mailto:support@cpaas.8x8.com)
>
