# Using the Android SDK

## Using the SDK

* [Initialize the SDK](#initialize-the-sdk)
* [Register Voice User](#register-and-activate-a-voice-user)
* [SDK state](#sdk-state)
* [Request runtime permissions](#request-runtime-permissions)
* [Place a call](#place-a-call)
* [Mid-call features](#mid-call-features)
* [Call updates](#call-updates)
* [Receive a Call](#receive-a-call)
* [Update contact information](#update-contact-information)
* [Audio control](#audio-control)
* [Update push token and phone number](#update-push-notification-token-and-phone-number)
* [Unregister Voice User](#unregister-and-deactivate-voice-user)
* [Proguard Rules](#proguard-rules)
* [Shared Preferences](#shared-preferences)

## Initialize the SDK

To initialize the Voice SDK add the following in the **`onCreate`** function of your Activities and Services classes that need to use the Voice SDK APIs.

```kotlin
class MyService: LifecycleService() {

   ...
   val voice by lazy { Voice.getInstance() }

   override fun onCreate() {
      super.onCreate()
      voice.init(application)
      ...
   }
   ...
}

```

## Collect log information from the SDK

```kotlin
lifecycleScope.launch {
    voice.loggedData.collect { voiceLog ->
        // Process received log
    }
}

```

The Voice SDK sends log information to the application.

>
> **Note:** References to Voice in this document pertain to the **`voice`** object.
>
>
>

## Register and Activate a Voice User

In order for the Voice SDK to function correctly, you need to add Voice user information to make and receive calls. Use the following for user data:

```java
val userConfiguration = userConfiguration {
    accountId = "YOUR_ACCOUNT_ID"
    userId = "YOUR_USER_ID"
    msisdn = "YOUR_DEVICE_NUMBER"
    jwtToken = "YOUR_JWT_TOKEN"
    displayName = "YOUR_NAME"
    deviceId = "UNIQUE_DEVICE_IDENTIFIER"
}

```

>
> **Note:**
>
>
> **\*`msisdn`** is optional.  
>
>
> \*The **`deviceId`** is the device unique identifier, preferably FirebaseInstanceId. Please refer to [Work with instance IDs and GUIDs](https://developer.android.com/training/articles/user-data-ids#instance-ids-guids) for more information.
>
>
>

The Voice SDK also requires application information in the setup. Use the following for application data:

```java
val sessionConfiguration = sessionConfiguration {
    applicationId = BuildConfig.APPLICATION_ID
    baseUrl = "VOICE_BASE_URL"
    pushToken = "YOUR_PUSH_TOKEN"
}

```

>
> **Note:** The Voice URL is provided by the console when you request access to the Voice SDK.
>
>
>

Once you have the configurations ready, use them to activate the Voice SDK. For example:

```kotlin
configuration {
    userConfiguration = userConfig
    sessionConfiguration = sessionConfig
}
try {
  voice.activate(configuration)
  saveUserDataToPreference(userConfiguration)
} catch(e: RegistrationException) {
    // Log the error
}

```

Upon activation, the application is ready to make and receive calls.  

To check if the user is registered and activated, use

```kotlin
voice.isActivated()

```

>
> **Note:** Use the result of this function to determine whether or not the user requires activation.
>
>
>

## SDK state

The Voice SDK allows you to get updates about sdk **`state`**. You can collect it using the following `StateFlow` object:

```kotlin
lifecycleScope.launch {
  voice.state.collect { state ->
    // Handle the state
  }
}

```

## Request runtime permissions

The Voice SDK requires access to **`READ_PHONE_STATE`** and **`RECORD_AUDIO`** permissions in order to successfully place and receive calls. Apps targeting API level 31 or above will additionally need **`READ_PHONE_NUMBERS`** permission. If you attempt to place or accept a call without the necessary permissions granted, one of the following exceptions will be delivered in the `VoiceCallResult`: `RTCException.PhoneAndMicPermissionDeniedException`, `RTCException.PhonePermissionDeniedException` or `RTCException.MicPermissionDeniedException`

## Place a call

In order to place a call, the Voice SDK requires the callee contact information. Use the **`VoiceContact`** object from the Voice SDK to create the callee information.

Once the **`contact`** object is ready you can place a call using the following:

```kotlin
when(val voiceCallResult = voice.placeCall(contact)) {
    is VoiceCallResult.Success -> { /* handle the call */ }
    is VoiceCallResult.Failure -> { /* handle the error */ }
}

```

>
> **Note:** When the necessary [Permissions](#request-runtime-permissions) are not provided, placing a call will fail with a `PermissionNotGranted` exception.
>
>
>

## Mid-call features

The Voice SDK provides APIs to interact with an active `VoiceCall`. These actions are:

* `accept()`
* `reject()`
* `endAndAccept()`
* `hangup()`
* `mute()`
* `unmute()`
* `hold()`
* `resume()`

You can also query the state of incoming calls such as `isIncoming`, `isPeerOnHold`, `isMuted`, and `callStartTime`.

The Voice SDK allows a user to have a second incoming call while a call is in progress. Updates are available via `voice.voiceCallState`, which has the type of `SharedFlow\<VoiceCallState\>`. The Voice SDK provides functionality to end the ongoing call and accept an incoming call using the **`endAndAccept`** action. The default **`accept`** behavior is to put the ongoing call on hold and accept the incoming call.

## Call updates

In order to receive call updates use **`voice.voiceCallState`** which delivers a `VoiceCallState` object:

```kotlin
voice.voiceCallState.collect { voiceCallState ->
  when(voiceCallState) {
    is VoiceCallState.Added -> {
        // Call recently added
    }
    is VoiceCallState.Failed -> {
      // Call that failed with an exception.
    }
    is VoiceCallState.HoldUpdated -> {
      // Call that has been moved on hold because of accepting another incoming call.
    }
    is VoiceCallState.Removed -> {
        // Call failed or finished.
    }
    is VoiceCallState.Updated -> {
        // Call that's recently updated.    
    }
  }
    
}

```

## Receive a call

The application needs to receive push notifications via FCM. If you are not using FCM on your project refer to [this Firebase topic](https://firebase.google.com/docs/cloud-messaging/android/client).

The application receives a push notification via the **`FirebaseMessagingService`** object as an indication of an incoming call. Once the application receives the push notification, it needs to check if the notification is for an incoming call. Use:

```kotlin
val isVoiceNotification = voice.isVoiceNotification(data)

```

If the notification is for an incoming call, it is passed along with its context to the Voice SDK. To process an incoming call the Voice SDK starts a [Foreground Service](https://developer.android.com/guide/components/services#Foreground) which requires a notification to be displayed by the application. The notification is displayed for a very short time and may display text such as **Incoming call**. This notification can be replaced by another notification with **Accept** and **Reject** actions as soon as updates are received.

If you wish to present a view as soon as the incoming call is connected, use:

```kotlin
voice.callActions.collect {  callAction ->
  when(callAction) {
    CallAction.PRESENT_INCOMING_CALL -> {
      // Show UI to present the incoming call to the user
    }
    CallAction.MUTE_INCOMING_CALL -> {
      // Call the API to mute the ringing
    }
  }
}

```

>
> **Note:** Start the collection before the `receiveCall` in order to present your notification or view.
>
>
>

Once the notification is ready, use the following:

```kotlin
when(val callResult = voice.receiveCall(data, notification)) {
  is VoiceCallResult.Failure -> {
      // Handle the error
  }
  is VoiceCallResult.Success -> {
      // Handle the success
  }
}

```

## Update contact information

For any active call, you can update the contact information by using the following:

```kotlin
val contact = VoiceContact("CONTACT_ID", "CONTACT_NAME", "CONTACT_AVATAR_URL", "CONTACT_PHONE_NUMBER")
voice.updateContact(call.uuid, contact)

 

```

## Audio control

The Voice SDK allows you to switch your audio output during a call by using the following:

```kotlin
voice.setVoiceAudioOption(audioOption)

```

In order to receive audio updates collect **`callAudioOptionUpdates`** passes on **`VoiceCallAudioOption`**:

```kotlin
lifecycleScope.launch {
  voice.callAudioOptionUpdates.collect { voiceCallAudioOption ->
    // Handle audio option
  }
}

```

The SDK allows you to easily toggle between audio options. It follows the following:  

`VoiceCallAudioOption.EARPIECE` to `VoiceCallAudioOption.SPEAKER`,  

`VoiceCallAudioOption.SPEAKER` to `VoiceCallAudioOption.EARPIECE`,  

`VoiceCallAudioOption.BLUETOOTH` to `VoiceCallAudioOption.EARPIECE`

To toggle between audio options use:

```kotlin
voice.toggleAudioOption()

```

>
> **Note:** **`audioOption`** is of the type **`VoiceCallAudioOption`** which consists of the values of **`BLUETOOTH`**, **`SPEAKER`**, and **`EARPIECE`**.
>
>
>

## Update push notification token and phone number

After registration the push token and phone number that are provided during activation can be reconfigured.

To update the push token, add the following to the class which extends **`FirebaseMessagingService`**:

```kotlin
override fun onNewToken(token: String) {
    super.onNewToken(token)
    ...
    when(val result = voice.updatePushToken(token)) {
        is ResultWrapper.Success -> {/* Handle success */ }
        is ResultWrapper.Error -> { /* Handle error */ }
    }
}

```

To update the phone number, use the following:

```kotlin
when(val result = voice.updatePhoneNumber(phoneNumber)) {
    is ResultWrapper.Success -> {/* Handle success */ }
    is ResultWrapper.Error -> { /* Handle error */ }
}

```

## Unregister and Deactivate Voice User

To deactivate or unregister a user, use the following method:

```kotlin
lifecycleScope.launch {
      voice.deactivate()
}

```

---

## Proguard Rules

If `minifyEnabled` is set to `true` in your application:

* Add the following in your `proguard-rules.pro` file:

```java
#noinspection ShrinkerUnresolvedReference
-keep class com.eght.voice.sdk.** { *; }
-keep class com.eght.sip.** { *; }
-keep class com.eght.call.** { *; }

```

* If the compiler complains about `META-INF/*` file collision after adding the proguard rules, you must add the following to your **app-level** `build.gradle`:

```java
android {

   ...

   packagingOptions {
      pickFirst  '**'
   }
}

```

## Shared Preferences

In order to persist data, it is recommended that the Voice SDK is excluded from [allowBackup](https://developer.android.com/guide/topics/manifest/application-element#allowbackup). If your application needs the attribute `android:allowBackup="true"` in your `AndroidManifest.xml` file, we recommend doing the following:

### Android 11 (API level 30) and lower

* Create an `xml` file under the `xml` resource directory. We'll call it `backup_rules.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
\<full-backup-content\>
    <exclude domain="sharedpref" path="voice-sdk-preferences.xml"/>
    <exclude domain="sharedpref" path="rtcData.xml"/>
</full-backup-content>

```

* Add the following attribute to your `AndroidManifest.xml`:

```xml
\<application
  android:fullBackupContent="@xml/backup_rules"
  ... \>
  ...
</application>

```

### Android 12 (API level 31) and higher

* Create an `xml` file under the `xml` resource directory. We'll call it `data_extraction_rules.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
\<data-extraction-rules\>
  \<cloud-backup\>
    ...
    <exclude domain="sharedpref" path="voice-sdk-preferences.xml"/>
    <exclude domain="sharedpref" path="rtcData.xml"/>
    ...
  </cloud-backup>

  \<device-transfer\>
    ...
    <exclude domain="sharedpref" path="voice-sdk-preferences.xml"/>
    <exclude domain="sharedpref" path="rtcData.xml"/>
    ...
  </device-transfer>
</data-extraction-rules>  

```

* Add the following attribute to your `AndroidManifest.xml`:

```xml
\<application
  android:dataExtractionRules="@xml/data_extraction_rules"
  ... \>
  ...
</application>

```

>
> **Note:** The approaches must be combined for devices that are targeting API 31+ but have the minimum SDK set to a lower value.
>
>
> **Note:** If you have `android:allowBackup="false"`, you do not need to add this file nor add the `fullBackupContent` and/or `dataExtractionRules` attribute(s).
>
>
>
