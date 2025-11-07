# CC Historical Analytics Detailed Report

## Approach for JSON vs XLSX/CSV

The common `historical-metrics` endpoint has a limitation where the JSON `/data` response is limited to 10,000 records. The XLSX/CSV download available at `historical-metrics/detailed-report` does not have this limitation.

To overcome this limitation the `historical-metrics/detailed-report` endpoint is available to allow for consumers to access JSON format data for large result sets expected with detailed reports.

> ❗️ **Requirement: for CSV/XLSX content**
>
> Leverage the `historical-metrics` endpoint. CSV/XLSX is not available via `historical-metrics/detailed-report`
>
>

> ❗️**Strong Recommendation: for JSON content**
>
> Leverage the `historical-metrics/detailed-report` endpoint and the result set won't be limited to 10,000 records.
>
> This guarantees a full result set regardless of the size of the response.
>
>

> 📘 **You will need a working API key to begin**
>
> [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
>

The base URL is region specific, based on the location of your Contact Center tenant.

* United States: `https://api.8x8.com/analytics/cc/{version}/historical-metrics/`
* Europe: `https://api.8x8.com/eu/analytics/cc/{version}/historical-metrics/`
* Asia-Pacific: `https://api.8x8.com/au/analytics/cc/{version}/historical-metrics/`
* Canada: `https://api.8x8.com/ca/analytics/cc/{version}/historical-metrics/`
* {version} to be replaced by current Version. As of August 2025 this is 8 resulting in /v8/

## 1. Authenticate to retrieve access token

[OAuth Authentication for 8x8 XCaaS APIs](/analytics/docs/oauth-authentication-for-8x8-xcaas-apis) is used to get a temporary `access_token` for use in with this API

**Outputs For Next Step:**

* access_token
* expires_in

The following steps will use the access_token as a Bearer Token form of authentication. This takes the form of the  

`Authorization` header being set to `Bearer access_token` (Space between Bearer and the access_token)

## 2 Multitenancy support

If the API is used for a multitenant customer the requests should contain *"X-Tenant-Info"* header variable where needs to specify the desired tenantId. The "X-Tenant-Info" header is not mandatory in case of a single tenant customer.

The following error messages could be returned when dealing with a multitenant customer:

* if for a multitenant customer request the *"X-Tenant-Info"* header is not provided the HTTP 400 code along with *"Bad request: X-Tenant-Info header is missing."* message will be returned
* if a wrong tenantId is provided the HTTP 400 code along with *"Bad request: Invalid value for X-Tenant-Info header."* message will be returned

## 3. Get Available Report Types

CC Historical Analytics allows the consumer to get a listing of the available reports including information about their options and available data.

> 📘 **Available Detailed Reports**
>
> Currently `detailed-reports-interaction-details` and `detailed-reports-agent-status-change` are the available detailed interaction reports. For detailed Post-call survey reports, see the [Post Call Survey](/analytics/docs/customer-experience-post-call-survey) section.
>
>

Additional information about each of the reports and detailed definitions of metrics can be found in the [Interaction Details report - Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/detailed-interaction-report.htm#Interaction-details-report-glossary) and [Agent Status Change Detail](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/agent-status-change-details.htm)

### Parameters

**Method: GET**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| version | ✓ | The current version is `v8` | v8 |
| report-type | ☐ | Specific report type to get information on. Omit this parameter to get all report types. | agent-status-by-status-code |

[API reference](/analytics/reference/cc-historical-analytics-report-types)

### Report Types Request

The response shows each `report-type` that's available.

all report typessingle report type

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/report-types' \
     --header 'Authorization: Bearer {access_token}'

```

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/report-types/detailed-reports-interaction-details' \
     --header 'Authorization: Bearer {access_token}' 

```

### Report Types Response

The response shows each `report-type` that's available.

**Outputs For Next Step:**  

For detailed reports the response has a number of elements to guide the usage:

* `type` each report type has a unique definition
* `metrics` these are the available metrics for the report type. When creating a report. See the [Interaction Details report - Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/detailed-interaction-report.htm#Interaction-details-report-glossary) and [Agent Status Change Detail](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/agent-status-change-details.htm) for additional detail on the definition of the available metrics
  * if no metrics are specified: All metrics will be returned
  * if metrics are specified: ONLY the specified metrics will be returned
* `searchQuery` Provides information on the searchable fields and the operators for those searches. See [searchQuery](/analytics/docs/cc-historical-analytics-detailed-report#searchquery) below for more detailed description.
  * `fields` field name of searchable field
  * `operators` list of valid operators

Generic Example:

```json
    [
        {
            "type": "report type name",
            "metrics": [
                "report metric 1",
                "report metric 2"
            ],
            "searchQuery": {
                "fields": [
                    "searchable field 1",
                    "searchable field 2"
                ],
                "operators": [
                    "=",
                    "!=",
                    ">",
                    ">=",
                    "<=",
                    "<",
                    "contains",
                    "not-in",
                    "in",
                    "is-empty",
                    "is-not-empty"
                ]
            }
        }
    ]

```

**Sample Response for single report type**

```json
{
    "type": "detailed-reports-interaction-details",
    "metrics": [
        "agentNotes",
        "blindTransferToAgent",
        "blindTransferToQueue",
        "campaignId",
        "campaignName",
        "caseFollowUp",
        "caseNumber",
        "channelId",
        "conferencesEstablished",
        "consultationsEstablished",
        "creationTime",
        "customerName",
        "destination",
        "direction",
        "dispositionAction",
        "externalTransactionData",
        "finishedTime",
        "interactionId",
        "interactionLabels",
        "interactionType",
        "ivrTreatmentDuration",
        "mediaType",
        "originalInteractionId",
        "originalTransactionId",
        "origination",
        "outboundPhoneCode",
        "outboundPhoneCodeId",
        "outboundPhoneCodeList",
        "outboundPhoneCodeListId",
        "outboundPhoneCodeText",
        "outboundPhoneShortCode",
        "participantAssignNumber",
        "participantBusyDuration",
        "participantHandlingDuration",
        "participantHandlingEndTime",
        "participantHold",
        "participantHoldDuration",
        "participantId",
        "participantLongestHoldDuration",
        "participantName",
        "participantOfferAction",
        "participantOfferActionTime",
        "participantOfferDuration",
        "participantOfferTime",
        "participantProcessingDuration",
        "participantType",
        "participantWrapUpDuration",
        "participantWrapUpEndTime",
        "queueId",
        "queueName",
        "queueTime",
        "queueWaitDuration",
        "recordId",
        "time",
        "transactionId",
        "warmTransfersCompleted",
        "wrapUpCode",
        "wrapUpCodeId",
        "wrapUpCodeList",
        "wrapUpCodeListId",
        "wrapUpCodeText",
        "wrapUpShortCode"
    ],
    "searchQuery": {
        "fields": [
            "agentNotes",
            "blindTransferToAgent",
            "blindTransferToQueue",
            "campaignId",
            "campaignName",
            "caseFollowUp",
            "caseNumber",
            "channelId",
            "conferencesEstablished",
            "consultationsEstablished",
            "creationTime",
            "customerName",
            "destination",
            "direction",
            "dispositionAction",
            "externalTransactionData",
            "finishedTime",
            "interactionId",
            "interactionLabels",
            "interactionType",
            "ivrTreatmentDuration",
            "mediaType",
            "originalInteractionId",
            "originalTransactionId",
            "origination",
            "outboundPhoneCode",
            "outboundPhoneCodeId",
            "outboundPhoneCodeList",
            "outboundPhoneCodeListId",
            "outboundPhoneCodeText",
            "outboundPhoneShortCode",
            "participantAssignNumber",
            "participantBusyDuration",
            "participantHandlingDuration",
            "participantHandlingEndTime",
            "participantHold",
            "participantHoldDuration",
            "participantId",
            "participantLongestHoldDuration",
            "participantName",
            "participantOfferAction",
            "participantOfferActionTime",
            "participantOfferDuration",
            "participantOfferTime",
            "participantProcessingDuration",
            "participantType",
            "participantWrapUpDuration",
            "participantWrapUpEndTime",
            "queueId",
            "queueName",
            "queueTime",
            "queueWaitDuration",
            "recordId",
            "time",
            "transactionId",
            "warmTransfersCompleted",
            "wrapUpCode",
            "wrapUpCodeId",
            "wrapUpCodeList",
            "wrapUpCodeListId",
            "wrapUpCodeText",
            "wrapUpShortCode"
        ],
        "operators": [
            "=",
            "!=",
            ">",
            ">=",
            "<=",
            "<",
            "contains",
            "not-in",
            "in",
            "is-empty",
            "is-not-empty"
        ]
    }
}

```

## 4. Creating a report

> 📘 **This sample is applicable to ALL detailed report types**
>
> The values in passed in will be specific to the report-type but the concepts are applicable to all detailed reports.
>
>

### Parameters

**Method:** POST

#### Headers

| Name          | Required | Description                                                                                              | Example                              |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Authorization | ✓        | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name    | Required | Description                 | Example |
| ------- | -------- | --------------------------- | ------- |
| version | ✓        | The current version is `v8` | v8      |

#### Body

| Name                                       | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Example                                                                                                                                                                      |
| ------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                                       | ✓        | The report type. Acceptable values are the types returned from the `report-types` API                                                                                                                                                                                                                                                                                                                                                                                                          | agent-status-by-status-code                                                                                                                                                  |
| title                                      | ✓        | The report title, which allows only the characters listed below: letters from A to Z, a to z, 0 to 9, whitespaces or ! - \_ . \* ' ( ). If the report is later downloaded as a file, the title is used as the filename.                                                                                                                                                                                                                                                                        | agent-status-by-status-code                                                                                                                                                  |
| dateRange.start                            | ✓        | This parameter specifies that only events and records on or after the specified date are in the report. The entered values should follow the ISO 8061 standard (YYYY-MM-DDTHH:MM:SS.SSSZ) (For example, 2019-09-01T23:00:00.000Z)                                                                                                                                                                                                                                                              |                                                                                                                                                                              |
| dateRange.end                              | ✓        | This parameter specifies that only events and records on or before the specified date are included in the report. The entered values should follow the ISO 8061 standard. (YYYY-MM-DDTHH:MM:SS.SSSZ) (For example, 2019-09-01T23:00:00.000Z)                                                                                                                                                                                                                                                   |                                                                                                                                                                              |
| timezone                                   | ☐        | The desired timezone (([IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/Helsinki [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))) that is applicable to current metrics only. Accepted timezone values are those that are configured for the tenant. The value can be the tenant’s default timezone or a value defined as an optional timezone. If no value is specified, the tenant’s default timezone is used | Europe/Helsinki                                                                                                                                                              |
| intraDayTimeRange.start                    | ☐        | See [IntraDayTimeRange](/analytics/docs/cc-historical-analytics-summary-report#intradaytimerange). The start time for the intraDayTimeRange. The format is hh:mm:ss                                                                                                                                                                                                                                                                                                                            | 08:30:00                                                                                                                                                                     |
| intraDayTimeRange.end                      | ☐        | See [IntraDayTimeRange](/analytics/docs/cc-historical-analytics-summary-report#intradaytimerange). The end time for the intraDayTimeRange. The end must be at least 5 minutes after the start. The format is hh:mm:ss                                                                                                                                                                                                                                                                          | 17:00:00                                                                                                                                                                     |
| metrics                                    | ☐        | Can be omitted and all available metrics will be returned, or an array of `metrics` can be specified and only these metrics will be returned. See [metrics](/analytics/docs/cc-historical-analytics-detailed-report#metrics)                                                                                                                                                                                                                                                                   | "metrics": [<br />"accepted",<br />"acceptedInSla",<br />"acceptedInSlaPercentage",<br />"acceptedPercentage",<br />"totalAbandoned",<br />"totalAbandonedPercentage"<br />] |
| searchQuery                                | ☐        | See [searchQuery](/analytics/docs/cc-historical-analytics-detailed-report#searchquery)                                                                                                                                                                                                                                                                                                                                                                                                         | true                                                                                                                                                                         |
| includeParticipants                        | ☐        | Only valid for detailed-reports-interaction-details report type. Default is false. see [includeParticipants](/analytics/docs/cc-historical-analytics-detailed-report#includeparticipants)                                                                                                                                                                                                                                                                                                      | true                                                                                                                                                                         |
| reportSettings.showOngoingInteractions     | ☐        | Allows interactions to be displayed that are not still ongoing and have partial data representing the current state of that interaction.                                                                                                                                                                                                                                                                                                                                                       | true                                                                                                                                                                         |
| reportSettings.showInteractionsStateInTime | ☐        | This parameter can be combined with *showOngoingInteractions* to show interactions as they were when providing a time range not up to the present, showing interactions in the ongoing state for when the time range ends.                                                                                                                                                                                                                                                                     | true                                                                                                                                                                         |

#### intraDayTimeRange

This parameter is used to specify a time range filter which applies within each day of the report. If this parameter is not specified, data will be returned for the complete time frame described in the mandatory dateRange object.

> 🚧 **intraDayTimeRange minimum size**
>
> The *end* must be 5 minutes after the start for detailed reports and 15 minutes after the start for summary reports.
>
>

* *start*: the start time for the intraDayTimeRange. The format is hh:mm:ss
* *end*: the end time for the intraDayTimeRange. The format is hh:mm:ss

If the requirement is to only see data between 8:30am and 5pm on each day the intraDayTimeRange would be passed as follows

```json
"intraDayTimeRange": 
{
        "start": "08:30:00",
        "end": "17:00:00"
}

```

#### metrics

can be omitted and all available metrics will be returned, or an array of `metrics` can be specified and only these metrics will be returned.

> 📘 **Metrics Example**
>
> If the requirement is to only have a subset of the the available metrics for the report type, we specify the required metrics
>
> * if no metrics are specified (omitted entirely or empty array): All metrics will be returned
> * if metrics are specified: ONLY the specified metrics will be returned
>
> [Interaction Details report - Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/Glossary-historical-reports.htm) and [Agent Status Change Detail](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/Glossary-historical-reports.htm) provide detail on the definitions of the available metrics
>
>

multiple metrics

```json
"metrics":  [
  "agentNotes",
  "caseNumber",
  "channelId",
  "creationTime",
  "customerName",
  "destination",
  "direction",
  "finishedTime",
  "interactionId",
  "interactionType",
  "mediaType",
  "queueName",
  "transactionId",
  "ivrTreatmentDuration",
  "queueName"
]

```

#### searchQuery

This parameter can be completely omitted Or an empty array can be passed to signify no filter.

> 📘 **searchQuery logical operation.**
>
> The searchQuery object is an array which can include one or several objects, each acting as a filter containing the fields: field, operator, and value. If multiple filter objects are specified, the relation between them is logical AND
>
>

> 📘 **searchQuery operators are type specific**
>
> * Numeric Fields ( durations like `busyDuration` and counts like `warmTransfersCompleted`:
>   * `=, <, >, !=, >=, <=, is-empty, is-not-empty`
>   * for durations (like `participantWrapUpDuration`, `ivrTreatmentDuration`) 1s => 1 second, 10m => 10 minutes, 3h => 3 hours, 7d => 7 days
> * Id fields (like `interactionId`) and names (like `queueName`) `contains, is-empty, is-not-empty`
>

Sample Search Queries (click for details)

no searchQueryagentNotes containsqueueName is one offilter queueName contains and ivrTreatmentDuration >= 10 seconds

```json
"searchQuery": [
] 

```

```json
"searchQuery": [
    {
        "field": "agentNotes",
        "operator": "contains",
        "value": "order"
    }
]

```

```json
"searchQuery": [
    {
        "field": "queueName",
        "operator": "in",
        "value": ["US Sales", "EU Sales"]
    }
]

```

```json
"searchQuery":[
    {
        "field": "queueName",
        "operator": "contains",
        "value": "Sales"
    },
    {
        "field": "ivrTreatmentDuration",
        "operator": ">=",
        "value": "10s"
    }
]

```

### Create Report Request

In this example we are running the report from 3rd August to 2nd September, we are only interested in the periods between 8:30am and 5pm on each day.  

The data returned will only be where agentNotes contains "order" and queueName is "US Sales" or "EU Sales" and the ivrTreatementDuration was greater than or equal to 10 seconds.

```bash
curl --location --request POST 'https://api.8x8.com/analytics/cc/v8/historical-metrics/detailed-reports' \
--header 'Authorization: Bearer {access_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": "detailed-reports-interaction-details",
    "title": "US-EU Sales-Orders-10-secondsIVR",
    "dateRange": {
        "start": "2022-08-03T00:00:00.000Z",
        "end": "2022-09-02T23:59:59.999Z"
    },
    "timezone": "America/Chicago",
    "intraDayTimeRange": {
        "start": "08:30:00",
        "end": "17:00:00"
    },
    "metrics":[
      "agentNotes",
      "caseNumber",
      "channelId",
      "creationTime",
      "customerName",
      "destination",
      "direction",
      "finishedTime",
      "interactionId",
      "interactionType",
      "mediaType",
      "queueName",
      "transactionId",
      "ivrTreatmentDuration",
      "queueName"
   ],
   "searchQuery":[
        {
            "field": "agentNotes",
            "operator": "contains",
            "value": "order"
        },
        {
            "field": "ivrTreatmentDuration",
            "operator": ">=",
            "value": "10s"
        },
        {
            "field": "queueName",
            "operator": "in",
            "value": ["US Sales", "EU Sales"]
        }
    ]
}'

```

### Create Report Response

For an accepted request to create a report the response will be 200 OK

#### Headers

* **Link**: The Link header will provide details on how to access the data

```text
[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/detailed-reports/2853641/data?size=100>; rel="data"`

```

> 📘 **Successful Creation always results in DONE**
>
> There is no need to poll for status with detailed reports, this is a variation from summary reports.
>
>

#### Body

* **id**: this is the identifier for the generated report
* **status**: this is the status of the request for a newly created report.
  * DONE : the report has been generated
  * FAILED : the report has failed to generate

```json
{
    "id": 2710192,
    "status": "DONE"
}

```

## 5. Accessing Report Data

> 🚧 **Accessing the report Data**
>
> The data is available via JSON ONLY from `historical-metrics/detailed-reports`
>
> CSV/XLS responses are available from the `historical-metrics` endpoint use the [CC Historical Analytics Summary Report](/analytics/docs/cc-historical-analytics-summary-report) process for CSV/XLSX output of detailed reports
>
>

### Parameters

**Method:** GET

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| version | ✓ | The current version is `v8` | v8 |
| report-id | ✓ | Report id to get data for | 2853641 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| size | ☐ | The number of records to return in each page. Default is 100. Maximum is 1000 | 100 |
| lastDocumentId | ☐/✓ | This MUST BE OMITTED in the request for the initial page. Then the value MUST BE PASSED in subsequent requests See [Headers & Pagination](/analytics/docs/cc-historical-analytics-detailed-report#headers--pagination) for more information | agent-status-by-status-code |

### Report Data Request

First PageSubsequent Page

```bash
curl --location --request GET 'api.8x8.com/analytics/cc/v8/historical-metrics/detailed-reports/2853641/data?size=100' \
--header 'Authorization: Bearer access_token'

```

```bash
curl --location --request GET 'api.8x8.com/analytics/cc/v8/historical-metrics/detailed-reports/2853641/data?size=100&lastDocumentId=eyJzZWFyY2hBZnRlciI6WzE2NDQ0NzA0MzQ5NzIsOTQ1MDExNzMwMjhdfQ%3D%3D' \
--header 'Authorization: Bearer access_token'

```

### Report Data Response

#### Headers & Pagination

* **Link**: The Link header will provide a link to the next page in the data if there are additional pages by using the lastDocumentId to index into the result set `[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/detailed-reports/2710192/data?size=3&lastDocumentId=eyJzZWFyY2hBZnRlciI6WzE2NDQ0NzA0MzQ5NzIsOTQ1MDExNzMwMjhdfQ%3D%3D>; rel="next"`
* **X-Page-Size**: size of the requested pages
* **X-Total-Pages**: total number of pages for the report, 1 if only one page.
* **X-Total-Elements**: total number of elements for the report
* **Last-Document-Id**: the id of the last record in this page. Input to subsequent request to get the next page.

**Pagination**

When requesting the first page the `lastDocumentId` **MUST BE OMMITTED**

When requesting subsequent pages use the returned value of the Last-Document-Id header in as the `lastDocumentId` of the following request. The Last-Document-Id will change on each request.

When the last page is reached:

* `Link` Header will not be present
* `Last-Document-Id` Header will not be present

#### Body

The body will be an array as shown below.

* The array could be empty if there are no records in the result
* If not empty the array will contain one or more objects as described here  

* **total**: is `null` for detailed reports  

* **items**: array of the dimensions and metrics being returned. There will be one object for each.  

* *key*: the value will be the name of the dimension/metric  

* *label*: the value will be the human friendly name of the dimension/metric  

* *value*: the value will be the value of the dimension/metric. The value could be a string, could represent an array of values (ex. *["Queued", "Handled" ]*) or an object.

The *finishedTime* metric has the following format:

```json
{
  "key": "finishedTime",
  "label": "Finished Time",
  "value": {
    "value": "2023-07-03T16:02:59.857+03:00",
    "ongoing": false
  }
}

```

The following duration metrics have the bellowed format :

*queueWaitDuration, ivrTreatmentDuration, interactionDuration, customerJourneyDuration, participantOfferDuration, participantHandlingDuration, participantWrapUpDuration, participantProcessingDuration, participantBusyDuration, participantHoldDuration, participantLongestHoldDuration, participantMuteDuration, participantMuteHoldDuration*

```json
{
  "key": "interactionDuration",
  "label": "Interaction Duration",
  "value": {
    "value": 32281,
    "ongoing": false
  }
}

```

where the `value` field is the value of the metric itself, could be represented as a time format in case of *finishedTime* metric and as milliseconds for the rest of the above duration metrics. The `ongoing` field shows if the value is on its final state (*=false*) or the value could still be changed since the interaction is still ongoing (*=true*).

To get also the ongoing interactions the *reportSettings.showOngoingInteractions* request parameter should be set to *true*, otherwise the ongoing interactions will not be returned and the *ongoing* metric field will always be *false*.

Sample example response:

```json
[
  {
    "total": null,
    "items": [
      {
        "key": "time",
        "label": "Time",
        "value": "2023-07-03T16:02:27.576+03:00"
      },
      {
        "key": "agentNotes",
        "label": "Agent Notes",
        "value": null
      },
      {
        "key": "creationTime",
        "label": "Creation Time",
        "value": "2023-07-03T16:02:27.576+03:00"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "value": null
      },
      {
        "key": "destination",
        "label": "Destination",
        "value": "16693335195"
      },
      {
        "key": "direction",
        "label": "Direction",
        "value": "OutboundDir"
      },
      {
        "key": "dispositionAction",
        "label": "Disposition Action",
        "value": null
      },
      {
        "key": "externalTransactionData",
        "label": "External Transaction Data",
        "value": null
      },
      {
        "key": "finishedTime",
        "label": "Finished Time",
        "value": {
          "value": "2023-07-03T16:02:59.857+03:00",
          "ongoing": false
        }
      },
      {
        "key": "interactionDuration",
        "label": "Interaction Duration",
        "value": {
          "value": 32281,
          "ongoing": false
        }
      },
      {
        "key": "interactionId",
        "label": "Interaction ID",
        "value": "int-1891bd8e8f8-DcOBzKtHEIa7sb0WsK7VtUCdB-phone-01-analyticsna12manu01"
      },
      {
        "key": "interactionLabels",
        "label": "Labels",
        "value": [
          "Queued",
          "Handled"
        ]
      },
      {
        "key": "mediaType",
        "label": "Media Type",
        "value": "Phone"
      },
      {
        "key": "participantBusyDuration",
        "label": "Busy Duration",
        "value": {
          "value": 32277,
          "ongoing": false
        }
      },
      {
        "key": "participantHandlingDuration",
        "label": "Handling Duration",
        "value": {
          "value": 16347,
          "ongoing": false
        }
      }
    ]
  }
]

```

#### includeParticipants

When *detailed-reports-interaction-details* report type is created with *includeParticipants* =`true` flag, the report response return also the `participants` field which contains the following participant metrics:

* `blindTransferToAgent`
* `blindTransferToQueue'`
* `conferencesEstablished`
* `consultationsEstablished`
* `participantAssignNumber`
* `participantBusyDuration`
* `participantHandlingDuration`
* `participantHandlingEndTime`
* `participantHold`
* `participantHoldDuration`
* `participantId`
* `participantLongestHoldDuration`
* `participantName`
* `participantOfferAction`
* `participantOfferActionTime`
* `participantOfferDuration`
* `participantOfferTime`
* `participantProcessingDuration`
* `participantType`
* `participantWrapUpDuration`
* `participantWrapUpEndTime`
* `warmTransfersCompleted`
* `wrapUpCode`
* `wrapUpCodeId`
* `wrapUpCodeList`
* `wrapUpCodeListId`
* `wrapUpCodeText`
* `wrapUpShortCode`

Sample response when includeParticipants is true

```json
[
  {
    "total": null,
    "items": [
      {
        "key": "participants",
        "label": "Participants",
        "value": [
          {
            "participantAssignNumber": 1,
            "participantType": "Agent",
            "participantId": "agsN41dY9PQtyhLSd9_xqQeg",
            "participantName": "Vlad Supervisor 2",
            "participantOfferTime": "2022-09-14T23:58:31.347-07:00",
            "participantOfferAction": "OfferTimeout",
            "participantOfferActionTime": "2022-09-14T23:59:01.350-07:00",
            "participantOfferDuration": {
              "value": 2438,
              "ongoing": false
            },
            "participantHandlingEndTime": "2023-07-03T16:02:46.364+03:00",
            "participantHandlingDuration": {
              "value": 16347,
              "ongoing": false
            },
            "participantWrapUpEndTime": "2023-07-03T16:02:59.856+03:00",
            "participantWrapUpDuration": {
              "value": 13492,
              "ongoing": false
            },
            "participantProcessingDuration": {
              "value": 29839,
              "ongoing": false
            },
            "participantBusyDuration": {
              "value": 32277,
              "ongoing": false
            },
            "warmTransfersCompleted": 0,
            "blindTransferToAgent": 0,
            "blindTransferToQueue": 0,
            "consultationsEstablished": 0,
            "conferencesEstablished": 0,
            "participantHold": 0,
            "participantHoldDuration": 0,
            "participantLongestHoldDuration": 0,
            "wrapUpCode": [],
            "wrapUpCodeId": [],
            "wrapUpCodeList": [],
            "wrapUpCodeListId": [],
            "wrapUpCodeText": [],
            "wrapUpShortCode": []
          },
          {
            "participantAssignNumber": 2,
            "participantType": "Agent",
            "participantId": "agsN41dY9PQtyhLSd9_xqQeg",
            "participantName": "Vlad Supervisor 2",
            "participantOfferTime": "2022-09-14T23:59:46.074-07:00",
            "participantOfferAction": "Accepted",
            "participantOfferActionTime": "2022-09-14T23:59:50.001-07:00",
            "participantOfferDuration": {
              "value": 2438,
              "ongoing": false
            },
            "participantHandlingEndTime": "2023-07-03T16:02:46.364+03:00",
            "participantHandlingDuration": {
              "value": 16347,
              "ongoing": false
            },
            "participantWrapUpEndTime": "2023-07-03T16:02:59.856+03:00",
            "participantWrapUpDuration": {
              "value": 13492,
              "ongoing": false
            },
            "participantProcessingDuration": {
              "value": 29839,
              "ongoing": false
            },
            "participantBusyDuration": {
              "value": 32277,
              "ongoing": false
            },
            "warmTransfersCompleted": 0,
            "blindTransferToAgent": 0,
            "blindTransferToQueue": 0,
            "consultationsEstablished": 0,
            "conferencesEstablished": 0,
            "participantHold": 0,
            "participantHoldDuration": 0,
            "participantLongestHoldDuration": 0,
            "wrapUpCode": [],
            "wrapUpCodeId": [],
            "wrapUpCodeList": [],
            "wrapUpCodeListId": [],
            "wrapUpCodeText": [],
            "wrapUpShortCode": []
          }
        ]
      },
      {
        "key": "time",
        "label": "Time",
        "value": "2022-09-14T23:58:31.234-07:00"
      },
      {
        "key": "agentNotes",
        "label": "Agent Notes",
        "value": null
      },
      {
        "key": "blindTransferToAgent",
        "label": "Blind Transfer To Agent",
        "value": "0"
      },
      {
        "key": "blindTransferToQueue",
        "label": "Blind Transfer To Queue",
        "value": "0"
      },
      {
        "key": "campaignId",
        "label": "Campaign ID",
        "value": null
      },
      {
        "key": "campaignName",
        "label": "Campaign Name",
        "value": null
      },
      {
        "key": "caseFollowUp",
        "label": "Case Follow Up",
        "value": null
      },
      {
        "key": "caseNumber",
        "label": "Case Number",
        "value": "0"
      },
      {
        "key": "channelId",
        "label": "Channel ID",
        "value": "roxana_chat_channel1"
      },
      {
        "key": "conferencesEstablished",
        "label": "Conferences Established",
        "value": "0"
      },
      {
        "key": "consultationsEstablished",
        "label": "Consultations Established",
        "value": "0"
      },
      {
        "key": "creationTime",
        "label": "Creation Time",
        "value": "2022-09-14T23:58:31.234-07:00"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "value": null
      },
      {
        "key": "destination",
        "label": "Destination",
        "value": null
      },
      {
        "key": "direction",
        "label": "Direction",
        "value": "InboundDir"
      },
      {
        "key": "dispositionAction",
        "label": "Disposition Action",
        "value": null
      },
      {
        "key": "externalTransactionData",
        "label": "External Transaction Data",
        "value": null
      },
      {
        "key": "finishedTime",
        "label": "Finished Time",
        "value": "2022-09-14T23:59:57.040-07:00"
      },
      {
        "key": "interactionId",
        "label": "Interaction ID",
        "value": "int-1833ff122bc-9a3951e984fe40a6a010ed5802d3088f-chat-01-analyticsna12manu01"
      },
      {
        "key": "interactionLabels",
        "label": "Labels",
        "value": [
          "Queued",
          "OfferingTimeout",
          "Handled"
        ]
      },
      {
        "key": "interactionType",
        "label": "Type",
        "value": null
      },
      {
        "key": "ivrTreatmentDuration",
        "label": "IVR Treatment Duration",
        "value": null
      },
      {
        "key": "mediaType",
        "label": "Media Type",
        "value": "Chat"
      },
      {
        "key": "originalInteractionId",
        "label": "Original Interaction ID",
        "value": null
      },
      {
        "key": "originalTransactionId",
        "label": "Original Transaction ID",
        "value": null
      },
      {
        "key": "origination",
        "label": "Origination",
        "value": null
      },
      {
        "key": "outboundPhoneCode",
        "label": "Outbound Phone Code",
        "value": null
      },
      {
        "key": "outboundPhoneCodeId",
        "label": "Outbound Phone Code ID",
        "value": null
      },
      {
        "key": "outboundPhoneCodeList",
        "label": "Outbound Phone Code List",
        "value": null
      },
      {
        "key": "outboundPhoneCodeListId",
        "label": "Outbound Phone Code List ID",
        "value": null
      },
      {
        "key": "outboundPhoneCodeText",
        "label": "Outbound Phone Code Text",
        "value": null
      },
      {
        "key": "outboundPhoneShortCode",
        "label": "Outbound Phone Short Code",
        "value": null
      },
      {
        "key": "participantAssignNumber",
        "label": "Assign #",
        "value": "2"
      },
      {
        "key": "participantBusyDuration",
        "label": "Busy Duration",
        "value": "0:00:41"
      },
      {
        "key": "participantHandlingDuration",
        "label": "Handling Duration",
        "value": "0:00:04"
      },
      {
        "key": "participantHandlingEndTime",
        "label": "Handling End Time",
        "value": "2022-09-14T23:59:54.300-07:00"
      },
      {
        "key": "participantHold",
        "label": "Hold",
        "value": "0"
      },
      {
        "key": "participantHoldDuration",
        "label": "Hold Duration",
        "value": "0:00:00"
      },
      {
        "key": "participantId",
        "label": "Participant ID",
        "value": [
          "agsN41dY9PQtyhLSd9_xqQeg"
        ]
      },
      {
        "key": "participantLongestHoldDuration",
        "label": "Longest Hold Duration",
        "value": "0:00:00"
      },
      {
        "key": "participantName",
        "label": "Participant",
        "value": [
          "Vlad Supervisor 2"
        ]
      },
      {
        "key": "participantOfferAction",
        "label": "Offer Action",
        "value": [
          "Accepted",
          "OfferTimeout"
        ]
      },
      {
        "key": "participantOfferActionTime",
        "label": "Offer Action Time",
        "value": "2022-09-14T23:59:01.350-07:00"
      },
      {
        "key": "participantOfferDuration",
        "label": "Offer Duration",
        "value": "0:00:34"
      },
      {
        "key": "participantOfferTime",
        "label": "Offer Time",
        "value": "2022-09-14T23:58:31.347-07:00"
      },
      {
        "key": "participantProcessingDuration",
        "label": "Processing Duration",
        "value": "0:00:07"
      },
      {
        "key": "participantType",
        "label": "Participant Type",
        "value": [
          "Agent"
        ]
      },
      {
        "key": "participantWrapUpDuration",
        "label": "Wrap Up Duration",
        "value": "0:00:03"
      },
      {
        "key": "participantWrapUpEndTime",
        "label": "Wrap Up End Time",
        "value": "2022-09-14T23:59:57.039-07:00"
      },
      {
        "key": "queueId",
        "label": "Queue ID",
        "value": "412"
      },
      {
        "key": "queueName",
        "label": "Queue Name",
        "value": "roxana_chat_queue"
      },
      {
        "key": "queueTime",
        "label": "Queue Time",
        "value": "2022-09-14T23:58:31.346-07:00"
      },
      {
        "key": "queueWaitDuration",
        "label": "Queue Wait Duration",
        "value": "0:01:19"
      },
      {
        "key": "recordId",
        "label": "Record ID",
        "value": null
      },
      {
        "key": "transactionId",
        "label": "Transaction ID",
        "value": "1816"
      },
      {
        "key": "warmTransfersCompleted",
        "label": "Warm Transfers Completed",
        "value": "0"
      },
      {
        "key": "wrapUpCode",
        "label": "Wrap Up Code",
        "value": []
      },
      {
        "key": "wrapUpCodeId",
        "label": "Wrap Up Code ID",
        "value": []
      },
      {
        "key": "wrapUpCodeList",
        "label": "Wrap Up Code List",
        "value": []
      },
      {
        "key": "wrapUpCodeListId",
        "label": "Wrap Up Code List ID",
        "value": []
      },
      {
        "key": "wrapUpCodeText",
        "label": "Wrap Up Code Text",
        "value": []
      },
      {
        "key": "wrapUpShortCode",
        "label": "Wrap Up Short Code",
        "value": []
      }
    ]
  },
  {
    "total": null,
    "items": [
      {
        "key": "participants",
        "label": "Participants",
        "value": []
      },
      {
        "key": "time",
        "label": "Time",
        "value": "2022-09-14T10:15:50.320-07:00"
      },
      {
        "key": "agentNotes",
        "label": "Agent Notes",
        "value": null
      },
      {
        "key": "blindTransferToAgent",
        "label": "Blind Transfer To Agent",
        "value": null
      },
      {
        "key": "blindTransferToQueue",
        "label": "Blind Transfer To Queue",
        "value": null
      },
      {
        "key": "campaignId",
        "label": "Campaign ID",
        "value": null
      },
      {
        "key": "campaignName",
        "label": "Campaign Name",
        "value": null
      },
      {
        "key": "caseFollowUp",
        "label": "Case Follow Up",
        "value": null
      },
      {
        "key": "caseNumber",
        "label": "Case Number",
        "value": null
      },
      {
        "key": "channelId",
        "label": "Channel ID",
        "value": "12029635128"
      },
      {
        "key": "conferencesEstablished",
        "label": "Conferences Established",
        "value": null
      },
      {
        "key": "consultationsEstablished",
        "label": "Consultations Established",
        "value": null
      },
      {
        "key": "creationTime",
        "label": "Creation Time",
        "value": "2022-09-14T10:15:50.320-07:00"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "value": "Relative Ferdinand"
      },
      {
        "key": "destination",
        "label": "Destination",
        "value": null
      },
      {
        "key": "direction",
        "label": "Direction",
        "value": "InboundDir"
      },
      {
        "key": "dispositionAction",
        "label": "Disposition Action",
        "value": null
      },
      {
        "key": "externalTransactionData",
        "label": "External Transaction Data",
        "value": null
      },
      {
        "key": "finishedTime",
        "label": "Finished Time",
        "value": "2022-09-14T10:16:55.513-07:00"
      },
      {
        "key": "interactionId",
        "label": "Interaction ID",
        "value": "int-1833cfff2af-L7NxZXoe0ttnABJQ2innePQuP-phone-01-analyticsna12manu01"
      },
      {
        "key": "interactionLabels",
        "label": "Labels",
        "value": [
          "Queued",
          "Dequeued"
        ]
      },
      {
        "key": "interactionType",
        "label": "Type",
        "value": null
      },
      {
        "key": "ivrTreatmentDuration",
        "label": "IVR Treatment Duration",
        "value": "0:00:05"
      },
      {
        "key": "mediaType",
        "label": "Media Type",
        "value": "Phone"
      },
      {
        "key": "originalInteractionId",
        "label": "Original Interaction ID",
        "value": null
      },
      {
        "key": "originalTransactionId",
        "label": "Original Transaction ID",
        "value": null
      },
      {
        "key": "origination",
        "label": "Origination",
        "value": "2068096167"
      },
      {
        "key": "outboundPhoneCode",
        "label": "Outbound Phone Code",
        "value": null
      },
      {
        "key": "outboundPhoneCodeId",
        "label": "Outbound Phone Code ID",
        "value": null
      },
      {
        "key": "outboundPhoneCodeList",
        "label": "Outbound Phone Code List",
        "value": null
      },
      {
        "key": "outboundPhoneCodeListId",
        "label": "Outbound Phone Code List ID",
        "value": null
      },
      {
        "key": "outboundPhoneCodeText",
        "label": "Outbound Phone Code Text",
        "value": null
      },
      {
        "key": "outboundPhoneShortCode",
        "label": "Outbound Phone Short Code",
        "value": null
      },
      {
        "key": "participantAssignNumber",
        "label": "Assign #",
        "value": null
      },
      {
        "key": "participantBusyDuration",
        "label": "Busy Duration",
        "value": null
      },
      {
        "key": "participantHandlingDuration",
        "label": "Handling Duration",
        "value": null
      },
      {
        "key": "participantHandlingEndTime",
        "label": "Handling End Time",
        "value": null
      },
      {
        "key": "participantHold",
        "label": "Hold",
        "value": null
      },
      {
        "key": "participantHoldDuration",
        "label": "Hold Duration",
        "value": null
      },
      {
        "key": "participantId",
        "label": "Participant ID",
        "value": null
      },
      {
        "key": "participantLongestHoldDuration",
        "label": "Longest Hold Duration",
        "value": null
      },
      {
        "key": "participantName",
        "label": "Participant",
        "value": null
      },
      {
        "key": "participantOfferAction",
        "label": "Offer Action",
        "value": null
      },
      {
        "key": "participantOfferActionTime",
        "label": "Offer Action Time",
        "value": null
      },
      {
        "key": "participantOfferDuration",
        "label": "Offer Duration",
        "value": null
      },
      {
        "key": "participantOfferTime",
        "label": "Offer Time",
        "value": null
      },
      {
        "key": "participantProcessingDuration",
        "label": "Processing Duration",
        "value": null
      },
      {
        "key": "participantType",
        "label": "Participant Type",
        "value": null
      },
      {
        "key": "participantWrapUpDuration",
        "label": "Wrap Up Duration",
        "value": null
      },
      {
        "key": "participantWrapUpEndTime",
        "label": "Wrap Up End Time",
        "value": null
      },
      {
        "key": "queueId",
        "label": "Queue ID",
        "value": "332"
      },
      {
        "key": "queueName",
        "label": "Queue Name",
        "value": "CexInboundDemo"
      },
      {
        "key": "queueTime",
        "label": "Queue Time",
        "value": "2022-09-14T10:15:55.443-07:00"
      },
      {
        "key": "queueWaitDuration",
        "label": "Queue Wait Duration",
        "value": "0:01:00"
      },
      {
        "key": "recordId",
        "label": "Record ID",
        "value": null
      },
      {
        "key": "transactionId",
        "label": "Transaction ID",
        "value": "1807"
      },
      {
        "key": "warmTransfersCompleted",
        "label": "Warm Transfers Completed",
        "value": null
      },
      {
        "key": "wrapUpCode",
        "label": "Wrap Up Code",
        "value": null
      },
      {
        "key": "wrapUpCodeId",
        "label": "Wrap Up Code ID",
        "value": null
      },
      {
        "key": "wrapUpCodeList",
        "label": "Wrap Up Code List",
        "value": null
      },
      {
        "key": "wrapUpCodeListId",
        "label": "Wrap Up Code List ID",
        "value": null
      },
      {
        "key": "wrapUpCodeText",
        "label": "Wrap Up Code Text",
        "value": null
      },
      {
        "key": "wrapUpShortCode",
        "label": "Wrap Up Short Code",
        "value": null
      }
    ]
  }
]

```
