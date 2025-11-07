# CC Managing Campaign Records

## TODO

> 📘 **Prerequisites**
>
> * The Campaign MUST be configured as a Dynamic Campaign
> * Records MUST exist in the CC CRM to be added to a campaign.
>

## Overview

The 8x8 Contact Center Dynamic Campaigns API can be used to accomplish one or more of the following.

* Adds and removes records from an active campaign
* Sends records to a specified campaign via the API
* Adds records to a live campaign
* Removes records from a campaign so they are not dialed again
* Schedules a call with a possible **maximum of 7 days in advance**
* Uploads for a **maximum of 5 million records**

## Authentication

CC Campaign APIs leverage the credentials from the Integration >> API Token area in Configuration Manager.  

These APIs use Basic Authentication.  

The username will be the "Username" value from this screen, it is generally the tenant name  

The Data Request Token will the password  

`Authorization :Basic encodedValue`  

Where encodedValue is base64encode(username:password)

![CC Request Action Token](../images/a542cf0-CC-Request-Action-Token.png "CC-Request-Action-Token.png")

## Working with Campaign Records

## Add Records to Campaign

### Parameters

**Method: POST**

#### Headers

| Name          | Required | Description                                                                                                                                                                          | Example                                    |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of **Action Request Token**. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |
| Content-Type  | ✓        | Set content type for body to application/json                                                                                                                                        | application/json                           |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                              | Example |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager.<br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12    |
| campaignId | ✓        | The id of the campaign to get the status for. Can be located in CC Configuration Manager "Campaigns" and adding the "Campaign ID" column, or within a specific campaign as part of "Properties", "General Properties"                                                    | 125     |

#### Body

Body is an unnamed array of customer records. See [Add Campaign Record Request](/actions-events/docs/cc-managing-campaign-records#add-campaign-record-request) for a full example.

Customer Record:

| Name               | Required | Description                                                                                                                           | Example                    |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| customer-id        | ✓        | customer-id is the ACCOUNTNUM of the customer from the CC CRM. <br /> This can be found in the Agent Workspace OR via the CC CRM API. | 10003629                   |
| schedule-date-time | ☐        | Optional, scheduled/desired time for call which will influence the time the record is processed. ISO8601 datetime format.             | "2022-08-29T09:00:00.000Z" |

### Add Campaign Record Request

```bash
curl --location --request POST 'https://vcc-{ccPlatform}.8x8.com/api/tstats/campaigns/{campaignId}/customers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic {encodedValue}'
--data-raw '[
  {
    "customer-id": 10003629,  "schedule-date-time": "2022-07-14T09:00:00.000Z"  
  },
  {
    "customer-id": 10003621,  "schedule-date-time": "2022-07-14T09:00:00.000Z"  
  }
]'

```

### Add Campaign Record Response (showing additional responses)

Response is HTTP 207 Multi-Status response. Each Customer has it's own status represented.

```json
[
  {
    "customer-id": 10003629,
    "schedule-date-time": "2016-08-29T09:00:00.000Z",
    "http-status": 200
  },
  {
    "customer-id": 1000001,
    "http-status": 200
  },
  {
    "customer-id": 10003621,
    "http-status": 400,
    "message": "Duplicate customer"
  },
  {
    "customer-id": 1000777,
    "schedule-date-time": "2016-08-29T     09:00:00.000Z",
    "http-status": 400,
    "message": "Invalid schedule-date-time format - please use ISO 8601 format"
  },
  {
    "customer-id": null,
    "http-status": 400,
    "message": "Invalid customer-id"
  },
  {
    "customer-id": 9,
    "http-status": 404,
    "message": "The customer-id has not been found."
  },
  {
    "customer-id": 10000,
    "schedule-date-time": "2016-08-29T09:00:00.000Z",
    "http-status": 400,
    "message": "The subject schedule-date-time is in the past."
  },
  {
    "customer-id": 1000778,
    "schedule-date-time": "2016-08-29T09:00:00.000Z",
    "http-status": 400,
    "message": "The subject schedule-date-time is outside the campaign schedule from 2016-08-27T09:00:00.000Z to 2016-08-28T09:00:00.000Z."
  },
  {
    "customer-id": 100002,
    "schedule-date-time": "2016-08-29T09:00:00.000Z",
    "http-status": 400,
    "message": "The subject schedule-date-time must be within 7 days ahead of a future period."
  }
]

```

## View Records in Campaign

### Parameters

**Method: GET**

#### Headers

| Name          | Required | Description                                                                                                                                                                        | Example                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of **Data Request Token**. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                               | Example |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12    |
| campaignId | ✓        | The id of the campaign to get the status for. Can be located in CC Configuration Manager "Campaigns" and adding the "Campaign ID" column, or within a specific campaign as part of "Properties", "General Properties"                                                     | 125     |

### View Campaign Records Request

```bash
curl --location --request GET 'https://vcc-{ccPlatform}.8x8.com/api/stats/campaigns/{campaignId}/records.json' \
--header 'Authorization: Basic {encodedValue}'

```

### View Campaign Record Response

The success response code is HTTP 200. Each Record will have its own status and information.

```json
{
  "records": {
    "record": [
      {
        "campaign-name": "BOC Admin Demo",
        "campaign-id": 1,
        "record-id": 10000000,
        "phone-list": "*Phone Number|5551234567",
        "status": 3,
        "status-code": 0,
        "ext-trans-data": "",
        "disposition-code": 1002
      },
      {
        "campaign-name": "BOC Admin Demo",
        "campaign-id": 1,
        "record-id": 10000001,
        "phone-list": "*Phone Number|5557654321",
        "status": 3,
        "status-code": 0,
        "ext-trans-data": "",
        "disposition-code": 1002
      }
    ]
  }
}

```

**There are several predefined values**

**Record status:**

0 = New  

1 = Queued  

2 = Accepted  

3 = Completed  

4 = Scheduled

**Status code:**

0 = Default  

1 = Max Attempt Reached  

2 = Skipped  

3 = No Phone Number  

4 = Invalid Phone Number

**Disposition code:**

1000 = None  

1001 = Try Again  

1002 = Scheduled Call Back

## Delete Record from Campaign

### Parameters

**Method: DELETE**

#### Headers

| Name          | Required | Description                                                                                                                                                                        | Example                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of **Data Request Token**. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                               | Example  |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12     |
| campaignId | ✓        | The id of the campaign to get the status for. Can be located in CC Configuration Manager "Campaigns" and adding the "Campaign ID" column, or within a specific campaign as part of "Properties", "General Properties"                                                     | 125      |
| customerId | ✓        | customer-id is the ACCOUNTNUM of the customer from the CC CRM. <br /> This can be found in the Agent Workspace OR via the CC CRM API.                                                                                                                                     | 10003629 |

### Delete Campaign Record Request

```bash
curl --location --request DELETE 'https://vcc-{ccPlatform}.8x8.com/api/tstats/campaigns/{campaignId}/customers/{customerId}' \
--header 'Authorization: Basic {encodedValue}'

```

### Delete Campaign Record Response

The success response code is HTTP 204 (No Content)
