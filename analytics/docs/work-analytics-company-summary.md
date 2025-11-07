# Company Summary

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
    "access_token": "eyJhbGciOiJSUzI1NiJ9.yyyyyyyy.zzzzzzzzzz",
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
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer eyJhbGciOiJSUzI1NiJ9.yyyyyyyy.zzzzzzzzzz |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| version | ✓ | The current version for company summary is v1 | v1 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| pbxId | ✓ | Pass the pbxId (PBX Name) of the requested pbx or comma separated list of pbxIds or `allpbxes` for all of the pbxs in the customer account. PBX names can be found [here in Admin Console](https://admin.8x8.com/company/pbx) | acmecorp,acmecorp2 |
| startTime | ✓ | The interval start time for CDR searches - the format is YYYY-MM-DD HH:MM:SS. | 2022-10-20 08:30:00 |
| endTime | ✓ | The interval end time for CDR searches - the format is YYYY-MM-DD HH:MM:SS. | 2022-10-20 19:00:00 |
| timeZone | ✓ | [IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/London [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) | America/New_York |

### Company Summary Request

> 📘 **Try out the Company Summary**
>
> You can try the company summary API from the [reference](/analytics/reference/company-summary)
>
>

```bash
curl --location --request GET 'https://api.8x8.com/analytics/work/v{version}/compsum?pbxId={pbxId here}&startTime=2022-02-03 00:00:00&endTime=2022-02-03 10:00:00&timeZone=America/New_York' \
--header 'Authorization: Bearer {access_token here}' \
--header '8x8-apikey: {8x8-apikey input here}'

```

### Company Summary Response

For details on the company summary metrics please refer to [Company Summary Glossary](https://docs.8x8.com/8x8WebHelp/8x8analytics-virtual-office/Content/VOA/company-summary-beta.htm#Glossary)

> 📘 **Durations are in milliseconds**
>
>

```json
[
    {
        "pbxId": "acmecorp",
        "inboundTotal": 2252,
        "outboundTotal": 750,
        "externalInboundTotal": 0,
        "externalInboundAnswered": 0,
        "externalInboundAbandoned": 0,
        "percentExternalInboundAnswered": 0,
        "externalInboundMissed": 0,
        "externalOutboundTotal": 0,
        "externalOutboundAnswered": 0,
        "percentExternalOutboundAnswered": 0,
        "externalOutboundAbandoned": 0,
        "externalOutboundMissed": 0,
        "internalInboundTotal": 0,
        "internalInboundAnswered": 0,
        "internalInboundAbandoned": 0,
        "internalInboundMissed": 0,
        "internalOutboundTotal": 0,
        "internalOutboundAnswered": 0,
        "internalOutboundAbandoned": 0,
        "inboundAnswered": 987,
        "inboundAbandoned": 592,
        "inboundMissed": 1265,
        "outboundAnswered": 664,
        "outboundAbandoned": 86,
        "totalAnswered": 1754,
        "totalAbandoned": 732,
        "totalMissed": 1411,
        "totalRingTime": 12281452,
        "totalTalkTime": 573966607,
        "totalCall": 3215,
        "totalAbandonedTime": 125067986,
        "totalCallTime": 735627139,
        "avgRingTime": 6974,
        "avgTalkTime": 327232,
        "avgCallTime": 228810,
        "avgAbandonedTime": 179437,
        "totalVm": 688,
        "totalExtToExtAbandoned": 54,
        "totalExtToExtAnswered": 103,
        "totalExtToExt": 213,
        "totalExtToExtMissed": 60
    },
    {
        "pbxId": "acmecorp2",
        "inboundTotal": 0,
        "outboundTotal": 1,
        "externalInboundTotal": 0,
        "externalInboundAnswered": 0,
        "externalInboundAbandoned": 0,
        "percentExternalInboundAnswered": 0,
        "externalInboundMissed": 0,
        "externalOutboundTotal": 0,
        "externalOutboundAnswered": 0,
        "percentExternalOutboundAnswered": 0,
        "externalOutboundAbandoned": 0,
        "externalOutboundMissed": 0,
        "internalInboundTotal": 0,
        "internalInboundAnswered": 0,
        "internalInboundAbandoned": 0,
        "internalInboundMissed": 0,
        "internalOutboundTotal": 0,
        "internalOutboundAnswered": 0,
        "internalOutboundAbandoned": 0,
        "inboundAnswered": 0,
        "inboundAbandoned": 0,
        "inboundMissed": 0,
        "outboundAnswered": 1,
        "outboundAbandoned": 0,
        "totalAnswered": 1,
        "totalAbandoned": 0,
        "totalMissed": 0,
        "totalRingTime": 5158,
        "totalTalkTime": 2248,
        "totalCall": 1,
        "totalAbandonedTime": 0,
        "totalCallTime": 7429,
        "avgRingTime": 5158,
        "avgTalkTime": 2248,
        "avgCallTime": 7429,
        "avgAbandonedTime": 0,
        "totalVm": 0,
        "totalExtToExtAbandoned": 0,
        "totalExtToExtAnswered": 0,
        "totalExtToExt": 0,
        "totalExtToExtMissed": 0
    }
]

```
