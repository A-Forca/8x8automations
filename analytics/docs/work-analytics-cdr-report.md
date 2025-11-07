# Call Detail Record and Call Legs

> 🚧 **Updated Endpoints Available**
>
> The [Call Legs](/analytics/docs/work-analytics-call-legs) and [Call Detail Records](/analytics/docs/work-analytics-call-detail-records) are dedicated endpoints to replace the previous [Call Detail Record Legs](/analytics/docs/work-analytics-cdr-report) endpoint which served both purposes
>
>

> 📘
>
> Note: This API provides access to data from the past 2 years only in accordance with Analytics for Work data compliance policies; queries spanning more than 2 years will return only the most recent 2 years of data, and queries outside this range will return no results
>
>

## Call Records and Call Legs Explained

A Call Record is a single record view of the overall call and metrics represented by a single Call ID.

A Call Leg provides detailed metrics on an individual segment of a call within the call journey and is represented by a Call Leg ID combined with a Call ID.

Example: A Call Record would be a single row representation of a call that follows the following path which would have multiple Call Legs to fully represent the journey.

* Inbound to an Auto Attendant
* Transferred to Ring Group
* Simultaneous calls to 5 Ring Group members (Leg per member contacted regardless of outcome)
* Answered by one of the members

[8x8 Work Analytics Historical](/analytics/reference/authentication-1) access is via this multi step process. For any of the endpoints the same process is followed.

> 📘 **You will need a working API key to begin**
>
> You can generate API credentials from [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
> The `8x8-api-key` will be the `Key` generated. For Work Analytics the Secret from Admin Console is not required.
>
>

Use the following base URL during this process:

* `https://api.8x8.com/analytics/work`

## 1. Authenticate to retrieve access token

You will use your API key combined with the user credentials of a user with permission and access to Work Analytics to authenticate, this user **does not need to be** the one who generated the API credentials

> 🚧 **User must access Analytics at least once via browser**
>
> The users credentials will not be able to leverage the API until they have used Work Analytics via browser at least once
>
>

### Parameters

**Method: POST**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| 8x8-apikey | ✓ | The 8x8-api key provided | test_key_kjdfidj238jf9123df221 |
| Content-Type | ✓ | Set content type to form-urlencoded | application/x-www-form-urlencoded |

#### Body

| Name     | Required | Description                                                        | Example                                             |
|----------|----------|--------------------------------------------------------------------|-----------------------------------------------------|
| username | ✓        | The 8x8 username of a user with Work Analytics access privileges   | [someuser@acme.fakeco](mailto:someuser@acme.fakeco) |
| password | ✓        | The 8x8 password of the user with Work Analytics access privileges | Rrnp5QBW6dTbx^TP                                    |

### Authentication Request

```bash
curl --location --request POST 'https://api.8x8.com/analytics/work/v1/oauth/token' \
--header '8x8-apikey: {8x8-apikey input here}' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'username={8x8 username of user input here}' \
--data-urlencode 'password={8x8 password of user input here}'

```

### Authentication Response

**Response**

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiJ9.yyyyyyy.zzzzzzzzzzz",
    "token_type": "bearer",
    "expires_in": 1800
}

```

**Outputs For Next Step:**

* access_token
* expires_in

The token will expire in the number of seconds specified in expires_in.

The following steps will use the access_token as a Bearer Token form of authentication. This takes the form of the  

`Authorization` header being set to `Bearer access_token` (Space between Bearer and the access_token)

## 2. Run Report

### Parameters

**Method:** GET

#### Headers

| Name          | Required | Description                                                                                                 | Example                                         |
|---------------|----------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| 8x8-apikey    | ✓        | The 8x8-api key provided                                                                                    | test_key_kjdfidj238jf9123df221                |
| Authorization | ✓        | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer eyJhbGciOiJSUzI1NiJ9.yyyyyyy.zzzzzzzzzzz |

#### Path

| Name    | Required | Description                       | Example |
|---------|----------|-----------------------------------|---------|
| version | ✓        | The current version for cdr is v1 | v1      |

#### Query

| Name                                                                                        | Required | Description                                                                                                                                                                                                                                                                                                                               | Example             |
|---------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| pbxId                                                                                       | ✓        | Pass the pbxId (PBX Name) of the requested pbx or comma separated list of pbxIds or `allpbxes` for all of the pbxs in the customer account                                                                                                                                                                                                | `acmecorp,acmecorp2` |
| startTime                                                                                   | ✓        | The interval start time for CDR searches - the format is YYYY-MM-DD HH:MM:SS.                                                                                                                                                                                                                                                             | 2022-10-20 08:30:00 |
| endTime                                                                                     | ✓        | The interval end time for CDR searches - the format is YYYY-MM-DD HH:MM:SS.                                                                                                                                                                                                                                                               | 2022-10-20 19:00:00 |
| timeZone                                                                                    | ✓        | [IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/London [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                                                                                                    | America/New_York    |
| pageSize                                                                                    | ✓        | Number of records to return in pages See [Pagination](/analytics/docs/work-analytics-cdr-report#pagination). Must be                                                                                                                                                                                                          | 50                  |
| scrollId                                                                                    | ☐/✓      | Not required for initial page required on subsequent pages. See [Pagination](/analytics/docs/work-analytics-cdr-report#pagination)                                                                                                                                                                                            |                     |
| isCallRecord                                                                                | ☐        | When true return call records (single row per call, when false return call legs). Default is false                                                                                                                                                                                                                                        | false               |
| isConnectTime                                                                               | ☐        | This parameter allows you to get your results based on either connect time or disconnect time of each call leg. It is not compatible with isCallRecord. Default is false. See [isConnectTime explained](/analytics/docs/work-analytics-cdr-report#isconnecttime-explained) for more details.                                              | false               |
| isSimplified                                                                                | ☐        | Only valid for Call Legs (isCallRecord = false).Default is false. When true: Child calls are not returned. For example, child calls are the ones the service makes to one or more agents when a call comes into a call queue or a ring group. Some call legs are omitted. For example, the removal of CallForking and CallRecording legs. | false    |

#### isConnectTime explained

This looks at the timing of call legs and as such is not valid when isCallRecord is `true`

if `false` will use 'disconnected_time' of the call leg to filter data and return the result

if `true` will use the 'connected_time' of the call leg to filter data and return the result

**disconnected_time** is when the **call leg** was disconnected from the system

**connected_time** is when the **call leg** transitioned from alerting to connected.

### Call Records Request

> 📘 **Try out the CDR Records Request**
>
> You can check out [CDR Records Reference](/analytics/reference/call-detail-records) but currently this one can't be tested from the Reference.
>
>

```bash
curl --location --request GET 'https://api.8x8.com/analytics/work/v{version}/cdr?pbxId={pbxId here}&startTime=2022-02-03 00:00:00&endTime=2022-02-03 10:00:00&timeZone=America/New_York&pageSize=50&isCallRecord=true&isSimplified=false&isConnectTime=false' \
--header 'Authorization: Bearer {access_token here}' \
--header '8x8-apikey: {8x8-apikey input here}'

```

### Call Records Response

This sample response is for isCallRecord=true

For details on cdr metrics please refer to[CDR Glossary and Details](https://docs.8x8.com/8x8WebHelp/8x8analytics-virtual-office/Content/VOA/call-detail-record.htm)

```json
{
    "meta": {
        "totalRecordCount": 2,
        "scrollId": "c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODM0NV8xNjQzODk3NDkyODk3"
    },
    "data": [
        {
            "dnis": "12025555720",
            "aaDestination": null,
            "callId": "1635571048351",
            "startTimeUTC": 1643898447493,
            "startTime": "2022-02-03T09:27:27.493-0500",
            "connectTimeUTC": 0,
            "connectTime": "0",
            "disconnectedTimeUTC": 1643898472253,
            "disconnectedTime": "2022-02-03T09:27:52.253-0500",
            "talkTimeMS": 0,
            "talkTime": "00:00:00",
            "caller": "+15555551220",
            "callerName": "MARK SMITH",
            "callee": "120088",
            "calleeName": "Jane Li",
            "direction": "Incoming",
            "callerId": "MARK SMITH,+15555551220",
            "missed": "Missed",
            "abandoned": "-",
            "answered": "-",
            "answeredTime": 0,
            "calleeDisconnectOnHold": "",
            "callerDisconnectOnHold": "",
            "pbxId": "acmecorppbx",
            "sipCallId": "user@example.com",
            "lastLegDisposition": "Voicemail",
            "callLegCount": "1",
            "callTime": 24760,
            "ringDuration": 39,
            "abandonedTime": 0,
            "calleeHoldDurationMS": 0,
            "calleeHoldDuration": "00:00:00",
            "waitTimeMS": 0,
            "waitTime": "00:00:00",
            "departments": [
                "Sales Engineering"
            ],
            "branches": [
                "Central"
            ]
        },
        {
            "dnis": "15554441212",
            "aaDestination": null,
            "callId": "1635571048345",
            "startTimeUTC": 1643897492897,
            "startTime": "2022-02-03T09:11:32.897-0500",
            "connectTimeUTC": 0,
            "connectTime": "0",
            "disconnectedTimeUTC": 1643899189421,
            "disconnectedTime": "2022-02-03T09:39:49.421-0500",
            "talkTimeMS": 0,
            "talkTime": "00:00:00",
            "caller": "+15551234567",
            "callerName": "15551234567",
            "callee": "CallQueue",
            "calleeName": "Test Queue",
            "direction": "Incoming",
            "callerId": "15551234567,+15551234567",
            "missed": "Missed",
            "abandoned": "Abandoned",
            "answered": "-",
            "answeredTime": 0,
            "calleeDisconnectOnHold": "",
            "callerDisconnectOnHold": "",
            "pbxId": "acmecorppbx",
            "sipCallId": "user@example.com",
            "lastLegDisposition": "Missed",
            "callLegCount": "1",
            "callTime": 1696524,
            "ringDuration": 197,
            "abandonedTime": 1696524,
            "calleeHoldDurationMS": 0,
            "calleeHoldDuration": "00:00:00",
            "waitTimeMS": 1696320,
            "waitTime": "00:28:16",
            "departments": [
                "East Office"
            ],
            "branches": [
                "East Coast"
            ]
        }
    ]
}

```

### Call Legs Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/work/v{version}/cdr?pbxId={pbxId here}&startTime=2022-02-03 00:00:00&endTime=2022-02-03 10:00:00&timeZone=America/New_York&pageSize=50&isCallRecord=false&isSimplified=false&isConnectTime=false' \
--header 'Authorization: Bearer {access_token here}' \
--header '8x8-apikey: {8x8-apikey input here}'

```

### Call Legs Response

> 📘 **Try out the CDR Legs Request**
>
> Jump in and try it out in the [CDR Legs Reference](/analytics/reference/call-detail-record-legs)
>
>

This response is for isCallRecord=false

For details on cdr metrics please refer to[CDR Glossary and Details](https://docs.8x8.com/8x8WebHelp/8x8analytics-virtual-office/Content/VOA/call-detail-record.htm)

```json
{
    "meta": {
        "totalRecordCount": 2,
        "scrollId": "c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODM0NV8xXzE2NDM4OTc0OTI5MDM"
    },
    "data": [
        {
            "callId": "1635571048351",
            "legId": "1",
            "startTimeUTC": 1643898447499,
            "startTime": "2022-02-03T09:27:27.499-0500",
            "connectTimeUTC": 1643898447539,
            "connectTime": "2022-02-03T09:27:27.539-0500",
            "disconnectedTimeUTC": 1643898472253,
            "disconnectedTime": "2022-02-03T09:27:52.253-0500",
            "talkTimeMS": 0,
            "talkTime": "00:00:00",
            "caller": "+15555551220",
            "callerName": "MARK SMITH",
            "callee": "120088",
            "calleeName": "Jane Li",
            "lra": "120088",
            "direction": "Incoming",
            "parentCallId": null,
            "transferToCallId": null,
            "dnis": "12025555720",
            "status": "Completed",
            "callerDeviceId": null,
            "calleeDeviceId": null,
            "callerDeviceModel": "",
            "calleeDeviceModel": "",
            "callerId": "MARK SMITH,+15555551220",
            "missed": "Missed",
            "abandoned": "-",
            "answered": "-",
            "cause": "Ring No Answer",
            "callerSvcName": null,
            "callerSvcType": null,
            "calleeSvcName": "VMadvanced",
            "calleeSvcType": "Custom",
            "lraType": 1,
            "calleeHoldDurationMS": 0,
            "calleeHoldDuration": "00:00:00",
            "calleeDisconnectOnHold": "",
            "callerDisconnectOnHold": "",
            "pbxId": "acmecorppbx",
            "sipCallId": "user@example.com",
            "departments": [
                "Sales Engineering"
            ],
            "branches": [
                "Central"
            ],
            "recordServiceOn": "",
            "bargeServiceOn": "",
            "masterSlaveExts": "",
            "propsLastPartyDisp": "Voicemail",
            "accountCode": "",
            "aaPath": "",
            "callTime": 24754
        },
        {
            "callId": "1635571048345",
            "legId": "1",
            "startTimeUTC": 1643897492903,
            "startTime": "2022-02-03T09:11:32.903-0500",
            "connectTimeUTC": 1643897493100,
            "connectTime": "2022-02-03T09:11:33.100-0500",
            "disconnectedTimeUTC": 1643899189420,
            "disconnectedTime": "2022-02-03T09:39:49.420-0500",
            "talkTimeMS": 0,
            "talkTime": "00:00:00",
            "caller": "+15551234567",
            "callerName": "15551234567",
            "callee": "CallQueue",
            "calleeName": "Test Queue",
            "lra": "110081",
            "direction": "Incoming",
            "parentCallId": null,
            "transferToCallId": null,
            "dnis": "15554441212",
            "status": "Completed",
            "callerDeviceId": null,
            "calleeDeviceId": null,
            "callerDeviceModel": "",
            "calleeDeviceModel": "",
            "callerId": "14164666541,+14164666541",
            "missed": "Missed",
            "abandoned": "Abandoned",
            "answered": "-",
            "cause": "Normal",
            "callerSvcName": null,
            "callerSvcType": null,
            "calleeSvcName": "ACDOperatorService",
            "calleeSvcType": "Custom",
            "lraType": 4,
            "calleeHoldDurationMS": 0,
            "calleeHoldDuration": "00:00:00",
            "calleeDisconnectOnHold": "",
            "callerDisconnectOnHold": "",
            "pbxId": "acmecorppbx",
            "sipCallId": "user@example.com",
            "departments": [
                "East Office"
            ],
            "branches": [
                "East Coast"
            ],
            "recordServiceOn": "",
            "bargeServiceOn": "",
            "masterSlaveExts": "",
            "propsLastPartyDisp": "Missed",
            "accountCode": "",
            "aaPath": "",
            "callTime": 1696517
        }
    ]
}

```

> 👍 **Follow the pagination steps below to retrieve subsequent pages.**
>
>

#### Pagination

Within Work Analytics Only the /cdr endpoint is subject to pagination.  

This is controlled by `pageSize` and `scrollId`

* `pageSize` is the number of records to return per page and is required for /cdr
* `scrollId`  is returned from /cdr requests providing an id for the next page of results.

**Pagination Example**  

Assuming there will be 81 records in total. With an initial input of `pageSize=50` the returned meta data will be as follows.  

Note: data has been truncated to an empty array to limit the size of the example text

```json
{
    
    "meta": {
        "totalRecordCount": 81,
        "scrollId": "c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODQ4Nl8xXzE2NDM5MTIzNTI0NDE"
    },
    "data": [
    ]
}

```

The request for the next page would include scrollId set as the value returned in the previous request `pageKey=50&scrollId=c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODQ4Nl8xXzE2NDM5MTIzNTI0NDE`

The new result set would look as follows. The returned result set would only have 31 elements.

```json
{
    "meta": {
        "totalRecordCount": 81,
        "scrollId": "c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODM0NV8xXzE2NDM4OTc0OTI5MDM"
    },
    "data": [
    ]
}

```

The request for the next page would be `pageKey=50&scrollId=c3VwZXJ0ZW5hbnRjc21fMTYzNTU3MTA0ODM0NV8xXzE2NDM4OTc0OTI5MDM` the scrollId has been set to the value returned in the previous request

```json
{
    "meta": {
        "totalRecordCount": 0,
        "scrollId": "No Data"
    },
    "data": []
}

```
