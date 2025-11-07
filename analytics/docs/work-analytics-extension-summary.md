# Extension Summary

[8x8 Work Analytics Historical](/analytics/reference/authentication-1) access is via this multi step process. For any of the endpoints the same process is followed.

> 📘 **You will need a working API key to begin**
>
> You can generate API credentials from [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
> The `8x8-api-key` will be the `Key` generated. For Work Analytics the Secret from Admin Console is not required.
>
>

> 📘
>
> Note: This API provides access to data from the past 2 years only in accordance with Analytics for Work data compliance policies; queries spanning more than 2 years will return only the most recent 2 years of data, and queries outside this range will return no results
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

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| username | ✓ | The 8x8 username of a user with Work Analytics access privileges | [someuser@acme.fakeco](mailto:someuser@acme.fakeco) |
| password | ✓ | The 8x8 password of the user with Work Analytics access privileges | Rrnp5QBW6dTbx^TP |

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
    "access_token": "eyJhbGciOiJSUzI1NiJ9.yyyyyyyyyyy.zzzzzzzzzzzz",
    "token_type": "bearer",
    "expires_in": 1800

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

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| 8x8-apikey | ✓ | The 8x8-api key provided | test_key_kjdfidj238jf9123df221 |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer eyJhbGciOiJSUzI1NiJ9.yyyyyyyyyyy.zzzzzzzzzzzz |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| version | ✓ | The current version for extension summary is v2 | v2 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| pbxId | ✓ | Pass the pbxId (PBX Name) of the requested pbx or comma separated list of pbxIds or `allpbxes` for all of the pbxs in the customer account. PBX names can be found [here in Admin Console](https://admin.8x8.com/company/pbx) | acmecorp,acmecorp2 |
| startTime | ✓ | The interval start time for CDR searches - the format is YYYY-MM-DD HH:MM:SS. | 2022-10-20 08:30:00 |
| endTime | ✓ | The interval end time for CDR searches - the format is YYYY-MM-DD HH:MM:SS. | 2022-10-20 19:00:00 |
| timeZone | ✓ | [IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/London [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) | America/New_York |

### Extension Summary Request

> 📘 **Try out the Extension Summary**
>
> Try it out @ [Extension Summary Reference](/analytics/reference/extension-summary-v2) and see who's made more calls.
>
>

```bash
curl --location --request GET 'https://api.8x8.com/analytics/work/v{version}/extsum?pbxId={pbxId here}&startTime=2022-02-03 00:00:00&endTime=2022-02-03 10:00:00&timeZone=America/New_York' \
--header 'Authorization: Bearer {access_token here}' \
--header '8x8-apikey: {8x8-apikey input here}'

```

### Extension Summary Response

For details on the company summary metrics please refer to [Extension Summary Glossary](https://docs.8x8.com/8x8WebHelp/8x8analytics-virtual-office/Content/VOA/extensions-summary-beta.htm#Glossary)

> 📘 **Durations are in milliseconds**
>
>

```json
[
    {
        "PbxId": "acmecorp",
        "Extension": "8885",
        "ServiceType": "UE",
        "FirstName": "Alice",
        "LastName": "Smith",
        "Branch": "East Coast",
        "Department": "Marketing",
        "External_Inbound_Total": 1,
        "External_Inbound_Answered": 0,
        "External_Inbound_Abandoned": 1,
        "Percent_External_Inbound_Answered": 0,
        "External_Inbound_Missed": 1,
        "External_Outbound_Total": 0,
        "External_Outbound_Answered": 0,
        "Percent_External_Outbound_Answered": 0,
        "External_Outbound_Abandoned": 0,
        "Internal_Inbound_Total": 0,
        "Internal_Inbound_Answered": 0,
        "Internal_Inbound_Abandoned": 0,
        "Internal_Inbound_Missed": 0,
        "Internal_Outbound_Total": 0,
        "Internal_Outbound_Answered": 0,
        "Internal_Outbound_Abandoned": 0,
        "Inbound_Total": 1,
        "Inbound_Answered": 0,
        "Inbound_Abandoned": 1,
        "Inbound_Missed": 1,
        "Total_Calls_To_VM": 0,
        "Outbound_Total": 0,
        "Outbound_Answered": 0,
        "Outbound_Abandoned": 0,
        "Total_Answered": 0,
        "Total_Abandoned": 1,
        "Total_Missed": 1,
        "Total_Ring_Time": 1195,
        "Total_Talk_Time": 0,
        "Total_Abandoned_Time": 0,
        "Total_Call_Time": 19048,
        "Avg_Ring_Time": 1195,
        "Avg_Talk_Time": 0,
        "Inbound_Talk_Time": 0,
        "Outbound_Talk_Time": 0,
        "Avg_Abandoned_Time": 0,
        "Email": "alice.smith",
        "UserName": "user@example.com"
    },
    {
        "PbxId": "acmecorp2",
        "Extension": "441001",
        "ServiceType": "UE",
        "FirstName": "Li",
        "LastName": "Chan",
        "Branch": "Remote",
        "Department": "HR",
        "External_Inbound_Total": 1,
        "External_Inbound_Answered": 1,
        "External_Inbound_Abandoned": 0,
        "Percent_External_Inbound_Answered": 100,
        "External_Inbound_Missed": 0,
        "External_Outbound_Total": 0,
        "External_Outbound_Answered": 0,
        "Percent_External_Outbound_Answered": 0,
        "External_Outbound_Abandoned": 0,
        "Internal_Inbound_Total": 0,
        "Internal_Inbound_Answered": 0,
        "Internal_Inbound_Abandoned": 0,
        "Internal_Inbound_Missed": 0,
        "Internal_Outbound_Total": 0,
        "Internal_Outbound_Answered": 0,
        "Internal_Outbound_Abandoned": 0,
        "Inbound_Total": 1,
        "Inbound_Answered": 1,
        "Inbound_Abandoned": 0,
        "Inbound_Missed": 0,
        "Total_Calls_To_VM": 0,
        "Outbound_Total": 0,
        "Outbound_Answered": 0,
        "Outbound_Abandoned": 0,
        "Total_Answered": 1,
        "Total_Abandoned": 0,
        "Total_Missed": 0,
        "Total_Ring_Time": 5160,
        "Total_Talk_Time": 2248,
        "Total_Abandoned_Time": 0,
        "Total_Call_Time": 7408,
        "Avg_Ring_Time": 5160,
        "Avg_Talk_Time": 2248,
        "Inbound_Talk_Time": 0,
        "Outbound_Talk_Time": 0,
        "Avg_Abandoned_Time": 0,
        "Email": "user@example.com",
        "UserName": "li.chan"
    }
]

```

Fields not defined in glossary

| Name     | Description                                                  |
|----------|--------------------------------------------------------------|
| UserName | 8x8 username of the user, or "N/A" for non users             |
| Email    | Configured email address of the user, or "N/A" for non users |
