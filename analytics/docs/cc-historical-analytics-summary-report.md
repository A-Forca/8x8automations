# CC Historical Analytics Summary Report

Customers looking to access data in JSON or CSV/XLSX from [CC Historical Analytics](/analytics/reference/cc-historical-report-create) can follow the this multi step process.

> 📘 **You will need a working API key to begin**
>
> [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
>

The base URL is region specific, based on the location of your Contact Center tenant.

* United States: `api.8x8.com/analytics/cc/{version}/historical-metrics/`
* Europe: `api.8x8.com/eu/analytics/cc/{version}/historical-metrics/`
* Asia-Pacific: `api.8x8.com/au/analytics/cc/{version}/historical-metrics/`
* Canada: `api.8x8.com/ca/analytics/cc/{version}/historical-metrics/`
* {version} to be replaced by current Version. As of August 2025 this is 8 resulting in /v8/

## 1. Authenticate to retrieve access token

[OAuth Authentication for 8x8 XCaaS APIs](/analytics/docs/oauth-authentication-for-8x8-xcaas-apis) is used to get a temporary `access_token` for use in with this API

**Outputs For Next Step:**

* access_token
* expires_in

The following steps will use the access_token as a Bearer Token form of authentication. This takes the form of the  

`Authorization` header being set to `Bearer access_token` (Space between Bearer and the access_token)

> 📘 **JSON Examples shown, XML Also available**
>
> This guide shows all the examples in JSON. It is possible to retrieve responses in XML by specifying the following header
>
> `Accept: application/xml`
>
>

## 2 Multitenancy support

If the API is used for a multitenant customer the requests should contain "X-Tenant-Info" header variable where needs to specify the desired tenantId. The "X-Tenant-Info" header is not mandatory in case of a single tenant customer.

The following error messages could be returned when dealing with a multitenant customer:

* if for a multitenant customer request the *"X-Tenant-Info"* header is not provided the HTTP 400 code along with *"Bad request: X-Tenant-Info header is missing."* message will be returned
* if a wrong tenantId is provided the HTTP 400 code along with *"Bad request: Invalid value for X-Tenant-Info header."* message will be returned

## 3. Get Available Report Types

CC Historical Analytics allows the consumer to get a listing of the available reports including information about their options and available data.

Additional information about each of the reports and detailed definitions of metrics can be found in the [CC Historical Analytics Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/Glossary-historical-reports.htm)

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

The definition of a single report can also be retrieved by adding the `report-type` to the path

all report typessingle report type

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/report-types' \
     --header 'Accept: application/json;charset=UTF-8' \
     --header 'Authorization: Bearer {access_token}'

```

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/report-types/agent-status-by-status-code' \
     --header 'Accept: application/json;charset=UTF-8' \
     --header 'Authorization: Bearer {access_token}' 

```

### Report Types Response

The response shows each `report-type` that's available.

> 📘 **Detailed Reports**
>
> This returns some "detailed" report types as well as the summary reports. Detailed reports have a different format described in the [CC Historical Analytics Detailed Report Guide](/analytics/docs/cc-historical-analytics-detailed-report)
>
>

**Outputs For Next Step:**  

For the summary reports the response has a number of elements to guide the usage:

* `type` each report type has a unique definition
* `groupBy` each report has one or more groupBy options. This specifies the grouping for the output
  * `name` this is the name to specify when creating a report with a specific grouping
  * `filters` these are the available filters for this report type for this particular grouping. The filters available vary depending on the type AND the grouping.
* `metrics` these are the available metrics for the report type. When creating a report. See the [CC Historical Analytics Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/Glossary-historical-reports.htm) for additional detail on the definition of the available metrics
* When running reports:
  * if no metrics are specified: All metrics will be returned
  * if metrics are specified: ONLY the specified metrics will be returned

The body will be an array as shown below.

* The array will contain one or more objects as described here

  * **type**: this is the report type and name of the report
  * **groupBy**: array of options for grouping the report by various dimensions
    * *name*: name of the grouping
    * *filters*: array of the possible filtering options for this grouping for this report
  * **value**: array of the metrics available for this report

```json
[
    {
        "type": "report type name",
        "groupBy": [
            {
                "name": "name of grouping 1",
                "filters": [
                    "filterable dimension 1",
                    "filterable dimension 2"
                ]
            },
            {
                "name": "name of grouping 2",
                "filters": [
                    "filterable dimension 1",
                    "filterable dimension 2",
                    "filterable dimension 3",
                ]
            }
        ],
        "metrics": [
            "report metric 1",
            "report metric 2"
        ]
    }
]

```

**Sample Response for single report type**

The result **will be different** for each report type.

```json
{
    "type": "agent-interactions-summary",
    "groupBy": [
        {
            "name": "agent",
            "filters": [
                "agent"
            ]
        },
        {
            "name": "agent-and-media",
            "filters": [
                "agent",
                "media"
            ]
        },
        {
            "name": "agent-and-media-and-channel",
            "filters": [
                "agent",
                "media"
            ]
        },
        {
            "name": "agent-and-media-and-channel-and-queue",
            "filters": [
                "agent",
                "media",
                "queue"
            ]
        },
        {
            "name": "agent-and-media-and-queue",
            "filters": [
                "agent",
                "media",
                "queue"
            ]
        },
        {
            "name": "group",
            "filters": [
                "group"
            ]
        },
        {
            "name": "group-and-agent",
            "filters": [
                "agent",
                "group"
            ]
        },
        {
            "name": "group-and-agent-and-media",
            "filters": [
                "agent",
                "group",
                "media"
            ]
        },
        {
            "name": "group-and-agent-and-media-and-channel",
            "filters": [
                "agent",
                "group",
                "media"
            ]
        },
        {
            "name": "group-and-agent-and-media-and-channel-and-queue",
            "filters": [
                "agent",
                "group",
                "media",
                "queue"
            ]
        },
        {
            "name": "group-and-agent-and-media-and-queue",
            "filters": [
                "agent",
                "group",
                "media",
                "queue"
            ]
        },
        {
            "name": "group-and-media",
            "filters": [
                "group",
                "media"
            ]
        },
        {
            "name": "group-and-media-and-channel",
            "filters": [
                "group",
                "media"
            ]},
        {
            "name": "group-and-media-and-channel-and-queue",
            "filters": [
                "group",
                "media",
                "queue"
            ]
        },
        {
            "name": "group-and-media-and-queue",
            "filters": [
                "group",
                "media",
                "queue"
            ]
        }
    ],
    "metrics": [
        "abandoned",
        "abandonedPercentage",
        "accepted",
        "acceptedPercentage",
        "alerting",
        "avgBusyTime",
        "avgHandlingTime",
        "avgHoldTime",
        "avgSpeedToAnswer",
        "avgWrapUpTime",
        "blindTransferToAgent",
        "blindTransferToQueue",
        "blindTransfersInitiated",
        "blindTransfersReceived",
        "busyTime",
        "handlingTime",
        "hold",
        "holdTime",
        "longestHoldTime",
        "longestOfferingTime",
        "offeringTime",
        "presented",
        "rejectTimeout",
        "rejected",
        "rejectedPercentage",
        "transfersInitiated",
        "transfersInitiatedPercentage",
        "transfersReceived",
        "warmTransfersCompleted",
        "warmTransfersReceived",
        "wrapUpTime"
    ]
}

```

## 4. Creating A Summary Report

> 📘 **This sample is applicable to ALL summary report types**
>
> The values in passed in will be specific to the report-type but the concepts are applicable to all summary report types.
>
>

### Parameters

**Method:** POST

#### Headers

| Name          | Required | Description                                                                                              | Example                              |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Authorization | ✓        | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |
| Content-Type  | ✓        | Set Content-Type to application/json                                                                     | application/json                     |

#### Path

| Name        | Required | Description                                                                              | Example                     |
| ----------- | -------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| version     | ✓        | The current version is `v8`                                                              | v8                          |
| report-type | ☐        | Specific report type to get information on. Omit this parameter to get all report types. | agent-status-by-status-code |

#### Body

| Name                    | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Example                                                                                                                                                                        |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type                    | ✓        | The report type. Acceptable value is any one of the types returned from the `report-types` API                                                                                                                                                                                                                                                                                                                                                                                               | agent-status-by-status-code                                                                                                                                                    |
| title                   | ✓        | The report title, which allows only the characters listed below: letters from A to Z, a to z, 0 to 9, whitespaces or ! - \_ . \* ' ( ). If the report is later downloaded as a file, the title is used as the filename.                                                                                                                                                                                                                                                                      | Agent Status By Code Aug Sep                                                                                                                                                   |
| dateRange.start         | ✓        | This parameter specifies that only events and records on or after the specified date are in the report. The entered values should follow the ISO 8061 standard (YYYY-MM-DDTHH:MM:SS.SSSZ) (For example, 2019-09-01T23:00:00.000Z)                                                                                                                                                                                                                                                            |                                                                                                                                                                                |
| dateRange.end           | ✓        | This parameter specifies that only events and records on or before the specified date are included in the report. The entered values should follow the ISO 8061 standard. (YYYY-MM-DDTHH:MM:SS.SSSZ) (For example, 2019-09-01T23:00:00.000Z)                                                                                                                                                                                                                                                 |                                                                                                                                                                                |
| granularity             | ✓        | This parameter specifies how to aggregate the report data by time intervals. You must use one of the following values: 15m, 30m, hour, day, week, month, year, or none. See [granularity](/analytics/docs/cc-historical-analytics-summary-report#granularity) for more information.                                                                                                                                                                                                          | 15m                                                                                                                                                                            |
| groupBy.name            | ✓        | This parameter controls how your data should be grouped by dimensions. It must be one of the grouping options returned by report-type for the specified report type.                                                                                                                                                                                                                                                                                                                         | media-and-channel-and-queue                                                                                                                                                    |
| groupBy,filters[]       | ☐        | Filters are an array of names and values that describes the dimension to filter by and the values of those filter(s). See [filters](/analytics/docs/cc-historical-analytics-summary-report#filters) for more detail.                                                                                                                                                                                                                                                                         | [filters](/analytics/docs/cc-historical-analytics-summary-report#filters)                                                                                                      |
| timezone                | ☐        | The desired timezone ([IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/Helsinki [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)) that is applicable to current metrics only. Accepted timezone values are those that are configured for the tenant. The value can be the tenant’s default timezone or a value defined as an optional timezone. If no value is specified, the tenant’s default timezone is used | Europe/Helsinki                                                                                                                                                                |
| intraDayTimeRange.start | ☐        | See [IntraDayTimeRange](/analytics/docs/cc-historical-analytics-summary-report#intradaytimerange). The start time for the intraDayTimeRange. The format is hh:mm:ss                                                                                                                                                                                                                                                                                                                          | 08:30:00                                                                                                                                                                       |
| intraDayTimeRange.end   | ☐        | See [IntraDayTimeRange](/analytics/docs/cc-historical-analytics-summary-report#intradaytimerange). The end time for the intraDayTimeRange. The end must be at least 15 minutes after the start. The format is hh:mm:ss                                                                                                                                                                                                                                                                       | 17:00:00                                                                                                                                                                       |
| metrics                 | ☐        | Can be omitted and all available metrics will be returned, or an array of `metrics` can be specified and only these metrics will be returned.                                                                                                                                                                                                                                                                                                                                                | "metrics": [ <br />"accepted",<br />"acceptedInSla",<br />"acceptedInSlaPercentage",<br />"acceptedPercentage",<br />"totalAbandoned",<br />"totalAbandonedPercentage"<br /> ] |
| includeSubTotal         | ☐        | (Default `false`) This parameter adds subtotals rows in the report. It accepts only Boolean values written as `true` or `false` or as strings listed as `"true"` or `"false"`.                                                                                                                                                                                                                                                                                                               | true                                                                                                                                                                           |
| includeGrandTotal       | ☐        | (Default `false`)This parameter puts the grand total row in the report. It accepts only Boolean values written as `true` or `false` or as strings listed as `"true"` or `"false"`                                                                                                                                                                                                                                                                                                            | true                                                                                                                                                                           |

#### granularity

This parameter specifies how to aggregate the report data by time intervals. You must use one of the following values: 15m, 30m, hour, day, week, month, year, or none.

* If the assigned parameter value is none, then the report data is not aggregated by time.
* For date range intervals less than or equal to a week the accepted > - granularities are 15m, 30m, hour, day, or none.
* For date range intervals less than or equal to a month and but longer than a week the accepted granularities are none, hour, day, or week
* For date range intervals longer than a month the accepted granularities are none, month, or year

#### intraDayTimeRange

This parameter is used to specify a time range filter which applies within each day of the report. If this parameter is not specified, data will be returned for the complete time frame described in the mandatory dateRange object.

> 🚧 **intraDayTimeRange minimum size**
>
> The *end* must be 15 minutes after the start for summary reports and 5 minutes after the start for detailed reports.
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

In version 6 intraDayTimeRange was enhanced to to cover cross-day time range filtering in reports allowing to generate a single report for overnight shifts, and it is available for all aggregated and detailed report types. You can now generate reports for overnight shifts of specific time ranges that cross two days.

With the following example can be generated a report which cover activities for a week but for only time intervals from 20:00 to 06:00 time range.

```json
"dateRange":
{ 
    "start": "2022-08-05T00:00:00.00Z", 
    "end": "2022-08-11T00:00:00.00Z" 
},
"intraDayTimeRange": 
{
    "start": "20:00:00",
    "end": "06:00:00"
}

```

#### filters

Parameter can be completely omitted Or an empty array can be passed for no filtering.

For example report type `queue-interactions-summary` and groupBy `media-and-channel-and-queue` we can chose to not filter at all OR filter by `media` and or `queue`

Each report type has it's own filtering capabilies which can be found in the [Report Types Response](/analytics/docs/cc-historical-analytics-summary-report#report-types-response) each `groupBy` has it's own applicable filters.

no filtersingle queuefilter on multiple queuesfilter on multiple queues and multiple media

```json
  "filters": [
  ] 

```

```json
  "filters": [
       {
          "name": "queue",  
          "values": ["103"]
       }
  ]

```

```json
  "filters": [
       {
          "name": "queue",  
          "values": ["103", "330"]
       }
  ]

```

```json
  "filters": [
       {
          "name": "queue",  
          "values": ["103", "330"]
       },
       {
          "name": "media",  
          "values": ["Phone", "Chat"]
       }
  ]

```

*Notes:*

* When filtering by `media`, if the user also wants to filter by phone direction, instead of using `{"name": "media", "values": ["Phone"]}`, the phone direction can be specified as follows: `{"name": "media", "values": ["OutboundPhone"]}` or `{"name": "media", "values": ["InboundPhone"]}`
* When creating an `agent-interactions-by-wrap-up-code` report type, and the customer wants to filter by `wrap-up-code`, the filter values should be formatted as follows: `{"name": "wrap-up-code", "values": ["<wrap-up-code-list-id>-<wrap-up-code-item-id>"]}`. The `<wrap-up-code-list-id>` and `<wrap-up-code-item-id>` can be found in the CCA UI detailed reports by adding the 'Wrap Up Code List ID' and 'Wrap Up Code ID' fields to the report. For example: `{"name": "wrap-up-code", "values": ["170-1201"]}`

#### metrics

If the requirement is to only have a subset of the the available metrics for the report type, we specify the required metrics

* if no metrics are specified (omitted entirely or empty array) ==> All metrics will be returned
* if metrics are specified ==> ONLY the specified metrics will be returned

 [CC Historical Analytics Glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/8x8Analytics/Glossary-historical-reports.htm) provides detail on the definition of the available metrics

```json
"metrics": [
    "accepted",
    "acceptedInSla",
    "acceptedInSlaPercentage",
    "acceptedPercentage",
    "totalAbandoned",
    "totalAbandonedPercentage"
]

```

[API reference](/analytics/reference/cc-historical-report-create)

### Create Report Request

In this example we are running the report from 3rd August to 2nd September, we are only interested in the periods between 8:30am and 5pm on each day and we are grouping the data by media, channel and queue at a weekly granularity.  

The data returned will only be for queue id is 103 and 330 and only if the media is Phone or Chat and the metrics returned will be only the ones specified, with sub and grand totals.

```bash
curl --location --request POST 'https://api.8x8.com/analytics/cc/v8/historical-metrics' \
--header 'Authorization: Bearer {access_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": "queue-interactions-summary",
    "title": "Weeky Queue Report for OPS",
    "dateRange": {
        "start": "2022-08-03T00:00:00.000Z",
        "end": "2022-09-02T00:00:00.000Z"
    },
    "granularity": "week", 
    "groupBy":{
      "name":"media-and-channel-and-queue",
         "filters": [
             {
                "name": "queue",  
                "values": ["103", "330"]
             },
             {
                "name": "media",  
                "values": ["Phone", "Chat"]
             }
        ]
    },
    "timezone": "America/New_York",
    "intraDayTimeRange":
    {
            "start": "08:30:00",
            "end": "17:00:00"
    },
    "metrics": [
        "accepted",
        "acceptedInSla",
        "acceptedInSlaPercentage",
        "acceptedPercentage",
        "totalAbandoned",
        "totalAbandonedPercentage"
    ],
    "includeGrandTotal": true,
    "includeSubTotal": true
}'

```

### Create Report Response

For an accepted request to create a report the response will be 200 OK

#### Headers

* Link => The Link header will provide details on how to check the status of the create request

```text
[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/2710192/status; rel="status">

```

#### Body

* **id**: this is the identifier for the generated report
* **status**: this is the status of the request to create the report
  * IN_PROGRESS : the report is being generated, usually the initial status
  * DONE : the report has been generated
  * FAILED : the report has failed to generate

```json
{
    "id": 2710192,
    "status": "IN_PROGRESS"
}

```

## 5. Get Report Status

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
| report-id | ✓ | report id returned in the create report request. | 2710192 |

[API reference](/analytics/reference/cc-historical-report-status-by-id)

### Report Status Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/2710192/status' \
     --header 'Authorization: Bearer access_token'

```

### Report Status response

This will be the same format as the response from creating the report. Recheck the status periodically until the status is `"DONE"`.

> 🚧 **Don't check status in a tight loop (please)**
>
> Leave some time between status checks, repeatedly requesting updates without taking a pause is more likely to slow the response than speed it up.
>
>

#### Headers

The Link header WILL ONLY be present if the report staus is `"DONE"`

* Link => The Link header will provide details on how access the data and download for the report

```text
[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/2710663/data?page=0&size=100>; rel="data",
[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/2710663/download>; rel="download"

```

#### Body

* **id**: this is the identifier for the generated report
* **status**: this is the status of the request to create the report
  * IN_PROGRESS : the report is being generated, usually the initial status
  * DONE : the report has been generated
  * FAILED : the report has failed to generate

```json
{
    "id": 2710192,
    "status": "IN_PROGRESS"
}

```

## 6a. Get Report Data (JSON)

> 📘 **Accessing the report Data**
>
> The data is available via JSON or via CSV/XLSX. To access the data as JSON the data endpoint is used, for CSV/XLSX the download endpoint is used.
>
>

> 🚧 **Data (JSON) results are capped at 10,000 records.**
>
> CSV/XLS will return all larger result sets.
>
> Detailed Reports have an alternative approach since larger result sets are expected.
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
| report-id | ✓ | report id returned in the create report request. | 2710192 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| page | ☐ | (starts from 0) enables navigation to the expected page; if no value is specified then the first page is retrieved. Required on subsequent pages | 0 |
| size | ☐ | gives the amounts of elements on one page. If no value is specified then default values are used (0 for page, 100 for size). Maximum page size is 1000 elements | 200 |

[API reference](/analytics/reference/cc-historical-report-data-by-id)

### Report Data (JSON) Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/2710192/data?page=0&size=100' \
--header 'Authorization: Bearer {access_token}'

```

### Report Data (JSON) Response

#### Headers

* Link => The Link header will provide a link to the next page in the data if there are additional pages. **Will not be present if there are no more pages.**

```text
[https://api.8x8.com/analytics/cc/v<<versionCCAHistorical](https://api.8x8.com/analytics/cc/v<<versionCCAHistorical)>/historical-metrics/2710663/data?page=1&size=100>; rel="next"

```

* **X-Page**: current page number, 0(zero) is the first page
* **X-Page-Size**: size of the requested pages
* **X-Total-Pages**: total number of pages for the report, 1 if only one page.
* **X-Total-Elements**: total number of elements for the report

#### Body

The body will be an array as shown below.

* The array could be empty if there are no records in the result
* If not empty the array will contain one or more objects as described here  

* **total**: if this represents a subtotal or grandtotal (only present if "includeGrandTotal": true, "includeSubTotal": true were requested)  

* **items**: array of the dimensions and metrics being returned. There will be one object for each.  

* *key*: the value will be the name of the dimension/metric  

* *label*: the value will be the human friendly name of the dimension/metric  

* *value*: the value will be the value of the dimension/metric. This is ALWAYS a string.

```json
[
    {
        "total": null,
        "items": [
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            },
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            }
        ]
    },
    {
        "total": {
            "type": "subtotal",
            "startIndex": 0,
            "endIndex": 1
        },
        "items": [
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            },
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            }
        ]
    }
    ,
    {
        "total": {
            "type": "grandtotal",
            "startIndex": null,
            "endIndex": null
        },
        "items": [
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            },
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            }
        ]
    }
]
[
    {
        "total": null,
        "items": {
            "name1": "value1",
            "name2": 3
            "name3": "2022-09-02T00:00:00.000Z",
        }
        
    },
    {
        "total": {
            "type": "subtotal",
            "startIndex": 0,
            "endIndex": 1
        },
        "items": [
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            },
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            }
        ]
    }
    ,
    {
        "total": {
            "type": "grandtotal",
            "startIndex": null,
            "endIndex": null
        },
        "items": [
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            },
            {
                "key": "name of key",
                "label": "Human friendly label of key",
                "value": "string representation of value",
            }
        ]
    }
]
```

> 🚧 **Dimension values for `subtotal` and `grandtotal` items**
>
> Where a subtotal or grandtotal is summarizing multiple instances of a single dimension the value for that item will be `null` since there is no single correct value
>
>

```json
{
    "total": {
        "type": "subtotal",
        "startIndex": 23,
        "endIndex": 23
    },
    "items": [
        {
            "key": "startTime",
            "label": "Start Time",
            "value": "2022-08-29T00:00-04:00"
        },
        {
            "key": "endTime",
            "label": "End Time",
            "value": "2022-09-05T00:00-04:00"
        },
        {
            "key": "media",
            "label": "Media",
            "value": "Phone"
        },
        {
            "key": "channel",
            "label": "Channel",
            "value": null
        },
        {
            "key": "queue",
            "label": "Queue",
            "value": null
        },
        {
            "key": "queueId",
            "label": "Queue Id",
            "value": null
        },
        {
            "key": "accepted",
            "label": "Accepted",
            "value": "0"
        }
    ]
}

```

## 6b. Get Report Download (CSV/XLSX)

> 📘 **Accessing the report Data**
>
> The data is available via JSON or via CSV/XLSX. To access the data as JSON the data endpoint is used, for CSV/XLSX the download endpoint is used.
>
>

> 📘 **There is no pagination the whole file will be returned.**
>
>

### Parameters

**Method:** GET

#### Headers

| Name          | Required | Description                                                                                              | Example                              |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Authorization | ✓        | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |
| Accept        | ✓        | Specify the download type <br /><br />- CSV `text/csv`<br />- XLSX `text/xlsx`                           | text\xlsx                            |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| version | ✓ | The current version is `v8` | v8 |
| report-id | ✓ | report id returned in the create report request. | 2710192 |

[API reference](/analytics/reference/cc-historical-report-download-by-id)

### Report Download (CSV/XLSX) Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/2710192/download' \
--header 'Accept: text/xlsx' \
--header 'Authorization: Bearer {access_token}'

```

### Report Download (CSV/XLSX) Response

#### Headers

* Content-Disposition => will contain information about the file generated, the filename will reflect the title input in the report creation with the xlsx or csv type extension added.  

Example: `attachment; filename="Weeky Queue Report for OPS.xlsx"`

#### Body

The file content is returned in the body.

## 7. Access Report Links

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
| report-id | ✓ | report id returned in the create report request. | 2710192 |

[API reference](/analytics/reference/cc-historical-report-links-by-id)

### Report Links Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v8/historical-metrics/2710192/links' \
--header 'Authorization: Bearer {access_token}'

```

### Report Links Response

#### Body

The body will be an array as shown below.

* `status` is always shown
* `data` and `download` are shown if the report status is DONE

```json
[
    {
        "relation": "status",
        "link": "https://api.8x8.com/analytics/cc/v8/historical-metrics/2684392/status"
    },
    {
        "relation": "data",
        "link": "https://api.8x8.com/analytics/cc/v8/historical-metrics/2684392/data?page=0&size=100"
    },
    {
        "relation": "download",
        "link": "https://api.8x8.com/analytics/cc/v8/historical-metrics/2684392/download"
    }
]

```
