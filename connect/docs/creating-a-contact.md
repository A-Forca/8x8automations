# Creating a contact

> 👍
>
> Please see [Create contact](/connect/reference/create-contact) for the full API reference
>
>

To create a single contact you need to submit a JSON object to the URL  

POST `https://contacts.8x8.com/accounts/{accountId}/contacts`

Request body should look like this:

```json
{
    "firstName": "Chathuranga",
    "lastName": "Pathirana",
    "externalId": "externalSystemId",
    "country": "SG",
    "groups": [
        { "id": 72 },
        { "id": 82 }
    ],
    "addresses": {
        "msisdn": "6580000000",
        "weChatUserId": "oJQxo6XXXXXXXXXXXXXXXXX",
        "facebookUserId": "19520000000000",
        "email": "user@example.com"
    },
    "customAttributes": {
        "company": "Google",
        "jobTitle": "CEO"
    }
}

```

Response:  

Returns 201 Created with location header if the request was successful. If the request failed, an error object will be returned.
