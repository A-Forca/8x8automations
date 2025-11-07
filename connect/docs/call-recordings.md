# Call Recordings

Before you enable Call Recordings for Number Masking sessions it is required to set up the ["Recordings Push Configuration"](/connect/reference/create-a-new-recording-push-config) in order to define the endpoint to where the call recordings will be sent to. To set up the "Recordings Push Configuration" a POST request has to be sent to the following endpoint:

```text
POST https://voice.wavecell.com/api/v1/subaccounts/{{subAccountId}}/recording-push-config

```

Where subAccountId is the id of your 8x8 subaccount. The following is an example of the request body you would need:

```json
{
    "protocol": "S3",
    "host": "ap-southeast-2",
    "port": 13,
    "username": "myusername",
    "password": "mypassword",
    "path": "/my-recordings-path/"
}

```

The request should contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| protocol | String | 8x8 supports two protocols to send the Call Recordings. AWS "S3" and SFTP. |
| host | String | IP of the endpoint where the Call Recordings will be sent to. For SFTP use the public IP of your SFTP server. For "S3" you can use the AWS region where your S3 is hosted (i.e. ap-southeast-2). |
| port | Integer | IP port for your endpoint |
| username | String | The username for your endpoint where the Call Recordings will be sent to. |
| password | String | The corresponding password for your Call Recordings endpoint. |
| path | String | The remote directory to which you want the Call Recordings to be stored in. |

Once the request has been processed, you will receive the following response, that will include all the details you have set for your "Recordings Push Configuration":

```json
{
    "subAccountId": "yourSubAccountId",
    "protocol": "SFTP",
    "host": "172.30.2.61",
    "port": 22,
    "username": "myusername",
    "passwordSet": true,
    "path": "/my-recordings-path/",
    "statusCode": 0,
    "statusMessage": "ok"
}

```

## Get Recordings information

You can request the recording information for individual Number Masking sessions by sending a GET request to the following endpoint:

```text
GET https://voice.wavecell.com/api/v1/subaccounts/{{subAccountId}}/recordings/{{sessionId}}

```

Where `subAccountId` is the id of your 8x8 subaccount and the `sessionId` is the Id of the Number Masking session that you want the recording information for. The following is an example of the request body you would need:

```json
{
    "recordings": [
        {
            "recordingId": "eef54fc2-065a-11ec-bce9-ed1000154345",
            "sessionId": "e35e3d0e-065a-11ec-b119-676cb2bc33ef",
            "subAccountId": "yourSubAccountId",
            "status": "CALLBACK_COMPLETED",
            "externalFileUrl": "https://yourRecordingsEndpoint.com/e35e3d0e-065a-11ec-b119-676cb2bc33ef/eef54fc2-065a-11ec-bce9-ed1000154345_2021-08-26T10%3A46%3A56.535Z.mp3",
            "startRecordingTime": "1969-12-31T23:59:59.999Z"
        }
    ],
    "statusCode": 0,
    "statusMessage": "ok"
}

```

The response will contain the following parameters:

| Name | Type | Description |
| --- | --- | --- |
| recordingId | String | Unique Id for the requested Call Recording. |
| sessionId | String | Unique Id that represents the requested Number masking session [UUID]. |
| subAccountId | String | Unique ID of your subaccount. |
| status | String | Status of the requested call recording. Values can be:<br>- PROCESSING ("Processing")<br>- PROCESSING\_FAILED ("Processing failed"),<br>- UPLOAD\_COMPLETED ("Recording upload completed")<br>- UPLOAD\_FAILED ("Recording upload failed"),<br>- CALLBACK\_COMPLETED ("Recording callback completed"),<br>- CALLBACK\_FAILED ("Recording callback Failed")<br>- UNKNOWN ("Unknown Error") |
| externalFileUrl | String | The location where the call recording has been stored. |
| startRecordingTime | Date&Time | Timestamp when the call recording has been started. |

## Voice Recording Uploaded Event

An event is triggered each time a recording has been successfully uploaded to your file server (S3 or SFTP). This is an optional callback and it needs to be enabled on the account level. If you want to set up the callback endpoint, please take a look at [Create a new webhook](/connect/reference/create-a-new-webhook) and the webhook type "VRU".

The following is an example of the callback that you would receive on your "VRU" callback endpoint:

```json
{
  "namespace": "VOICE",
  "eventType": "CALL_RECORDING_STATUS",
  "description": "Call recording status updated",
  "payload": {
    "sessionId": "e35e3d0e-065a-11ec-b119-676cb2bc33ef",
    "recordingId": "eef54fc2-065a-11ec-bce9-ed1000154345",
    "durationSeconds": 25,
    "filePath": "yourRecordingsEndpoint/2021-08-21/e35e3d0e-065a-11ec-b119-676cb2bc33ef/eef54fc2-065a-11ec-bce9-ed1000154345_2021-08-20T16:51:01.703Z.mp3",
    "status": "UPLOAD_COMPLETED"
  }
}

```
