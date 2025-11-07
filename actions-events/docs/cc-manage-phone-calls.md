# CC Manage Phone Calls

## Authentication

CC Phone Call APIs leverage the credentials from the Integration >> API Token area in Configuration Manager.  

These APIs use Basic Authentication.  

The username will be the "Username" value from this screen, it is generally the tenant name  

Action Request Token will be the password.  

`Authorization :Basic encodedValue`  

Where encodedValue is base64encode(username:password)

![CC Request Action Token](../images/841df98-CC-Request-Action-Token.png "CC-Request-Action-Token.png")

## Place Call For Agent

Make a call in the context of a specified agent

### Parameters

**Method: POST**

#### Headers

| Name          | Required | Description                                                                                                                                                                         | Example                                    |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of **Action Request Token** | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |
| Content-Type  | ✓        | Set the content type to application/json                                                                                                                                            | application/json                           |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                               | Example    |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12       |
| version    | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1         |
| tenantId   | ✓        | The CC Tenant name of the tenant to perform the action on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                        | acmecorp01 |

#### Body

Body is JSON and includes extTransactionData, ctlUserData which are optional arrays that can have multiple elements. See XX for a full example.

| Name                      | Required | Description                                                                                                                                                                                                                                                                                                              | Example                 |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| agentId                   | ✓        | The agentId of the agent to set the status for. This can be found in CC Configuration Manager "Users" add the "Internal Id" column, or in the "General" section of the user as "Internal Id"                                                                                                                             | ag0VYyLh0YTsymdbtYIaaaa |
| prefix                    | ✓        | Prefix for the number to dial. Example 1 to be prepended to a 10 digit US number. Note this MUST be passed but can be an empty string                                                                                                                                                                                    | 1                       |
| number                    | ✓        | The number to dial. The number will have dial plan rules applied to convert to E.164                                                                                                                                                                                                                                     | 6175551984              |
| callerId                  | ✓        | The callerid number to present. Only callerid numbers that are channels will be presented. If a non channel or empty number is provided the configured callerid for the agent is presented.                                                                                                                              | 12015551212             |
| queueId                   | ☐        | Optionally set the queue to associate the call with. Note if no queue is associated the agent will not be set to busy status. Queue Id can be located in CC Configuration Manager "Queues/Skills" "Id" column.                                                                                                           | 598                     |
| dialplanId                | ☐        | Optionally set the dial plan to associate the call with. This can be used to manipulate the number to dial. Dial plan Id can be located in CC Configuration Manager "Home" "Dial Plans" in the "ID" column. When not specified the agents configured dial plan is used.                                                  | 12                      |
| forceCall                 | ☐        | If an agent has one line available but is busy on the other line, or has both lines available but busy on chat, this flag can be set to true so the agent is offered the call regardless. If the agent is busy on both lines, on break, or logged out, this flag will not help as the call is rejected. Default is false | true                    |
| extTransactionData[].name | ☐        | Name of the element to be passed. See [extTransactionData details](/actions-events/docs/cc-manage-phone-calls#exttransationdata-details) for more information                                                                                                                                                            |                         |
| extTransationData[].value | ☐        | Value for the element to be passed. See [extTransactionData details](/actions-events/docs/cc-manage-phone-calls#exttransationdata-details) for more information                                                                                                                                                          |                         |
| ctlUserData[].name        | ☐        | Name of the element to be passed. See [ctlUserData details](https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#ctl_userdata) for more information                                                                                                           |                         |
| ctlUserData[].value       | ☐        | Value for the element to be passed. See [ctlUserData details](https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#ctl_userdata) for more information                                                                                                         |                         |

[Phone Call API Reference](/actions-events/reference/placephonecall) allows you to try out this API.

### Place Call For Agent Request

```bash
curl --location --request POST 'https://vcc-na12.8x8.com/api/v1/tenants/supertenantcsm01/calls' \
--header 'Authorization: Basic {encodedValue}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "agentId": "ag0VYyLh0YTsymdbtYIaaaa",
    "prefix": "1",
    "number": "6175551984",
    "callerId": "12015551212",
    "queueId": "598",
    "forceCall": true,
    "dialplanId": "12",
    "extTransactionData": [
          {
               "name": "Name",
               "value": "Bilbo Baggins"
          },
          {
               "name": "Loyalty Level",
               "value": "Gold"
          }
     ],
     "ctlUserData": [
          {
               "name": "AccountRef",
               "value": "BB123987"
          },
          {
               "name": "DueDate",
               "value": "2022-12-25"
          }
     ]
}'

```

### Place Call For AgentResponse

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Call successfully initiated"
    ],
    "message": "OK",
    "interactionGuid": "int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01"
}

```

The `interactionGuid` in a successful response is a unique identifier for the placed call. This can be used in subsequent requests as the `interactionId`

## Set Transaction Codes for the Agent & Interaction

Set the Transaction Codes for the interaction.

### Parameters

**Method: PUT**

#### Headers

| Name          | Required | Description                                                                                                                                                                         | Example                                    |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of **Action Request Token** | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |
| Content-Type  | ✓        | Set the content type to application/json                                                                                                                                            | application/json                           |

#### Path

| Name          | Required | Description                                                                                                                                                                                                                                                               | Example                                                       |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| ccPlatform    | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12                                                          |
| version       | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1                                                            |
| tenantId      | ✓        | The CC Tenant name to set the transaction codes on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                               | acmecorp01                                                    |
| interactionId | ✓        | The unique identifier for the call to set the transaction codes for. This is returned from place call as interactionGuid                                                                                                                                                  | int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01 |
| agentId       | ✓        | The agentId of the agent to set the status for. This can be found in CC Configuration Manager "Users" add the "Internal Id" column, or in the "General" section of the user as "Internal Id"                                                                              | ag0VYyLh0YTsymdbtYIaaaa                                       |

#### Body

Body is an array named "selections" which contains objects defining the Transaction Code Lists and List Items to be added.

#### Transaction Code List and Item Assignment

Up to six transaction codes can be assigned to a transaction.

Transaction Code Lists (TCL) are located in CC Configuration Manager "Transaction Codes". The TCL id and TCL item id are only visible/available via API.

Single Item from Single ListTwo Items from Single ListTwo Items from Two Lists

```json
{
  "selections": [
    {
      "id": transaction_code_list_id_a,
      "codes": [
        { "id": transaction_code_list_item_id_z }
      ]
    }
}

```

```json
{
  "selections": [
    {
      "id": transaction_code_list_id_a,
      "codes": [
        { "id": transaction_code_list_item_id_y },
        { "id": transaction_code_list_item_id_z }
      ]
    }
}

```

```json
{
  "selections": [
    {
      "id": transaction_code_list_id_a,
      "codes": [
        { "id": transaction_code_list_item_id_y }
      ]
    },
    {
      "id": transaction_code_list_id_b,
      "codes": [
        { "id": transaction_code_list_item_id_w }
      ]
    }
}

```

For a single Transaction Code List and Item the elements would be as follows

| Name                    | Required | Description                   | Example |
| ----------------------- | -------- | ----------------------------- | ------- |
| selections[].id         | ✓        | Transaction Code List Id      | 12      |
| selections[].codes[].id | ✓        | Transaction Code List Item Id | 234     |

### Set Transaction Codes Request

Two items, from two lists

```bash
curl --location --request PUT 'https://vcc-{ccPlatform}.8x8.com/api/v{version}/tenants/{tenantId}/calls/{interactionId}/agent/{agentId}/transaction-codes' \
--header 'Authorization: Basic {encodedValue}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "selections": [
    {
      "id": 12,
      "codes":[
        {
          "id": 234
        }
      ]
    },
    {
      "id": 2281,
      "codes":[
        {
          "id": 7361
        }
      ]
    }
  ]
}'

```

### Set Transaction Codes Response

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Transaction codes successfully set"
    ],
    "message": "OK"
}

```

## End Call based on interactionId

End the call based on the interactionId

### Parameters

**Method: DELETE**

#### Headers

| Name          | Required | Description                                                                                                                                                                      | Example                                    |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of Action Request Token. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name          | Required | Description                                                                                                                                                                                                                                                               | Example                                                       |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| ccPlatform    | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12                                                          |
| version       | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1                                                            |
| tenantId      | ✓        | The CC Tenant name of the tenant to perform the action on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                        | acmecorp01                                                    |
| interactionId | ✓        | The unique identifier for the call to end. This is returned from place call as interactionGuid                                                                                                                                                                            | int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01 |

#### Query

| Name              | Required | Description                                                                                                                                                                          | Example |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| endPostProcessing | ☐        | If present, the deleted interaction completes the assigned post processing. Default false. This will end post processing even if mandatory transaction codes have not been assigned. | true    |

### End Call based on interactionId Request

```bash
curl --location --request DELETE 'https://vcc-{ccPlatform}.8x8.com/api/v{version}/tenants/{tenantId}/calls/{interactionId}?endPostProcessing=true' \
--header 'Authorization: Basic {encodedValue}'

```

### End Call based on interactionId Response

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Ending call with interactionGuid=[int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01] was successful"
    ],
    "message": "OK"
}

```

## Hang up call for agent based on agentId

Hangs up the call for an agent. If the call is a conference or call was transferred it will not hang up for the other participants.

### Parameters

**Method: DELETE**

#### Headers

| Name          | Required | Description                                                                                                                                                                      | Example                                    |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of Action Request Token. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name          | Required | Description                                                                                                                                                                                                                                                               | Example                                                       |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| ccPlatform    | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12                                                          |
| version       | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1                                                            |
| tenantId      | ✓        | The CC Tenant name of the tenant to perform the action on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                        | acmecorp01                                                    |
| interactionId | ✓        | The unique identifier for the call to end. This is returned from place call as interactionGuid                                                                                                                                                                            | int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01 |
| agentId       | ✓        | The agentId of the agent to set the status for. This can be found in CC Configuration Manager "Users" add the "Internal Id" column, or in the "General" section of the user as "Internal Id"                                                                              | ag0VYyLh0YTsymdbtYIaaaa                                       |

### Hang up call for agent Request

```bash
curl --location --request DELETE 'https://vcc-{ccPlatform}.8x8.com/api/v{version}/tenants/{tenantId}/calls/{interactionId}/agent/{agentId}' \
--header 'Authorization: Basic {encodedValue}'

```

### Hang up call for agent Response

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Hangup for agent [acmecorp01-ag0VYyLh0YTsymdbtYIaaaa-edc85374-bb3e-48ad-98fd-41d122701be6] leg in interaction [int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01] was successful"
    ],
    "message": "OK"
}

```

## Free agent lines

Free up agent lines in preparation for the next call. This will end the agent involvement in all their calls. If a call is a conference or call was transferred it will not hang up for the other participants.

### Parameters

**Method: DELETE**

#### Headers

| Name          | Required | Description                                                                                                                                                                      | Example                                    |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of Action Request Token. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                               | Example                 |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12                    |
| version    | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1                      |
| tenantId   | ✓        | The CC Tenant name of the tenant to perform the action on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                        | acmecorp01              |
| agentId    | ✓        | The agentId of the agent to set the status for. This can be found in CC Configuration Manager "Users" add the "Internal Id" column, or in the "General" section of the user as "Internal Id"                                                                              | ag0VYyLh0YTsymdbtYIaaaa |

### Free agent lines Request

```bash
curl --location --request DELETE 'https://vcc-{ccPlatform}.8x8.com/api/v{version}/tenants/{tenantId}/agents/{agentId}/calls' \
--header 'Authorization: Basic {encodedValue}'

```

### Free agent lines Response

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Hangup all calls for agent [acmecorp01-ag0VYyLh0YTsymdbtYIaaaa-edc85374-bb3e-48ad-98fd-41d122701be6] was successful."
    ],
    "message": "OK"
}

```

## Free specific agent line

Free up agent lines in preparation for the next call. This will end the agent involvement in all their calls. If a call is a conference or call was transferred it will not hang up for the other participants.

### Parameters

**Method: DELETE**

#### Headers

| Name          | Required | Description                                                                                                                                                                      | Example                                    |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of username and the password is the value of Action Request Token. | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |

#### Path

| Name       | Required | Description                                                                                                                                                                                                                                                               | Example                 |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ccPlatform | ✓        | Contact Center platform can be found in the url when accessing CC Configuration Manager. <br />North America starts NA<br />Europe starts EU<br />Canada starts CA<br />Asia Pacific starts AP<br />Australia starts AU<br />Bell Canada starts BC<br />Sandbox starts SB | na12                    |
| version    | ✓        | The API version. The current version is 1 resulting in. v1                                                                                                                                                                                                                | v1                      |
| tenantId   | ✓        | The CC Tenant name of the tenant to perform the action on. Tenant name is generally the same as the username above. It can be located in CC Configuration Manager @ Home :: Profile :: Tenant Name                                                                        | acmecorp01              |
| agentId    | ✓        | The agentId of the agent to set the status for. This can be found in CC Configuration Manager "Users" add the "Internal Id" column, or in the "General" section of the user as "Internal Id"                                                                              | ag0VYyLh0YTsymdbtYIaaaa |
| lineNo     | ✓        | The line number to free. Agent has Line 1 and Line 2                                                                                                                                                                                                                      | 2                       |

### Free specific agent line Request

```bash
curl --location --request DELETE 'https://vcc-{ccPlatform}.8x8.com/api/v{version}/tenants/{tenantId}/agents/{agentId}/calls/line/{lineNo}' \
--header 'Authorization: Basic {encodedValue}'

```

### Free specific agent line Response

Response Status will be 200 for successful requests.

```json
{
    "reasons": [
        "Hangup all calls for agent [acmecorp01-ag0VYyLh0YTsymdbtYIaaaa-edc85374-bb3e-48ad-98fd-41d122701be6] was successful."
    ],
    "message": "OK"
}
{
    "reasons": [
        "Hangup for agent [acmecorp01-ag0VYyLh0YTsymdbtYIaaaa-edc85374-bb3e-48ad-98fd-41d122701be6] leg on line [2] assigned to interaction [int-184a0c5493f-nempJR9b0nXcZbChiZmtZkLCE-phone-00-acmecorp01] was successful."
    ],
    "message": "OK"
}

```

## References

[https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#extTransactionData](https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#extTransactionData)

[https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#ctl_userdata](https://support.8x8.com/cloud-contact-center/8x8-contact-center/developers/8x8-contact-center-click-to-dial-api#ctl_userdata)
