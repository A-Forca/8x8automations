# OAuth Authentication for 8x8 XCaaS APIs

A number of 8x8 XCaaS APIs use OAuth authentication. For these APIs the initial step is to generate an `access_token` to be used in the subsequent API calls.

**Analytics and Content APIs using OAuth Method:**

* [CC Realtime Analytics](/analytics/reference/cc-real-time-get-queues-metrics)
* [CC Historical Analytics](/analytics/reference/cc-historical-report-create)
* [Cloud Storage Service](/analytics/reference/searchobject)
* [Quality Management](/analytics/reference/interactions-count)

**Other APIs using OAuth Method:**

* [Contact Center Chat](/actions-events/reference/createaccesstoken)

> 📘 **You will need a working API key to begin**
>
> [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
>

The URL for the OAuth Authentication is: `https://api.8x8.com/oauth/v2/token`

## Authenticate to retrieve access token

Using the key and secret from Admin Console as the username and password use Basic Authentication.

### Parameters

**Method: POST**

#### Headers

| Name          | Required | Description                                                                                                                                                                                                                                            | Example                                    |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Authorization | ✓        | [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) where username is the value of clientId and the password is the value of secret. <br />Example shows value for <br />clientId=myclientId<br />secret=nevertellanyone | Basic bXljbGllbnRJZDpuZXZlcnRlbGxhbnlvbmU= |
| Content-Type  | ✓        | Specify form content type to pass the grant_type in the body                                                                                                                                                                                           | application/x-www-form-urlencoded          |

#### Body

> 📘 **Table contains the values for the x-www-form-urlencoded body**
>
>

| Name       | Required | Description                  | Example            |
| ---------- | -------- | ---------------------------- | ------------------ |
| grant_type | ✓        | Must be `client_credentials` | client_credentials |

### Authentication Request

```bash
curl --location --request POST 'https://api.8x8.com/oauth/v2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic base64encode({clientId}:{secret})' 
--data-urlencode 'grant_type=client_credentials'

```

### Authentication Response

**Response**

```json
{
    "access_token": "{{TOKEN_VALUE}}",
    "token_type": "BearerToken",
    "api_product_list": "[CE-PCS-Product, CE-RCS-Product, Chat, QM - API, analytics product, analytics realtime-api, chat-gateway, storage, vcc]",
    "status": "approved",
    "scope": "",
    "refresh_token_expires_in": "0",
    "expires_in": "1799",
    "refresh_count": "0",
    "developer.email": "deprecated",
    "issued_at": "1683045181383",
    "client_id": "deprecated",
    "api_product_list_json": [
        "CE-PCS-Product",
        "CE-RCS-Product",
        "Chat",
        "QM - API",
        "analytics product",
        "analytics realtime-api",
        "chat-gateway",
        "storage",
        "vcc"
    ]
}

```

## Outputs that are used in the subsequent API

**issued_at** : Epoch time of when the token was issued  

**expires_in**: Number of seconds before this `access_token` will expire.

If your use case will leverage the `access_token` for a period that could exceed the lifetime of the token ensure that your code either handles an error based on the token expiration OR requests a new token before the current token expires. We recommend against getting a new token for every request as this will result in added duration and processing on both sides.

**access_token**: This is the token that will be passed into subsequent API calls as a Bearer Token. In the example above the `access_token` is `3yKcgVwWCJM14dXxKDBAEDGcythJ`

`access_token`: is used to populate `Authorization` header in the subsequent request set to `Bearer {access_token}` (Space between Bearer and the access_token)

Example using the `access_token` above to make a request to the CC Realtime Metrics queues endpoint.

```bash
curl --location --request GET 'https://api.8x8.com/analytics/cc/v5/realtime-metrics/queues' \
--header 'Authorization: Bearer 3yKcgVwWCJM14dXxKDBAEDGcythJ'

```

**api_product_list** : This is the list of APIs the provided credentials (and this generated access_token) are valid for. This can be one or more API Products.  

Adding or removing APIs from an existing API key will not be instantaneous as there is some replication delay for cached objects.

## List of APIs and whether they use this OAuth process

| API Product Name       | API Description                                | OAuth |
| ---------------------- | ---------------------------------------------- | ----- |
| analytics realtime-api | Contact Center Realtime & Historical Analytics | ✔️    |
| storage                | Cloud Storage Service                          | ✔️    |
| QM - API               | Quality Management & Speech Analytics          | ✔️    |
| vcc                    | Contact Center Chat                            | ✔️    |
| Chat                   | CHAPI Work Chat                                | ❌    |
| analytics product      | Work Analytics                                 | ❌    |
