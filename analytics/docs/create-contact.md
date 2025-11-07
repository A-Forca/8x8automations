# Contact Management

Our Contact API allows you to add new contacts into the system. This section guides you through the steps to create a contact. Before you start, make sure you have an API key to authenticate your requests.

For comprehensive information about the object structure, including restrictions, please refer to the [Object Structure Guide](/analytics/docs/contact-object-structure-guide).

**Endpoint for Contact Management**: `https://api.8x8.com/directory-contacts/api/v3/contacts`

## 1. Obtain API Key for Contact Management Product

To use the Contact Search endpoint, you must obtain a **Contact Management API Key**. This key is required for any requests that create, update, or delete contact information, i.e., POST, PUT, DELETE methods.

[How to get API Keys](https://dash.readme.com/project/analytics-prod/v8-x-8/docs/how-to-get-api-keys)

## 2. Create Contact

Once authenticated, you can create a new contact by sending a `POST` request to the Contact API with the necessary information.

### HTTP Request

`POST https://api.8x8.com/directory-contacts/api/v3/contacts`

### Request Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Content-Type | ✓ | This indicates that the request body is in JSON format | application/json |
| x-api-key | ✓ | Pass the API key returned from Admin Console for Contact Management product | romc_MmFmMTI3sowe |

### Body

[Detailed Field Descriptions](/analytics/docs/contact-object-structure-guide)

```json
{
   "companyName":"8x8, Inc.",
   "contactType":"company",
   "customerId":"0016C00000VM1BeQAL",
   "department":"Research and Development",
   "firstName":"John",
   "jobTitle":"Software Eng.",
   "lastName":"Doe",
   "locale":"en_US",
   "location":"San Jose, CA",
   "nickName":"johnny",
   "pbxId":"bhjLT03CTJuVwgAy9y3DOQ",
   "pbxName":"qmsarealenv1",
   "timeZone":"America/Los_Angeles",
   "addresses":[
      {
         "city":"San Jose",
         "country":"United States",
         "county":"Santa Clara",
         "notes":"8x8 Headquarters",
         "postalCode":"95131",
         "primary":true,
         "purposeType":"WORK",
         "state":"California",
         "streetName":"1st St",
         "streetNumber":"675"
      }
   ],
   "emails":[
      {
         "email":"test.user@company.com",
         "primary":true,
         "purposeType":"WORK"
      }
   ],
   "phones":[
      {
         "phone":"+18005551234",
         "primary":true,
         "purposeType":"WORK",
         "source":"EXTERNAL"
      }
   ],
   "tags":[
      {
         "name":"customField1",
         "value":"value1"
      }
   ]
}

```

### Response

A successful creation will yield a 200 status code and a response body with the details of the new contact, including a contactId. Save the contactId for any future reference.

```json
{
   "id": "c3697cef-5e57-41cc-8720-6db6e8e2a977",
   "companyName":"8x8, Inc.",
   "contactType":"company",
   "customerId":"0016C00000VM1BeQAL",
   "department":"Research and Development",
   "firstName":"John",
   "jobTitle":"Software Eng.",
   "lastName":"Doe",
   "locale":"en_US",
   "location":"San Jose, CA",
   "nickName":"johnny",
   "pbxId":"bhjLT03CTJuVwgAy9y3DOQ",
   "pbxName":"qmsarealenv1",
   "timeZone":"America/Los_Angeles",
   "addresses":[
      {
         "id": 4038630,
         "city":"San Jose",
         "country":"United States",
         "county":"Santa Clara",
         "notes":"8x8 Headquarters",
         "postalCode":"95131",
         "primary":true,
         "purposeType":"WORK",
         "state":"California",
         "streetName":"1st St",
         "streetNumber":"675"
      }
   ],
   "emails":[
      {
         "id": 5106357,
         "email":"test.user@company.com",
         "primary":true,
         "purposeType":"WORK"
      }
   ],
   "phones":[
      {
         "id": 3115234,
         "phone":"+18005551234",
         "primary":true,
         "purposeType":"WORK",
         "source":"EXTERNAL"
      }
   ],
   "tags":[
      {
         "id": 3248976,
         "name":"customField1",
         "value":"value1"
      }
   ]
}

```

## 3. Modify Contact

After creating a contact, you may need to update its information. To modify an existing contact, use a `PUT` request to the Contact API with the updated details.

### HTTP Request

`PUT https://api.8x8.com/directory-contacts/api/v3/contacts/{contactId}`

Replace `{contactId}` with the unique identifier of the contact you wish to update.

### Request Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Content-Type | ✓ | This indicates that the request body is in JSON format | application/json |
| x-api-key | ✓ | Pass the API key returned from Admin Console for Contact Management product | romc_MmFmMTI3sowe |

### Body

[Detailed Field Descriptions](/analytics/docs/contact-object-structure-guide)

```json
{
   "id": "c3697cef-5e57-41cc-8720-6db6e8e2a977",
   "companyName":"8x8, Inc.",
   "contactType":"company",
   "customerId":"0016C00000VM1BeQAL",
   "department":"Marketing",
   "firstName":"John",
   "jobTitle":"Marketing Manager",
   "lastName":"Doe",
   "locale":"en_US",
   "location":"San Jose, CA",
   "nickName":"johnny",
   "pbxId":"bhjLT03CTJuVwgAy9y3DOQ",
   "pbxName":"qmsarealenv1",
   "timeZone":"America/Los_Angeles",
   "addresses":[
      {
         "city":"New York",
         "country":"United States",
         "county":"New York",
         "notes":"Secondary Office Location",
         "postalCode":"10001",
         "primary":true,
         "purposeType":"WORK",
         "state":"New York",
         "streetName":"5th Ave",
         "streetNumber":"350"
      }
   ],
   "emails":[
      {
         "email":"test.user@company.com",
         "primary":true,
         "purposeType":"WORK"
      }
   ],
   "phones":[
      {
         "phone":"+18003351234",
         "primary":true,
         "purposeType":"WORK",
         "source":"EXTERNAL"
      }
   ],
   "tags":[
      {
         "name":"customField1",
         "value":"value2"
      }
   ]
}

```

Provide the complete set of fields for the resource. Any fields not included in the request will be set to their default values or nullified.

### Response

A successful creation will yield a 200 status code and a response body with the details of the updated contact.

I'm A tab

```json
{
   "id": "c3697cef-5e57-41cc-8720-6db6e8e2a977",
   "companyName":"8x8, Inc.",
   "contactType":"company",
   "customerId":"0016C00000VM1BeQAL",
   "department":"Marketing",
   "firstName":"John",
   "jobTitle":"Marketing Manager",
   "lastName":"Doe",
   "locale":"en_US",
   "location":"San Jose, CA",
   "nickName":"johnny",
   "pbxId":"bhjLT03CTJuVwgAy9y3DOQ",
   "pbxName":"qmsarealenv1",
   "timeZone":"America/Los_Angeles",
   "addresses":[
      {
         "id": 4038640,
         "city":"New York",
         "country":"United States",
         "county":"New York",
         "notes":"Secondary Office Location",
         "postalCode":"10001",
         "primary":true,
         "purposeType":"WORK",
         "state":"New York",
         "streetName":"5th Ave",
         "streetNumber":"350"
      }
   ],
   "emails":[
      {
         "id": 3115834,
         "email":"test.user@company.com",
         "primary":true,
         "purposeType":"WORK"
      }
   ],
   "phones":[
      {
         "id": 5106367,
         "phone":"+18003351234",
         "primary":true,
         "purposeType":"WORK",
         "source":"EXTERNAL"
      }
   ],
   "tags":[
      {
         "id": 3228976,
         "name":"customField1",
         "value":"value2"
      }
   ]
}

```

### Non-updatable Fields

The fields in the table below are read only and should not be included in any PUT request.

| Field | Description |
| --- | --- |
| createdTimestamp | Timestamp when the contact was created |
| updatedTimestamp | Timestamp when the contact was last updated |

## 4. Delete Contact

To remove a contact from our system, use the DELETE request with the specific contact's ID. This action is irreversible, so ensure that the contact is indeed meant to be deleted.

### HTTP Request

`DELETE https://api.8x8.com/directory-contacts/api/v3/contacts/{contactId}`

Replace `{contactId}` with the unique identifier of the contact you wish to delete.

### Request Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Content-Type | ✓ | This indicates that the request body is in JSON format | application/json |
| x-api-key | ✓ | Pass the API key returned from Admin Console for Contact Management product | romc_MmFmMTI3sowe |

### Body

No request body is needed for a delete operation.

### Response

A successful deletion will yield a 200 status code. The response body will typically be empty, indicating that the contact has been successfully removed from the system.

> ⚠️ **Important: Deleting a Contact**
>
> Deleting a contact is a permanent action and cannot be undone. Please confirm the contact ID before proceeding with this operation to avoid unintended deletions.
>
>

## 5. Contact Search for Retrieval and Queries

While the ContactApp Product excels in managing contact details, for retrieving or searching for specific contacts, it's recommended to utilize the dedicated `Contact Search` API Key within the same service. This feature is specifically optimized for efficient and precise querying of contact data.

 For detailed instructions on how to use this functionality, please refer to the documentation [here](/analytics/docs/contact-search).

## Rate Limiting

The Contact Search and Contact Management APIs are limited to **60 requests per minute**, in a rolling window, across all the keys under your customer account.

If this limit is exceeded then a **429 Too Many Requests** response code will be returned.
