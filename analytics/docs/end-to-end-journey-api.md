# [PILOT] End-to-End Journey API

## Introduction

The CIDP Journey API provides a consolidated view of customer interactions belonging to the same journey. These  
interactions may happen on one or multiple 8x8 platform, including Contact Center (CC), Unified Communications (UC), and  
Engage. Using the API users can retrieve journey data and detailed transition information, enabling end-to-end tracking  
of customer journeys regardless of transfers between systems or agents.

This API is particularly valuable for organizations with complex flows that span multiple systems, where customers may  
be transferred between formal contact center agents and back-office operations.

## Business Value

The CIDP Journey API solves critical business challenges:

- **Unified Customer Journey Tracking:** Track complete customer journeys across CC, UC, and Engage in a single view
- **Transfer Pattern Analysis:** Understand how calls are transferred between systems and agents
- **Comprehensive Metrics:** Access consolidated metrics like handling time, queue wait time, and outcomes across all  
  platforms
- **Detailed Transition History:** Examine every state a customer interaction passed through

Instead of working with disconnected reporting systems, organizations can now build comprehensive reports and dashboards  
in third-party BI tools with a complete view of all customer interactions.

## Authentication

All API requests require an x-api-key header for authentication. Obtain your x-api-key from the Admin Console  
application.

Required Request Header:

```bash
x-api-key: your-api-key-value
```

## Base URLs

| Region        | Base URL                              |
| ------------- | ------------------------------------- |
| United States | `https://api.8x8.com/cidp/journey`    |
| Europe        | `https://api-eu.8x8.com/cidp/journey` |

## API Endpoints Overview

The API provides two main synchronous endpoints:

1. **Journeys** (`/v1/journeys/search`): Provides aggregated journey data across all platforms, including comprehensive metrics like handling time, queue wait time, and outcomes.

2. **Transitions** (`/v1/transitions/search`): Provides detailed information about each state transition within a journey, allowing you to track the exact journey path.

> ℹ️ **Synchronous API**
>
> The CIDP Journey API  operates synchronously. Simply send your request and receive the data immediately in the response.

## API Endpoints

### Journeys Endpoint

```http
POST /v1/journeys/search
```

Retrieves journey data based on the specified criteria.

#### Request Headers

| Name         | Required | Description                            | Example              |
| ------------ | -------- | -------------------------------------- | -------------------- |
| Content-Type | ✓        | Set to application/json                | `application/json`   |
| x-api-key    | ✓        | API key from Admin Console application | `your-api-key-value` |

#### Request Body

| Name            | Required | Description                                                                         | Example                |
| --------------- | -------- | ----------------------------------------------------------------------------------- | ---------------------- |
| dateRange.start | ✓        | Start datetime in ISO 8601 format with timezone designator                          | `2025-03-01T00:00:00Z` |
| dateRange.end   | ✓        | End datetime in ISO 8601 format with timezone designator                            | `2025-03-10T00:00:00Z` |
| filters         | ☐        | Set of filter objects with name and values                                          | See filters section    |
| displayTimezone | ✓        | IANA timezone display name - the desired display timezone value for the time fields | `Europe/Bucharest`     |
| limit           | ☐        | Maximum number of records to return (default: 100)                                  | `50`                   |
| nextPageCursor  | ☐        | Cursor for pagination from previous response                                        | `encoded-cursor-value` |
| sortField       | ☐        | Field to sort by (default: `TIME`)                                                  | `TIME`                 |
| sortDirection   | ☐        | Sort direction, either `ASC` or `DESC` (default: `ASC`)                             | `DESC`                 |

> ⚠️ **Important: Date Range Filtering Behavior**
>
> The `dateRange` filter works as follows:
>
> - **For Journeys**: The API returns all journeys that have a `time` within the specified date range (between `start` and `end`)
> - **For Transitions**: The API returns ALL transitions belonging to journeys that started within the date range
>
> This means:
>
> - A journey is included if it started within the date range
> - All transitions for included journeys are returned, even if some transitions occurred after the `end` date
> - The `start` and `end` parameters define the search interval, NOT the duration of individual journeys or transitions
>
> **Example**: If you search for journeys between 9:00 AM and 10:00 AM, you'll get all journeys that started in that hour, along with ALL their transitions - even if some transitions happened at 11:00 AM or later.

> ⚠️ **Timerange Limit**
>
> **Note:** The maximum allowed timerange for any data retrieval request is **60 days**.
>
> For optimal performance consider using a timerange of 1 day or less. If you need to analyze data over a longer period, break your requests into multiple segments, each covering no more than 7 days.

#### Example Request

```json
{
  "dateRange": {
    "start": "2025-05-19T08:00:00+03:00",
    "end": "2025-05-19T16:00:00+03:00"
  },
  "filters": [
    {
      "name": "pbxNames",
      "values": [
        "yourPbxName"
      ]
    },
    {
      "name": "tenantIds",
      "values": [
        "yourTenantId"
      ]
    }
  ],
  "displayTimezone": "Europe/Bucharest",
  "limit": 50,
  "sortDirection": "DESC"
}
```

#### Example Response

```json
{
  "data": [
    {
      "time": "2025-03-10T13:33:42+02:00",
      "journeyId": "7b2429440d15183af1044dd47f1d447d",
      "interactions": [
        {
          "id": "int-196e53e066e-QNePASHISrp0D65MVgaNJYS13-phone-01-emeriaeurope01",
          "direction": "Inbound",
          "type": null
        }
      ],
      "agents": [
        {
          "name": "John Doe",
          "group": {
            "id": "101",
            "name": "ungroup"
          }
        }
      ],
      "channel": {
        "id": "441122334455",
        "name": "Support Line"
      },
      "contact": {
        "name": "+443335565567",
        "phoneNumber": "+449988776655",
        "email": "john.doe@8x8.com"
      },
      "direction": ["Outbound"],
      "transfersCompleted": 0,
      "forwardedToQueue": 0,
      "forwardedToRingGroup": 0,
      "forwardedToScript": 2,
      "handlingDuration": 0,
      "holdDuration": 0,
      "mediaTypes": [
        "Phone"
      ],
      "offeringDuration": 0,
      "outcome": "EndedInScript",
      "pbxNames": [],
      "queueAndRingGroupWaitDuration": 0,
      "queues": [],
      "queueWaitDuration": 0,
      "ringGroups": [],
      "ringGroupWaitDuration": 0,
      "scriptTreatmentDuration": 22266,
      "tenantIds": [
        "8x8"
      ],
      "wrapUpCodes": [],
      "wrapUpDuration": 0
    }
  ],
  "nextPageCursor": "ZW5jbLW5leHQtRlZC1jdXJzb3ItZm9ycGFnZQ==",
  "totalElements": 150
}
```

### Transitions Endpoint

```http
POST /v1/transitions/search
```

Retrieves transition data based on the specified criteria.

#### Request Headers

| Name         | Required | Description                            | Example              |
| ------------ | -------- | -------------------------------------- | -------------------- |
| Content-Type | ✓        | Set to application/json                | `application/json`   |
| x-api-key    | ✓        | API key from Admin Console application | `your-api-key-value` |

#### Request Body

Same structure as Journeys endpoint, but with transition-specific filters.

#### Example Request

```json
{
  "dateRange": {
    "start": "2025-05-21T00:00:00+03:00",
    "end": "2025-05-21T23:59:59+03:00"
  },
  "filters": [
    {
      "name": "transitions.name",
      "values": [
        "TRANSFER"
      ]
    }
  ],
  "displayTimezone": "Europe/Bucharest",
  "limit": 100
}
```

#### Example Response

```json
{
  "data": [
    {
      "journeyId": "3015ccfd5ebf8b2dcde38045ed30bc7",
      "transitions": [
        {
          "time": "2025-05-21T12:09:23.312+03:00",
          "name":"STARTED",
          "interactionId": "int-196f21ac6ef-d5eed30bc738045-phone-02-8x8",
          "agents": [],
          "previousAgents": [],
          "previousQueue": null,
          "previousRingGroup": null,
          "queue": null,
          "ringGroup": null,
          "duration": 0,
          "externalNumber": null,
          "mediaType": "Phone"
        },
        {
          "time": "2025-05-21T12:09:23.312+03:00",
          "name":"IN_SCRIPT",
          "interactionId": "int-196f21ac6ef-d5eed30bc738045-phone-02-8x8",
          "agents": [],
          "previousAgents": [],
          "previousQueue": null,
          "previousRingGroup": null,
          "queue": null,
          "ringGroup": null,
          "duration": 9206,
          "externalNumber": null,
          "mediaType": "Phone"
        },
        {
          "time": "2025-05-21T12:10:12.143+03:00",
          "name":"TRANSFER",
          "interactionId": "int-196f21ac6ef-d5eed30bc738045-phone-02-8x8",
          "agents": [
            {
              "name": "Jack Pott",
              "group": null
            }
          ],
          "previousAgents": [
            {
              "name": "Marsha Mellow",
              "group": null
            }
          ],
          "previousQueue": {
            "name": "Service Client"
          },
          "previousRingGroup": null,
          "queue": null,
          "ringGroup": null,
          "duration": 0,
          "externalNumber": "+441138413014",
          "mediaType": "Phone"
        }
      ]
    }
  ],
  "nextPageCursor": null,
  "totalElements": 1
}
```

## Filters

Filters allow you to narrow down the data returned by the API based on specific criteria. Different filter types are available for journeys and Transitions endpoints.

### Journey Filters

| Filter Name         | Description                 | Example Values                     |
|---------------------|-----------------------------| ---------------------------------- |
| `agents.group.id`   | Filter by agent group IDs   | `["group1", "group2"]`             |
| `agents.group.name` | Filter by agent group names | `["Team A", "Team B"]`             |
| `agents.name`       | Filter by agent names       | `["John Doe", "Jane Smith"]`       |
| `interactions.id`   | Filter by interaction ID    | `["interaction-123"]`              |
| `mediaTypes`        | Filter by media types       | `["phone", "chat", "email"]`       |
| `pbxNames`          | Filter by PBX names         | `["pbx1", "pbx2"]`                 |
| `queues.name`       | Filter by queue names       | `["support", "sales"]`             |
| `ringGroups.name`   | Filter by ring group names  | `["group1", "group2"]`             |
| `journeyId`         | Filter by journey ID        | `["journey-123"]`                  |
| `tenantIds`         | Filter by tenant IDs        | `["tenant1", "tenant2"]`           |
| `wrapUpCodes`       | Filter by wrap-up codes     | `["Service Call", "Support Call"]` |

### Transition Filters

| Filter Name                          | Description                    | Example Values            |
|--------------------------------------|--------------------------------| ------------------------- |
| `transitions.agents.name`            | Filter by agent names          | `["John Doe"]`            |
| `transitions.interactionId`          | Filter by interaction ID       | `["interaction-123"]`     |
| `pbxNames`                           | Filter by PBX names            | `["pbx1"]`                |
| `transitions.previousAgents.name`    | Filter by previous agents      | `["Marsha Mellow"]`       |
| `transitions.previousQueue.name`     | Filter by previous queues      | `["Support S2"]`          |
| `transitions.previousRingGroup.name` | Filter by previous ring groups | `["1015"]`                |
| `transitions.queue.name`             | Filter by queue name           | `["Support S1"]`          |
| `transitions.ringGroup.name`         | Filter by ring group name      | `["1011"]`                |
| `journeyId`                          | Filter by journey ID           | `["journey-123"]`         |
| `tenantIds`                          | Filter by tenant IDs           | `["tenant1"]`             |
| `transitions.name`                   | Filter by transition name      | `["TALKING", "TRANSFER"]` |

### Filter Format

Filters are provided as an array of objects in the request body:

```json
{
  "filters": [
    {
      "name": "agents.name",
      "values": [
        "John Doe",
        "Marsha Mellow"
      ]
    },
    {
      "name": "mediaTypes",
      "values": [
        "phone"
      ]
    }
  ]
}
```

> 📘 **Automatic Default Filtering**
>
> If no `pbxNames` or `tenantIds` filters are provided, the system automatically applies filters based on the authorized PBXs and tenants for your API key.

## Pagination

The API uses cursor-based pagination to efficiently navigate through large result sets. Here's how it works:

1. Make an initial request with a desired `limit` value in the request body (default is 100)
2. The response includes a `nextPageCursor` if there are more records available
3. To retrieve the next page, include the `nextPageCursor` in your next request body
4. Continue this process until `nextPageCursor` is null, indicating no more pages

### Pagination Example

Initial request:

```json
{
  "dateRange": {
    "start": "2025-05-19T00:00:00Z",
    "end": "2025-05-19T23:59:59Z"
  },
  "displayTimezone": "UTC",
  "limit": 100
}
```

Response with next page cursor:

```json
{
  "data": [
    /* 100 records */
  ],
  "nextPageCursor": "encoded-cursor-value",
  "totalElements": 250
}
```

Next page request:

```json
{
  "dateRange": {
    "start": "2025-05-19T00:00:00Z",
    "end": "2025-05-19T23:59:59Z"
  },
  "displayTimezone": "UTC",
  "limit": 100,
  "nextPageCursor": "encoded-cursor-value"
}
```

Last page response:

```json
{
  "data": [
    /* remaining records */
  ],
  "nextPageCursor": null,
  "totalElements": 250
}
```

## Sorting

The API supports sorting of results through two parameters in the request body:

- `sortField`: Specifies which field to sort by (default: `TIME`)
  > ℹ️ **Note:** Currently, TIME is the only available sortField.
- `sortDirection`: Specifies the sort order, either `ASC` (ascending) or `DESC` (descending) (default: `ASC`)

Example:

```json
{
  "dateRange": {
    "start": "2025-05-19T00:00:00Z",
    "end": "2025-05-19T23:59:59Z"
  },
  "displayTimezone": "UTC",
  "sortField": "TIME",
  "sortDirection": "DESC"
}
```

## Data Models

### Journey Data Model

The Journeys Endpoint provides a consolidated view of all customer interactions belonging to the same journey across all 8x8 platforms. Each journey record includes the following structure:

| Field                           | Type           | Description                                                                                                                                                                                                                                                                      |
|---------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `time`                          | ISO8601 date   | When the journey occurred                                                                                                                                                                                                                                                        |
| `journeyId`                     | string         | The journeyId field returned by the Journeys Endpoint uniquely identifies and aggregates all interactions associated with a particular customer journey across all platforms. Use this journeyId to correlate and analyze comprehensive interaction data for a specific journey. |
| `interactions`                  | Interaction\[] | Array of interaction objects representing the interactions belonging to the journey. These interactions can originate from CC, UC or Engage platforms.                                                                                                                           |
| `agents`                        | Agent\[]       | Array of agent objects involved in the journey                                                                                                                                                                                                                                   |
| `channel`                       | Channel        | Channel object containing ID and name of the initial CC channel                                                                                                                                                                                                                  |
| `contact`                       | Contact        | Contact object containing name, phone number, and email                                                                                                                                                                                                                          |
| `transfersCompleted`            | int            | Number of warm & blind transfers during the journey                                                                                                                                                                                                                              |
| `forwardedToQueue`              | int            | Number of automated forwards to a CC or UC queue during the journey                                                                                                                                                                                                              |
| `forwardedToRingGroup`          | int            | Number of automated forwards to a Ring Group during the journey                                                                                                                                                                                                                  |
| `forwardedToScript`             | int            | Number of automated forwards to a UC AA + CC script/IVR                                                                                                                                                                                                                          |
| `handlingDuration`              | long           | Total handling time in milliseconds (aggregates Chat Time+Mute Time+Hold Time across all platforms)                                                                                                                                                                              |
| `holdDuration`                  | long           | Total hold time in milliseconds                                                                                                                                                                                                                                                  |
| `mediaTypes`                    | string\[]      | Types of media in the journey (phone, chat, email, etc.)                                                                                                                                                                                                                         |
| `offeringDuration`              | long           | Ringing/offering duration to all agents/users involved in the journey in milliseconds                                                                                                                                                                                            |
| `outcome`                       | string         | Outcome of the journey (e.g. abandoned, handled, forwarded to VM).                                                                                                                                                                                                               |
| `direction`                     | string         | Direction of the journey (e.g. Inbound, Outbound, Internal).                                                                                                                                                                                                                     |
| `pbxNames`                      | string\[]      | PBX names                                                                                                                                                                                                                                                                        |
| `queueAndRingGroupWaitDuration` | long           | Sum of queueWaitDuration and ringGroupWaitDuration                                                                                                                                                                                                                               |
| `queues`                        | Queue\[]       | Array of queue objects used in the journey                                                                                                                                                                                                                                       |
| `queueWaitDuration`             | long           | Aggregated queue wait time from all platforms in milliseconds                                                                                                                                                                                                                    |
| `ringGroups`                    | RingGroup\[]   | Array of ring group objects used in the journey                                                                                                                                                                                                                                  |
| `ringGroupWaitDuration`         | long           | UC Ring Group wait time in milliseconds                                                                                                                                                                                                                                          |
| `scriptTreatmentDuration`       | long           | Total time spent by the caller in the IVR or Auto-Attendant until the interaction entered a queue                                                                                                                                                                                |
| `tenantIds`                     | string\[]      | Tenant IDs                                                                                                                                                                                                                                                                       |
| `wrapUpCodes`                   | string\[]      | Wrap-up codes applied to the journey                                                                                                                                                                                                                                             |
| `wrapUpDuration`                | long           | Time spent in wrap-up in milliseconds (aggregates wrap-up duration from all platforms)                                                                                                                                                                                           |

#### Nested Object Structures

**Interaction Object:**

```json
{
  "id": "string",
  "direction": "string",
  "type": "string"
}
```

**Agent Object:**

```json
{
  "name": "string",
  "group": {
    "id": "string",
    "name": "string"
  }
}
```

**Contact Object:**

```json
{
  "name": "string",
  "phoneNumber": "string",
  "email": "string"
}
```

**Channel Object:**

```json
{
  "id": "string",
  "name": "string"
}
```

**Queue Object:**

```json
{
  "name": "string"
}
```

**RingGroup Object:**

```json
{
  "name": "string"
}
```

### Transition Data Model

The Transitions Endpoint provides detailed information about each state change within a journey, allowing users to track
the exact journey path. Journeys are identified with the *journeyId*. Each transition record includes:

| Field               | Type         | Description                                                |
|---------------------| ------------ |------------------------------------------------------------|
| `time`              | ISO8601 date | When the transition occurred                               |
| `journeyId`         | string       | ID of the parent journey                                   |
| `name`              | string       | Name of the transition (e.g., WAITING, TALKING, TRANSFER)  |
| `interactionId`     | string       | ID of the interaction                                      |
| `agents`            | Agent\[]     | Array of agent objects (if applicable)                     |
| `previousAgents`    | Agent\[]     | Array of previous agent objects (if applicable)            |
| `previousQueue`     | Queue        | Previous queue object (if applicable)                      |
| `previousRingGroup` | RingGroup    | Previous ring group object (if applicable)                 |
| `queue`             | Queue        | Queue object (if applicable)                               |
| `ringGroup`         | RingGroup    | Ring group object (if applicable)                          |
| `duration`          | long         | Duration of this specific transition state in milliseconds |
| `externalNumber`    | string       | External number (if applicable)                            |
| `mediaType`         | string       | Media type (phone, chat, email, etc.)                      |

### Transition States

A journey can progress through multiple transition states:

- **STARTED**: A customer has initiated an interaction using a Contact Center channel.
- **IN_SCRIPT**: The customer is interacting with a script like an IVR script or an auto-attendant.
- **WAITING**: The customer is waiting to be handled by an agent (e.g. waiting in a queue or while the phones in a ring group are being ringed etc.).
- **TALKING**: An agent is interacting with the customer.
- **HOLD**: An agent has put the call on hold (e.g. while the agent is preparing a transfer).
- **OUTBOUND_CALL_INITIATED**: Outbound call has been initiated
- **TRANSFER**: The customer interaction is transferred to another destination. Destinations can be *another agent*, *queue/ring group* or *another phone number*. The properties *agents*, *queue*, *ringGroup* and *externalNumber* contain the destination of the transfer. The properties *previousAgents*, *previousQueue* and *previousRingGroup* contain the origin of the transfer.
- **FINISHED**: The customer interaction has ended.

### Journey Outcomes

The `outcome` field in the Journeys API response summarizes the result of a customer journey. The outcome is determined by analyzing all underlying interaction outcomes and the total handling duration, using the following logic:

- **Handled**: The journey is considered handled if any interaction outcome is `Handled` or `Accepted`, or if the total handling duration is greater than zero.
- **Abandoned**: The journey is considered abandoned if any interaction outcome is `Abandoned` and the total handling duration is zero.
- **EndedInScript**: The journey ended in an IVR or script if any interaction outcome is `EndedInScript`.
- **Other**: If none of the above apply, but at least one interaction outcome matches a known outcome type, the journey is marked as `Other`.
- **UnknownOutcome**: If no known outcome is found, the journey is marked as `UnknownOutcome`.

#### Possible Outcome Values

| Value            | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| `Handled`        | The journey was successfully handled by an agent or user.                               |
| `Abandoned`      | The journey was abandoned by the customer before being handled.                         |
| `EndedInScript`  | The journey ended in an IVR script or auto-attendant without reaching an agent or user. |
| `Other`          | The journey ended with an outcome not covered by the above categories.                  |
| `UnknownOutcome` | The outcome could not be determined from the available data.                            |

## Error Handling

The API returns standard HTTP status codes and an error response body:

```json
{
  "errors": [
    {
      "message": "Error message description",
      "suggestion": "Suggested action to resolve the error",
      "url": "https://developer.8x8.com/analytics/docs/end-to-end-journey-api#invalid-pbx-invalidpbx"
    }
  ]
}
```

### Common Errors

| HTTP Status Code | Description                               |
| ---------------- | ----------------------------------------- |
| 400              | Bad Request - Invalid input parameters    |
| 401              | Unauthorized - Invalid or missing API key |
| 403              | Forbidden - Insufficient permissions      |
| 404              | Not Found - Resource not found            |
| 429              | Too Many Requests - Rate limit exceeded   |
| 500              | Internal Server Error - Server-side error |

## Error Codes

This section provides detailed explanations for each error code that the API might return. Each error header is linkable  
via its anchor for easy navigation within the documentation.

### Invalid PBX {#invalidPbx}

This error occurs when one or more PBX names provided in the filter do not belong to the authenticated customer's  
account. It ensures that users cannot request data for PBXes that are not associated with their account.

### Invalid Tenant {#invalidTenant}

This error is returned when the tenant IDs specified in the filter are not recognized as belonging to the current  
customer's account. It helps maintain data integrity by restricting access only to authorized tenant information.

### Malformed Request {#malformedRequest}

This error indicates that the request payload is not properly structured. It may be due to invalid JSON syntax or an  
incorrect structure that does not conform to the API specification.

### Bad Request {#badRequest}

A generic error indicating that the request is invalid. This can be caused by missing required fields, incorrect data  
types, or any other violation of the API’s requirements.

### Date Range Not Null {#dateRangeNotNull}

This error is raised when the date range parameter is missing from the request. A valid date range is required to  
determine the period for which the data should be retrieved.

### Start Date Not Null {#startRangeNotNull}

This error occurs when the start date of the date range is not provided. The API requires a valid start date to define  
the beginning of the data retrieval period.

### End Date Not Null {#endRangeNotNull}

This error is returned if the end date of the date range is missing. A valid end date is needed to mark the conclusion  
of the period for which data is requested.

### End Date Before Start Date {#endDateBeforeStartDate}

This error occurs when the provided start date is later than the end date. The API expects the start date to precede the  
end date to form a valid interval.

### Filters Not Empty {#filtersNotEmpty}

This error is triggered when the filters array is empty. At least one filter must be supplied to narrow down the data  
and make the query meaningful.

### ISO 8061 With Timezone Format {#iso8061WithTzFormat}

This error is raised when a date does not conform to the ISO 8601 format with a timezone designator (for example,  
`2025-03-01T00:00:00Z`). Correct date formatting is required for proper parsing.

### Max Interval {#maxInterval}

This error indicates that the interval between the start and end dates exceeds the maximum allowed period. The user  
should specify a smaller date range to process the request successfully.

### Filter Values Not Empty {#filterValuesNotEmpty}

This error is returned when a filter is provided without any associated values. Each filter must include at least one  
value to effectively narrow down the data.

### Invalid Filter Type {#invalidFilterType}

This error occurs when the filter type specified in the request is not among the supported types. Users must ensure that  
only valid filter types are used.

### Timezone Not Null {#timezoneNotNull}

This error is raised when the displayTimezone parameter is missing. A valid IANA timezone identifier must be provided to  
ensure accurate time-based data processing.

### Invalid Timezone {#invalidTimezone}

This error is thrown if the provided timezone does not match any recognized IANA timezone. Users should verify and  
provide a valid timezone identifier.

### Invalid Sort Direction {#invalidSortDirection}

This error occurs when the sort direction is neither `asc` nor `desc`. The API only accepts these two values for sorting  
order.

### Invalid Sort Field {#invalidSortField}

This error is returned when the sort field specified is not supported. At the moment, only the `TIME` field is available  
for sorting results.

### Invalid Limit {#invalidLimit}

This error indicates that the limit parameter is out of the acceptable range (typically between 1 and 1000). Users  
should adjust the limit to a valid number within the allowed range.

### Invalid Cursor {#invalidCursor}

This error is raised when the pagination cursor provided in the request is invalid. The cursor must be the one returned  
from a previous valid request.

### Cursor And Sort Mismatch {#cursorAndSortMismatch}

This error indicates that the sort field or direction associated with the provided cursor does not match the current  
request parameters. Ensure that the cursor is used with the same sort settings as those in the original response.

### Missing PBX For Customer {#missingPbxForCustomer}

This error is thrown when the authenticated customer’s account does not have an associated PBX. The user should contact  
their account administrator to have a PBX linked to their account.

### Invalid Endpoint {#invalidApiPath}

This error occurs when the requested API endpoint does not exist or is not recognized by the API.

Please verify the endpoint against the valid paths listed in the `API Endpoints` section above.

### Invalid Request Method {#invalidRequestMethod}

This error is returned when the HTTP method used in the request does not match the expected method for the endpoint.

Please ensure you are using the correct HTTP method (e.g., POST) as specified in the `API Endpoints` section above.

## Rate Limiting

The API implements rate limiting to protect system resources. When rate limits are exceeded, the API returns a 429  
status code with a Retry-After header indicating when you can try again.

## Use Cases

### 1. End-to-End Customer Journey Analysis

For organizations with complex call flows that span multiple platforms (such as transferred calls between contact center
agents and back-office teams), this API provides a complete view of the customer journey.

#### Implementation Steps

1. Retrieve journey data:

```http
POST /v1/journeys/search
```

```json
{
  "dateRange": {
    "start": "2025-05-19T08:00:00+03:00",
    "end": "2025-05-19T23:00:00+03:00"
  },
  "filters": [
    {
      "name": "pbxNames",
      "values": [
        "mainPbx"
      ]
    }
  ],
  "displayTimezone": "Europe/Paris",
  "limit": 50
}
```

2. For detailed journey analysis, retrieve transition data using the journeyId from the journeys response:

```http
POST /v1/transitions/search
```

```json
{
  "dateRange": {
    "start": "2025-05-19T08:00:00+03:00",
    "end": "2025-05-19T23:00:00+03:00"
  },
  "filters": [
    {
      "name": "journeyId",
      "values": [
        "journey-123"
      ]
    }
  ],
  "displayTimezone": "Europe/Paris",
  "sortDirection": "ASC"
}
```

### 2. Transfer Pattern Analysis

For organizations that want to understand how calls are being transferred between systems and analyze transfer patterns.

#### Implementation Steps

1. Retrieve all transfer transitions:

```http
POST /v1/transitions/search
```

```json
{
  "dateRange": {
    "start": "2025-05-19T00:00:00+03:00",
    "end": "2025-05-19T23:59:59+03:00"
  },
  "filters": [
    {
      "name": "transitions.name",
      "values": [
        "TRANSFER"
      ]
    }
  ],
  "displayTimezone": "Europe/Paris",
  "limit": 100
}
```

### 3. Queue Performance Analysis

For analyzing queue performance across different platforms.

#### Implementation Steps

1. Retrieve journey data filtered by queues:

```http
POST /v1/journeys/search
```

```json
{
  "dateRange": {
    "start": "2025-05-19T00:00:00+03:00",
    "end": "2025-05-19T23:59:59+03:00"
  },
  "filters": [
    {
      "name": "queues.name",
      "values": [
        "support",
        "sales",
        "technical"
      ]
    }
  ],
  "displayTimezone": "Europe/Paris",
  "limit": 100
}
```

## Best Practices

1. **Use appropriate date ranges**: Keep date ranges reasonably small (ideally less than 1 day) to improve  
   performance. For longer historical analysis, consider breaking your requests into multiple segments.

2. **Apply relevant filters**: Use filters to narrow down results and improve response times.

3. **Handle pagination properly**: Always check for the `nextPageCursor` and fetch all pages when needed.

4. **Respect rate limits**: Implement appropriate retry mechanisms with backoff when encountering rate limiting.

5**Cache results when appropriate**: For frequently accessed data that doesn't change often, consider caching on your  
side.

6**Handle errors gracefully**: Check for error responses and retry with backoff for transient errors.

## API Glossary

### Time Representations

All times in the API are represented in ISO 8601 format with timezone designator (e.g., `2025-03-01T00:00:00Z`).  
The displayTimezone specified in your request is only used for displaying purposes.

### Duration Metrics

All duration metrics (handling time, wait time, etc.) are provided in milliseconds.

### Media Types

- **phone**: Phone interactions
- **chat**: Chat interactions
- **email**: Email interactions

### Interaction Direction

- **inbound**: Customer-initiated interactions
- **outbound**: Agent-initiated interactions
- **internal**: Internal interactions (e.g., between agents)

### PBX and Tenant IDs

PBX names and tenant IDs are used for filtering and represent the 8x8 platform instances your organization uses.

## Further Assistance

For additional support or questions about the CIDP Journey API, please contact your 8x8 representative or submit a
support ticket through the 8x8 support portal.
