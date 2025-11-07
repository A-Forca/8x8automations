# CC Realtime Statistics

> 📘 **You will need a working API key to begin**
>
> [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
>

The base URL is region specific, based on the location of your Contact Center tenant.

* United States: `https://api.8x8.com/analytics/cc/{version}/realtime-metrics/`
* Europe: `https://api.8x8.com/eu/analytics/cc/{version}/realtime-metrics/`
* Asia-Pacific: `https://api.8x8.com/au/analytics/cc/{version}/realtime-metrics/`
* Canada: `https://api.8x8.com/ca/analytics/cc/{version}/historical-metrics/`
* {version} to be replaced by current Version. As of October 2022 this is 5 resulting in /v5/

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

## 3. Available Data

Realtime data is available as follows definitions for metrics can be found in the [glossary](https://docs.8x8.com/8x8WebHelp/8x8Analytics/Content/VCCAnalytics/Glossary.htm)

* Queue Statistics
  * for multiple queues
  * for single queue
* Agents Statistics
  * by Queue
  * by multiple Queues
  * by Group
* Group Statistics
  * for multiple groups
  * for single group

## 4. Accessing Realtime Queue Metrics

> 📘 **Sample is for a multiple queues**
>
> For a single queue add /{queue-id} to the url.
>
> See [additional endpoints](/analytics/docs/cc-realtime-statistics#additional-endpoints) for examples for the other endpoints
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
| version | ✓ | The current version is `v<\<versionCCARealtime\>>` | v5 |
| queue-id | ☐ | If a queue id is specified as a path parameter this limits the response to a single queue and queue-ids query parameter is ignored. Sample /queues/{queue-id} | /103 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| page | ☐ | Page of the result set to return. Begins at zero (0). Default is zero. See [pagination](/analytics/docs/cc-realtime-statistics#pagination) for more details | 0 |
| size | ☐ | The number of records per page to return. Default is 100. See [pagination](/analytics/docs/cc-realtime-statistics#pagination) for more details | 100 |
| queue-ids | ☐ | When not passed all queues are returned. Specifies the queue-ids of the queues to be returned. For multiple queues add multiple times. `&queue-ids=101&queue-ids=107`. Only valid queue-ids can be passed. Passing an invalid queue-id will result in a failure. Ignored if /queue-id is passed as a path parameter. See [passing multiple ids](/analytics/docs/cc-realtime-statistics#passing-multiple-ids) for more information | 103 |
| metrics | ✓ | When not passed all metrics are returned. Specifies the metrics to return. For multiple metrics add mutiple times. &metrics=handling.rt&metrics=entered.today. See [metrics](/analytics/docs/cc-realtime-statistics#metrics) for more details |  |
| timezone | ☐ | Only applies to .today metrics. The desired timezone ([IANA Time Zones](https://www.iana.org/time-zones). Examples America/New_York, Europe/Helsinki [Wikipedia Time Zone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)). Accepted timezone values are those that are configured for the tenant. The value can be the tenant’s default timezone or a value defined as an optional timezone. If no value is specified, the tenant’s default timezone is used | Europe/Helsinki |
| summary | ☐ | Default false. **If set to true queue-ids and metrics parameters are ignored** and a list of queue-id and queue-name is returned | false |
| includeTotals | ☐ | If this parameter is set to `true`, at the end of each sections with the totals for time, percentage, average and count metric type will be added at the end of sections in the response. Default false. See [includeTotals](/analytics/docs/cc-realtime-statistics#includetotals) for more information. | false |

#### Metrics

To get a full list of metrics for one of the endpoints call it without the metrics parameter. This will list all available metrics. Generally it's easier to specify the metrics you wish returned to have a more compact response.

Realtime metrics are a snapshot of the current condition of the contact center. The naming convention of the metrics is aaa.bbb where aaa is the meric and bbb is the period of the metric.

#### Periods explained

* ".rt" - means realtime meaning currently. Example: there are currently X calls waiting in queue

Summary metrics are over one of 3 provided ranges

* ".int-15m" means in the most recent 15 minute interval.
* ".int-30m" means in the most recent 30 minute interval
* ".today" - is for the calendar day. X calls have entered the queue today.

#### pagination

page starts with zero (0).

The maximum page size is 1000 if you specify a `size` above 1000 you will receive

**400 Bad Request**

```json
{
    "message": "Bad request: Field 'size' must be less than or equal to 1000"
}

```

Responses will include the following headers related to pagination

| Header | Description | Example |
| --- | --- | --- |
| X-Page-Size | Page size requested, default 100 | 100 |
| X-Page | Current Page | 0 |
| X-Total-Pages | Count of all pages, remember `page` parameter and X-Page are zero based so if X-Total-Pages is 13 the last page is = 12 | 12 |
| X-Total-Elements | Total number of records | 1223 |

If a page beyond the end of the result set is specified the response will be as follows

HTTP STATUS : 400

Beyond last page

```json
{
    "message": "Bad request: Field 'page' must be greater than or equal to 0 and less than the total number of pages, which is 2 for this request"
}

```

### Realtime Data Request

In this example the data returned will only be for queue id is 103 and 170 and the only metrics returned will be handling.rt and metrics=entered.today

queuesgroups

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/queues?page=0&size=100&queue-ids=101&queue-ids=107&metrics=handling.rt&metrics=entered.today' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/vv<\<versionCCARealtime\>>/realtime-metrics/groups?page=0&size=100&group-ids=102&group-ids=1023&metrics=availableIdle.rt&metrics=enabled.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

### Realtime Data Response

Note the response headers related to [pagination](/analytics/docs/cc-realtime-statistics#pagination) above.

#### Body

queuesgroups

```json
[
    {
        "id": "103",
        "name": "Appointments",
        "metrics": [
            {
                "key": "entered.today",
                "value": 7
            },
            {
                "key": "handling.rt",
                "value": 0
            }
        ]
    },
    {
        "id": "107",
        "name": "Tickets",
        "metrics": [
            {
                "key": "entered.today",
                "value": 6
            },
            {
                "key": "handling.rt",
                "value": 0
            }
        ]
    }
]

```

```json
[
    {
        "id": "102",
        "name": "Sales",
        "metrics": [
            {
                "key": "availableIdle.rt",
                "value": "0"
            },
            {
                "key": "enabled.rt",
                "value": "0"
            }
        ]
    },
    {
        "id": "1023",
        "name": "Deliveries",
        "metrics": [
            {
                "key": "availableIdle.rt",
                "value": "0"
            },
            {
                "key": "enabled.rt",
                "value": "0"
            }
        ]
    }
]

```

## Additional Endpoints

> 📘 **Core Parameters and structure are common**
>
> The following examples don't show every parameter refer to [parameters](/analytics/docs/cc-realtime-statistics#parameters) above.
>
> Metrics, timezone etc. are all available on each endpoint
>
>

The core parameters and structure are common to all of the following endpoints. Which allow for selecting specific queue, groups and agents. The available metrics for queues, groups, agents within queues and agents within groups vary.

### Single Queue

`/realtime-metrics/queues/{queue-id}`

#### Path Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| queue-id | ✓ | Single queue id to return data for | 103 |

#### Single Queue Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/queues/101?&metrics=handling.rt&metrics=entered.today' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Single Queue Response

```json
[
    {
        "id": "103",
        "name": "Appointments",
        "metrics": [
            {
                "key": "entered.today",
                "value": 7
            },
            {
                "key": "handling.rt",
                "value": 0
            }
        ]
    }
]

```

### Agents within a Queue

`/realtime-metrics/queues/{queue-id}/agents`

#### Path Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| queue-id | ✓ | Single queue id to return agents for | 103 |

#### Query Parameter

`agent-ids` can be passed similarly to queue-ids in the prior example.

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| agent-ids | ☐ | When not passed all agents are returned. Specifies the agent-ids of the agents to be returned. For multiple agents add multiple times. `&agent-ids=agfAl1ZjIyQ8ecpoCB9KUbbb&agent-ids=agk4tyf8vnSMWki8r4e0dfff`. Only valid agent-ids can be passed. Passing an invalid agent-id will result in a failure. | 103 |

#### Agents within a Queue Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/queues/{queue-id}/agents?page=0&size=100&agent-ids={agent-id1}&agent-ids={agent-id2}&metrics=status.rt,statusCode.rt,timeOnStatus.rt,lastLogin.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Agents within a Queue Response

```json
[
    {
        "id": "agAD21EBR1RhuV2TNDivaaa",
        "name": "Jane Li",
        "metrics": [
            {
                "key": "lastLogin.rt",
                "value": "2022-12-16T16:28:08.013Z"
            },
            {
                "key": "status.rt",
                "value": "LoggedOut"
            },
            {
                "key": "statusCode.rt",
                "value": null
            },
            {
                "key": "timeOnStatus.rt",
                "value": 245611272
            }
        ]
    },
    {
        "id": "agAQDqmvKiRbG4ekigNSbbbbb",
        "name": "James Woods",
        "metrics": [
            {
                "key": "lastLogin.rt",
                "value": "2022-12-02T17:32:31.299Z"
            },
            {
                "key": "status.rt",
                "value": "Available"
            },
            {
                "key": "statusCode.rt",
                "value": null
            },
            {
                "key": "timeOnStatus.rt",
                "value": 1469499666
            }
        ]
    }
]

```

### Single Agent within a Queue

`/realtime-metrics/queues/{queue-id}/agents/{agent-id}`

#### Path Parameters

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| queue-id | ✓ | A queue the agent is a member of | 103 |
| agent-id | ✓ | The agent requested within the queue | agAD21EBR1RhuV2TNDivaaa |

#### Single Agent within a Queue Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/queues/{queue-id}/agents/{agent-id}?metrics=status.rt,statusCode.rt,timeOnStatus.rt,lastLogin.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Single Agent within a Queue Response

```json
[
    {
        "id": "agAD21EBR1RhuV2TNDivaaa",
        "name": "Jane Li",
        "metrics": [
            {
                "key": "lastLogin.rt",
                "value": "2022-12-16T16:28:08.013Z"
            },
            {
                "key": "status.rt",
                "value": "LoggedOut"
            },
            {
                "key": "statusCode.rt",
                "value": null
            },
            {
                "key": "timeOnStatus.rt",
                "value": 245611272
            }
        ]
    }
]

```

### Agents within a Group of Queues

> 🚧 **This endpoint ONLY returns information for agents/queues that have been had activity or a session in the current day.**
>
>

`/realtime-metrics/agents-in-queue-groups`

#### Query Parameter

`queue-ids` can be passed similarly to queue-ids in the prior example.

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| queue-ids | ☐ | When not passed all queues are returned. Specifies the queue-ids of the queues to be returned. For multiple queues add multiple times. `&queue-ids=101&queue-ids=102`. Only valid queue-ids can be passed. Passing an invalid queue-id will result in a failure. | 103 |

Sample request limited to two queues and just three of the available metrics (Two agent related and one queue related)

#### Agents within a Queue Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/agents-in-queue-groups?metrics=status.rt,timeOnStatus.rt,accepted.today.inQueue&queue-ids={queue-id-1}&queue-ids={queue-id-2}&page=0&size=100' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

The response contains two sections. First section is an array of agents, where for each agent the response contains a collection of the agent specific metrics. The second section is an array of queues where for each queue the response contains a collection of agents and a collection of queue specific metrics for each agent. Each agent will have in the response the agent ID and agent name.

#### Agents within a Queue Response

```json
{
    "agents": [
        {
            "id": "aget4bO5y1SqqQ5HDDfaaaaa",
            "name": "John Agent",
            "metrics": {
                "status.rt": "Available",
                "timeOnStatus.rt": 123
            }
        },
        {
            "id": "agwhzJ0NOwTdWid_JPaaaaa",
            "name": "Jane Agent",
            "metrics": {
                "status.rt": "LoggedOut",
                "timeOnStatus.rt": 2224
            }
        }
    ],
    "queues": [
        {
            "queueId": "2943",
            "assignedAgents": [],
            "agentMetrics": [
                {
                    "id": "agwhzJ0NOwTdWid_JPaaaaa",
                    "name": "Jane Agent",
                    "metrics": {
                        "accepted.today.inQueue": 1
                    }
                }
            ]
        },
        {
            "queueId": "2046",
            "assignedAgents": [
                "aget4bO5y1SqqQ5HDDfaaaaa",
                "agpQ5jHgnDTgq1lMu1qaOxzg"
            ],
            "agentMetrics": [
                {
                    "id": "aget4bO5y1SqqQ5HDDfaaaaa",
                    "name": "John Agent",
                    "metrics": {
                        "accepted.today.inQueue": 2
                    }
                }
            ]
        }
    ]
}

```

### All agents at once within a tenant

Retrieve all agents with all specified metrics values within a tenant. The *summary* parameter can be used to get only agent details without the metrics, in this case the *agent-ids*, *group-ids* and *metrics* parameters will be ignored.

`/realtime-metrics/agents`

#### Query Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| agent-ids | ☐ | Optional set of agent identifiers. Only metrics for these agents will be returned. | agLkndJlSOQReqFZI48LgyvQ |
| group-ids | ☐ | Optional set of group identifiers. Only metrics for these groups will be returned. | 103 |
| summary | ☐ | Returns a summary (id, name, group id, group name) of all agents. If this parameter is set as TRUE, agent-ids, group-ids and metrics parameters will be ignored. If this parameter is not set as TRUE, `metrics` parameter needs to be provided. | true |

#### Request with a specified list of metrics, agent-ids and group-ids

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v5/realtime-metrics/agents?metrics=status.rt,timeOnStatus.rt,accepted.today.inQueue&agent-ids={agent-id-1}&agent-ids={agent-id-2}&group-ids={group-id-1}&group-ids={group-id-2}&page=0&size=100' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Request with a summary parameter set to True

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v5/realtime-metrics/agents?summary=true&page=0&size=100' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### All Agents within a tenant Response examples

With *summary=true* parameter response example:

```json
[
    {
        "id": "ag0IWAMsLuSsijCkitWX76Ng",
        "name": "Agent 1",
        "groupId": "735",
        "groupName": "Nicu Group"
    },
    {
        "id": "ag0OlQp4skQ5mOQsPvPRXDYw",
        "name": "Admin 1",
        "groupId": "100",
        "groupName": "ungroup"
    },
    {
        "id": "ag10000",
        "name": "Admin 2",
        "groupId": "131",
        "groupName": "adi_group"
    }
]

```

With *summary=false* (or missing parameter) response example:

```json
[
    {
        "id": "ag0IWAMsLuSsijCkitWX76Ng",
        "name": "Agent 1",
        "metrics": [
            {
                "key": "accepted.int-15m",
                "value": null
            },
            {
                "key": "accepted.int-30m",
                "value": null
            },
            {
                "key": "activeInteractionsCount.rt",
                "value": 0
            }
        ]
    },
    {
        "id": "ag0OlQp4skQ5mOQsPvPRXDYw",
        "name": "Admin 1",
        "metrics": [
            {
                "key": "accepted.int-15m",
                "value": null
            },
            {
                "key": "accepted.int-30m",
                "value": null
            },
            {
                "key": "activeInteractionsCount.rt",
                "value": 0
            }
        ]
    },
    {
        "id": "ag10000",
        "name": "Admin 2",
        "metrics": [
            {
                "key": "accepted.int-15m",
                "value": null
            },
            {
                "key": "accepted.int-30m",
                "value": null
            },
            {
                "key": "activeInteractionsCount.rt",
                "value": 0
            }
        ]
    }
]

```

### Groups

`/realtime-metrics/groups`

#### Query Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| group-ids | ✓ | When not passed all groups are returned. Specifies the group-ids of the groups to be returned. For multiple groups add multiple times. `&group-ids=102&group-ids=1023`. Only valid group-ids can be passed. Passing an invalid group-id will result in a failure. | 103 |

#### Groups Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/groups?size=100&page=0&group-ids=102&group-ids=1023&metrics=availableIdle.rt&metrics=enabled.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Groups Response

```json
[
    {
        "id": "102",
        "name": "Sales",
        "metrics": [
            {
                "key": "availableIdle.rt",
                "value": "0"
            },
            {
                "key": "enabled.rt",
                "value": "0"
            }
        ]
    },
    {
        "id": "1023",
        "name": "Deliveries",
        "metrics": [
            {
                "key": "availableIdle.rt",
                "value": "0"
            },
            {
                "key": "enabled.rt",
                "value": "0"
            }
        ]
    }
]

```

### Single Group

`/realtime-metrics/groups/{group-id}`

#### Path Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| group-id | ✓ | Group Id of the requested group | 103 |

#### Single Group Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/groups/{group-id}?metrics=availableIdle.rt&metrics=enabled.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Groups Response

```json
[
    {
        "id": "102",
        "name": "Sales",
        "metrics": [
            {
                "key": "availableIdle.rt",
                "value": "0"
            },
            {
                "key": "enabled.rt",
                "value": "0"
            }
        ]
    }
]

```

### Agents within a Group

`/realtime-metrics/groups/{group-id}/agents`

#### Path Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| group-id | ✓ | Group Id of the requested group | 103 |

#### Query Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| agent-ids | ☐ | When not passed all agents are returned. Specifies the agent-ids of the agents to be returned. For multiple agents add multiple times. `&agent-ids=agfAl1ZjIyQ8ecpoCB9KUbbb&agent-ids=agk4tyf8vnSMWki8r4e0dfff`. Only valid agent-ids can be passed. Passing an invalid agent-id will result in a failure. | agk4tyf8vnSMWki8r4e0dfff |

#### Agents within a Group Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/groups/{group-id}/agents?page=0&size=100&agent-ids={agent-id1}&agent-ids={agent-id2}&metrics=offered.today&metrics=status.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Agents within a Group Response

```json
[
    {
        "id": "agAD21EBR1RhuV2TNDivaaa",
        "name": "Jane Li",
        "metrics": [
            {
                "key": "offered.today",
                "value": 10
            },
            {
                "key": "status.rt",
                "value": "Available"
            }
        ]
    },
    {
        "id": "agAQDqmvKiRbG4ekigNSbbbbb",
        "name": "James Woods",
        "metrics": [
            {
                "key": "offered.today",
                "value": null
            },
            {
                "key": "status.rt",
                "value": "LoggedOut"
            }
        ]
    }
]

```

### Single Agent within a Group

`/realtime-metrics/groups/{group-id}/agents/{agent-id}`

#### Path Parameter

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| group-id | ✓ | Group Id of the requested group | 103 |
| agent-id | ✓ | AgentId of the requested agent | agAD21EBR1RhuV2TNDivaaa |

#### Single Agent within a Group Request

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v<\<versionCCARealtime\>>/realtime-metrics/groups/{group-id}/agents/{agent-id}?metrics=offered.today&metrics=status.rt' \
--header 'Authorization: Bearer FnZGG0u5BpNwRkuwKuSmfG2JAG9w'

```

#### Single Agent within a Group Response

```json
[
    {
        "id": "agAD21EBR1RhuV2TNDivaaa",
        "name": "Jane Li",
        "metrics": [
            {
                "key": "offered.today",
                "value": 10
            },
            {
                "key": "status.rt",
                "value": "Available"
            }
        ]
    }
]

```

## Additional Information

#### includeTotals

When includeTotals is set to `true` an additional set of "total" metrics will be included for time, percentage, average and count metric types as follows.

```json
{
        "id": null,
        "name": "totals",
        "metrics": [
            {
                "key": "total.abandoned.int-15m",
                "value": 0
            },
            {
                "key": "total.abandoned.int-30m",
                "value": 0
            },
            {
                "key": "total.abandoned.today",
                "value": 0
            },
            {
                "key": "total.abandonedPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.abandonedPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.abandonedPercentage.today",
                "value": 0.0
            },
            {
                "key": "total.accepted.int-15m",
                "value": 0
            },
            {
                "key": "total.accepted.int-30m",
                "value": 0
            },
            {
                "key": "total.accepted.today",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-12h",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-15m",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-1h",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-30m",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-4h",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.int-8h",
                "value": 0
            },
            {
                "key": "total.acceptedInSla.today",
                "value": 0
            },
            {
                "key": "total.acceptedInSlaPercentage.int-12h",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.int-1h",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.int-4h",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.int-8h",
                "value": null
            },
            {
                "key": "total.acceptedInSlaPercentage.today",
                "value": null
            },
            {
                "key": "total.acceptedPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.acceptedPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.acceptedPercentage.today",
                "value": 0.0
            },
            {
                "key": "total.availableIdle.rt",
                "value": 0
            },
            {
                "key": "total.avgDivertedTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgDivertedTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgDivertedTime.today",
                "value": 29947.4
            },
            {
                "key": "total.avgHandlingTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgHandlingTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgHandlingTime.today",
                "value": null
            },
            {
                "key": "total.avgOfferingTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgOfferingTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgOfferingTime.today",
                "value": null
            },
            {
                "key": "total.avgProcessingTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgProcessingTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgProcessingTime.today",
                "value": null
            },
            {
                "key": "total.avgWorkTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgWorkTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgWorkTime.today",
                "value": null
            },
            {
                "key": "total.avgWrapUpTime.int-15m",
                "value": null
            },
            {
                "key": "total.avgWrapUpTime.int-30m",
                "value": null
            },
            {
                "key": "total.avgWrapUpTime.today",
                "value": null
            },
            {
                "key": "total.busy.rt",
                "value": 0
            },
            {
                "key": "total.busyExternal.rt",
                "value": 0
            },
            {
                "key": "total.busyOther.rt",
                "value": 0
            },
            {
                "key": "total.diverted.int-15m",
                "value": 0
            },
            {
                "key": "total.diverted.int-30m",
                "value": 0
            },
            {
                "key": "total.diverted.today",
                "value": 5
            },
            {
                "key": "total.divertedPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.divertedPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.divertedPercentage.today",
                "value": 1.0
            },
            {
                "key": "total.eligible.rt",
                "value": 0
            },
            {
                "key": "total.enabled.rt",
                "value": 0
            },
            {
                "key": "total.entered.int-15m",
                "value": 0
            },
            {
                "key": "total.entered.int-30m",
                "value": 0
            },
            {
                "key": "total.entered.today",
                "value": 5
            },
            {
                "key": "total.handling.rt",
                "value": 0
            },
            {
                "key": "total.interactionsAvgWaitTime.int-15m",
                "value": null
            },
            {
                "key": "total.interactionsAvgWaitTime.int-30m",
                "value": null
            },
            {
                "key": "total.interactionsAvgWaitTime.today",
                "value": 29947.4
            },
            {
                "key": "total.interactionsHandling.rt",
                "value": 0
            },
            {
                "key": "total.interactionsLongestWaitInQueue.int-15m",
                "value": 0
            },
            {
                "key": "total.interactionsLongestWaitInQueue.int-30m",
                "value": 0
            },
            {
                "key": "total.interactionsLongestWaitInQueue.rt",
                "value": 0
            },
            {
                "key": "total.interactionsLongestWaitInQueue.today",
                "value": 29951
            },
            {
                "key": "total.interactionsWaitInQueue.rt",
                "value": 0
            },
            {
                "key": "total.interactionsWrapUp.rt",
                "value": 0
            },
            {
                "key": "total.longestOfferingTimeInQueue.int-15m",
                "value": 0
            },
            {
                "key": "total.longestOfferingTimeInQueue.int-30m",
                "value": 0
            },
            {
                "key": "total.longestOfferingTimeInQueue.today",
                "value": 0
            },
            {
                "key": "total.newInQueue.int-15m",
                "value": 0
            },
            {
                "key": "total.newInQueue.int-30m",
                "value": 0
            },
            {
                "key": "total.newInQueue.today",
                "value": 5
            },
            {
                "key": "total.offering.rt",
                "value": 0
            },
            {
                "key": "total.onBreak.rt",
                "value": 0
            },
            {
                "key": "total.shortAbandoned.int-15m",
                "value": 0
            },
            {
                "key": "total.shortAbandoned.int-30m",
                "value": 0
            },
            {
                "key": "total.shortAbandoned.today",
                "value": 0
            },
            {
                "key": "total.shortAbandonedPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.shortAbandonedPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.shortAbandonedPercentage.today",
                "value": 0.0
            },
            {
                "key": "total.slaPercentage.int-12h",
                "value": null
            },
            {
                "key": "total.slaPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.slaPercentage.int-1h",
                "value": null
            },
            {
                "key": "total.slaPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.slaPercentage.int-4h",
                "value": null
            },
            {
                "key": "total.slaPercentage.int-8h",
                "value": null
            },
            {
                "key": "total.slaPercentage.today",
                "value": null
            },
            {
                "key": "total.totalAbandoned.int-15m",
                "value": 0
            },
            {
                "key": "total.totalAbandoned.int-30m",
                "value": 0
            },
            {
                "key": "total.totalAbandoned.today",
                "value": 0
            },
            {
                "key": "total.totalAbandonedPercentage.int-15m",
                "value": null
            },
            {
                "key": "total.totalAbandonedPercentage.int-30m",
                "value": null
            },
            {
                "key": "total.totalAbandonedPercentage.today",
                "value": 0.0
            },
            {
                "key": "total.workingOffline.rt",
                "value": 0
            },
            {
                "key": "total.wrapUp.rt",
                "value": 0
            }
        ]
    }

```

#### Passing Multiple ids

When passing multiple ids on endpoints with plural parameters such as agent-ids, queue-ids, group-ids.

The parameters can be passed by repeating the parameter name:

* `agent-ids=123&agent-ids-765&agent-ids=963`

OR they can be passed as a comma separated list:

* `agent-ids=123,765,963`
