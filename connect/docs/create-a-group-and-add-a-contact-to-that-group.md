# Create a group and add a contact to that group

> 👍
>
> Please see [Create a group](/connect/reference/create-group) for the full API reference
>
>

[Create a group](/connect/reference/create-group)

To create a group you need to submit a JSON object to the URL  

POST **`https://contacts.8x8.com/accounts/{accountId}/groups`**

Request body should look like this:

```json
{
     "isBlacklist": false,
     "name": "Group 1",
     "description": "Team that belongs to group 1"
}

```

If successful you will get a response similar to this:

```json
{
  "id": 8334,
  "contacts": 0,
  "createdAt": "2022-05-13T07:03:08.54Z",
  "name": "Group 1",
  "description": "Group 1 team",
  "isBlacklist": false
}

```

Otherwise you will get a 400 or a 409 error response.

Assuming you've successfully created the group, to add contacts you need to submit a JSON object to the URL  

POST **`https://contacts.8x8.com/api/v1/accounts/accountId/groups/{groupId}/contacts`**  

Groupid is the id of the group you just created. For this example **8334** is the group id.  

When you send a request, it should be an array of contact id like the one below:

```json
{
    "contacts":[
        41702128,41702329
    ]
}

```

You can use [Get contact information by id](/connect/reference/get-contact-by-id) to get the id of a contact or [Search contacts](/connect/reference/contact-search) where the list shows the id of each contact.

Response:  

Returns 201 Created with location header if the request was successful. If the request failed, an error object will be returned as 404.
