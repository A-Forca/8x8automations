# Audit Records

## Overview

As an administrator, you may need to access the audits across some 8x8 services.  

Currently, administrator can retrieve audit records of following services:

* **platform** - **create**, **delete** and **update** events in platform service.

The Audit records API currently supports following HTTP methods:

* **GET** is supported to retrieve audit records.

### 1. Get Audits

This GET method paginates the audit records using scrollId. It provides an option to filter based on given query parameters. The sorting by attributes is not supported.

#### Base URL

* [https://api.8x8.com/administration/audit/v1/audits](https://api.8x8.com/administration/audit/v1/audits)

#### Parameters

**Method: GET**

#### Headers

| Name         | Required | Description                                                                              | Example                       |
| ------------ | -------- | ---------------------------------------------------------------------------------------- | ----------------------------- |
| x-api-key    | ✓        | API Credential Key from the [Admin Console Process](/analytics/docs/how-to-get-api-keys) | eght_Abcdhfakdlbdfsjkbskzkmxl |
| content-type | ✓        | application/json                                                                         | application/json              |

#### Query

| Name        | Required | Description                                                                                                                                                                                                            | Example                                |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| startTime   | ✓        | Start time for audit records (ISO 8601 format), it should be a maximum of 31 days before end time.                                                                                                                     | 2022-12-16T18:30:00.000Z               |
| endTime     | ✓        | End time of audit records (ISO 8601 format).                                                                                                                                                                           | 2023-01-16T18:30:00.000Z               |
| service     | ✓        | Name of a service that generated audit records.                                                                                                                                                                        | platform                               |
| displayName | ☐        | Name linked with entity i.e, if an entity is user it's userName, if an entity is RingGroup it is a ring group name. It also allows search using starts with(\*abc) and ends with(abc\*) wildcards.                     | \*Ring Group\*                         |
| eventTypes  | ☐        | Comma-separated strings of event types.                                                                                                                                                                                | create, delete, view                   |
| entityTypes | ☐        | Comma-separated strings of entity types.                                                                                                                                                                               | user, ringgroup, extension             |
| auditUserId | ☐        | The identifier of a user who performed an audits action.                                                                                                                                                               | HTHiKjDEFfK7X03ABCj_IQ                 |
| size        | ☐        | Maximum number of items per page. It must be greater than zero. Default value is 20, maximum is 100.                                                                                                                   | 1                                      |
| scrollId    | ☐        | The scrollId parameter returned from your previous call. You can include this parameter in your next or subsequent calls to retrieve the next page of records. To retrieve the first page no need to provide scrollId. | 012345677-89abb-cdef-0123-456789abcdef |

#### Full Request Example

```bash
curl --location 'https://api.8x8.com/administration/audit/v1/audits?
size=1&
startTime=2023-05-01T18:30:00.000&
endTime=2023-05-31T23:59:59.651&
service=platform&
displayName=*Bes*&
auditUserId=DctVyxEFR86EYyyDFoSLNA&
entityTypes=RingGROUP, Agentgroup&
eventTypes=create, update&
scrollId=6bca6d01-774c-4115-8a03-eff95f430b06' \ 
--header 'x-api-key:eght_etk_039jfadf98j3f9a8jfa098fj3' \ 
--header 'Accept: application/json'

```

> 📘 **'scrollId' In Request**
>
> Above request retrieves page with scrollId in query parameter, if you want to get the first page don’t provide scrollId.
>
>

#### Response

```json
{
    "meta": {
        "totalRecordCount": 1,
        "scrollId": "1fc519a4-2008-4234-b720-9cfdaf8866e6"
    },
    "data": [
        {
            "id": "1fc519a4-2008-4234-b720-9cfdaf8866e6",
            "displayName": "test_bes",
            "customerId": "bes-tests-functional1",
            "auditTimestamp": "2023-05-02T20:57:34.956+00:00",
            "eventType": "create",
            "service": "platform",
            "entityType": "AgentGroup",
            "entityKey": "100",
            "auditUserId": "UgDHZNAZTduIVLE5lkjOkg",
            "impersonator": null,
            "details": "{\"id":41, \"name\":\"ungroup\",
                       \"agent_count\":13 }",
            "correlationType": null,
            "correlationId": null
        }
    ]
}

```

> 📘 **'scrollId' In Response**
>
> When a user gets **scrollId null in response** it would mean there is **no more data to retrieve** for a given request. Thus, the **scrollId value equal to null in response** implies the **last page**.
>
>

#### Response body fields description

| Name            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| displayName     | The human readable form of the entityKey (where applicable). E.g., If the entityType is “user”, this will contain the user’s first and last name.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| auditTimestamp  | The date/time (in UTC) when the event was registered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| eventType       | Specifies how the event changed/accessed the entity: create, update, delete, view, export.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| service         | Specifies which 8x8 service was involved in the event. At time of writing, only “platform” is available; “platform” refers to changes made in the 8x8 Admin Console.                                                                                                                                                                                                                                                                                                                                                                                                       |
| entityKey       | The identifier of the entity that was changed/accessed in this audit event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| entityType      | Specifies the type of entity that was changed/accessed in this audit event. E.g., user, extension, call forwarding.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| auditUserId     | The identifier of the user who made the change (or accessed the record).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Impersonator    | In rare cases where 8x8 agents make changes on behalf of customers (e.g., as a result of a support request), the impersonator column will contain the identifier of the user who made the change.                                                                                                                                                                                                                                                                                                                                                                          |
| details         | Contains the detailed information on which attributes of the changed entity were updated. This field is in JSON representation: <br />{<br />"new":{<br />"changedAttributeName":"new value",<br />"newAttributeName":"added value"<br />},<br />"old":{<br />"changedAttributeName":"old value",<br />"deletedAttributeName":"deleted value"<br />}<br />}<br />The “new” object contains all of the newly-added attributes and the new value of changed attributes<br />The “old” object contains all of the deleted attributes and the old value of changed attributes. |
| correlationType | When several changes are made to various entities as part of one change set, the correlationType displays the parent entity type. E.g., if an extension was assigned to a user during a user creation flow, the entityType would be “extension” and the correlationType would be “user”.                                                                                                                                                                                                                                                                                   |
| correlationId   | The identifier of the parent entity of this change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
