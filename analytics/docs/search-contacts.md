# Contact Search

Customers who need to find specific contact information in our Contact Database can utilize the following endpoint. This is particularly useful for locating contacts based on criteria like name, organization, or other attributes.

**Endpoint for Contact Search**: `https://api.8x8.com/directory-contacts/api/v3/contacts`

## 1. Obtain API Key for Contact Search Product

To use the Contact Search endpoint, you must obtain a **Contact Search API Key**. This key is specifically used for all GET requests to search and retrieve contact information without making modifications.

[How to get API Keys](/analytics/docs/how-to-get-api-keys)

## 2. Prepare Search Request

Construct your search query using the supported query parameters to filter and sort the contact database.

### Parameters

**Method: GET**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| x-api-key | ✓ | Pass the API key returned from Admin Console for Contact App product | romc_MmFmMTI3sowe |

#### Query Parameters

| Name | Description` | Example |
| --- | --- | --- |
| details | Details needed for contact***Available values*** : TAG, ADDRESS, PHONE, EMAIL, EXTENSION For an in-depth explanation of each parameter and the overall structure, please refer to our [Contact Object Structure Guide](/analytics/docs/contact-object-structure-guide) | PHONE,ADDRESS |
| filter | Filtering capabilities by using Feed Item Query Language (FIQL) filter expressions | firstName==John |
| filterByDisplayFlag | Flag to filter results by display criteria | true |

#### Query Parameters Description

**Filtering**

[Contact Object Structure Guide](/analytics/docs/contact-object-structure-guide)

> 📘 **Filtering**
>
> This API is designed with filtering capabilities by using Feed Item Query Language (FIQL) filter expressions.  
>
> FIQL introduces simple and composite operators which can be used to build basic and complex queries.  
>
> If the filter is not specified, All objects are returned.
>
> ***URL encoding notes (FIQL in query params)***
>
> When you pass FIQL in the filter query parameter, reserved characters are URL-encoded by clients/tools:
>
> * %3D = =, %3D%3D = ==
> * %27 = ', %3D%3D%27 = ==’
> * %2C = ,
> * %28 = (
> * %29 = )
> * %3B = ;
> * %40 = @
>
> Most clients encode automatically.
>
> ***FIQL Operators***:
>
> **Equality & Inequality**
>
> * `firstName==John` → Contacts with first name 'John'.
> * `firstName!=John` → Contacts without the first name 'John'.
>
> **Comparisons**
>
> * `createdTimestamp>25 or createdTimestamp=gt=25` → Contacts created after timestamp 25.
> * `createdTimestamp>=25 or createdTimestamp=ge=25` → Contacts created at or after timestamp 25.
> * `createdTimestamp<25 or createdTimestamp=lt=25` → Contacts created before timestamp 25.
> * `createdTimestamp<=25 or createdTimestamp=le=25` → Contacts created at or before timestamp 25.
>
> **Inclusion & Exclusion**
>
> * `pbxId=in=(US1,US2)` → Contacts with pbxId as 'US1' or 'US2'.
> * `pbxId=out=(US1)` → Contacts excluding those with pbxId as 'US1'.
>
> **Logical Operators**
>
> * `firstName==John;lastName==Doe` → Contacts with first name 'John' AND last name 'Doe'.
> * `firstName==John,lastName==Doe` → Contacts with first name 'John' OR last name 'Doe'.
>
> **Wildcards**
>
> * `firstName==Jo*` → Contacts with first names starting with 'Jo'.
> * `firstName!=*ohn` → Contacts with first names not ending with 'ohn'.
>
> The primary sub-objects you can query are:
>
> * **tags**: Accessible using fields such as tag.id, tag.name, etc.
> * **addresses**: Accessible using fields such as address.streetName , address.city , etc.
> * **phones**: Accessible using fields such as phone.phone, phone.purposeType , etc.
> * **emails**: Accessible using fields such as email.email , email.purposeType , email.primary, etc
> * **extensions**: Accessible using fields such as extension.extension, extension.pbxName, extension.pbxId, etc
>

#### Pagination Parameters

| Name | Description | Type | Example |
| --- | --- | --- | --- |
| scrollId | ID for scrolling through paginated results | String | WyI3YzA4YW0M2RjYTg2YWRiMzg2MDBkNTZhZCJd |
| size | The size of the page to retrieve | Integer | 10 |
| sort | Sorting criteria for the search results | String | name, ASC |
| useScrollId | Indicates if the scroll ID should be used | Boolean | true |

### Pagination

#### Keyset pagination

This pagination method implies searching contacts within a key range(keyset) and the usage of this method requires additional parameters:

* `useScrollId=true`
* `scrollId=WyI3YzA4YW0M2RjYTg2YWRiMzg2MDBkNTZhZCJd`
  * Received in server response, for first request
  * You just need to pass it back as request parameter for the next request (a different value will be received for each request). This is empty for the first request.
* `size=10&sort=id,ASC`
  * It is essential for sorting fields to contain "id" field
  * Additionally, you can also add sorting by other fields - ex "name"

## 3. Example Usage

### Without Pagination

#### Request

```bash
curl --location 'https://api.8x8.com/directory-contacts/api/v3/contacts?details=TAG%2CADDRESS%2CPHONE%2CEMAIL%2CEXTENSION&filter=contactType%3D%3D%27corporate%27%3BjobTitle%3D%3D%27Agent%27%3Bemail.email%3D%3Demail.changed%408x8.com' \
--header 'x-api-key: YOUR_CONTACT_SEARCH_API_KEY'

```

> 📘 **Request description**
>
> The request queries for contacts that are tagged as corporate and have the job title Agent, as well as a specific email [email.changed@8x8.com](mailto:email.changed@8x8.com). It asks for multiple details to be returned for each contact: TAG, ADDRESS, PHONE, EMAIL, and EXTENSION.
>
>

#### Response

```json
{
  "data": [
    {
      "id": "2h_JNsaISleZWA36GRh3YQ",
      "assignedUserId": "2h_JNsaISleZWA36GRh3YQ",
      "branchId": "ovYzzgfDSDqolA3RbhWjbw",
      "branchName": "Tech Support Division",
      "companyName": "8x8 Inc.",
      "contactType": "corporate",
      "createdTimestamp": 1621341000000,
      "customerId": "0016C00000VM1BeQAL",
      "department": "Support",
      "displayWhenNoExtension": true,
      "firstName": "James",
      "hideInAA": false,
      "jobTitle": "Agent",
      "lastName": "Miller",
      "locale": "en_US",
      "location": "San Jose, CA",
      "middleName": "Edward",
      "name": "James Edward Miller",
      "nickName": "Jim",
      "pbxId": "bhjLT03CTJuVwgAy9y3DOQ",
      "pbxName": "qmsarealenv1",
      "pictureHash": "a046a853f0e131f18001d1174d8588ff76172a1350ba5ff1ba081caa470f6e1e",
      "timeZone": "America/Los_Angeles",
      "updatedTimestamp": 1678182231575,
      "addresses": [
        {
          "id": 23071,
          "apartmentNumber": null,
          "city": "San Jose",
          "country": "United States",
          "county": "Santa Clara",
          "notes": "8x8 Headquarters",
          "postalCode": "95131",
          "primary": true,
          "purposeType": "BUSINESS",
          "state": "California",
          "streetName": "1st St",
          "streetNumber": "675"
        }
      ],
      "emails": [
        {
          "id": 86533,
          "email": "user@example.com",
          "primary": true,
          "purposeType": "WORK"
        }
      ],
      "extensions": [
        {
          "id": 52400,
          "branchId": "ovYzzgfDSDqolA3RbhWjbw",
          "branchName": "ContactSite",
          "contactId": "2h_JNsaISleZWA36GRh3YQ",
          "displayInDirectory": true,
          "extension": "60000001",
          "extensionType": "CC",
          "fqExtension": "1460000001",
          "pbxId": "bhjLT03CTJuVwgAy9y3DOQ",
          "pbxName": "qmsarealenv1",
          "subscriptionId": "aK60JcBERnKIya9Rt7BCxA",
          "subscriptionType": "UE"
        }
      ],
      "phones": [
        {
          "id": 48073,
          "phone": "04029511367",
          "primary": false,
          "purposeType": "HOME",
          "source": "EXTERNAL"
        },
        {
          "id": 48074,
          "phone": "0756124412",
          "primary": false,
          "purposeType": "WORK",
          "source": "EXTERNAL"
        }
      ],
      "tags": [
        {
          "id": 25672,
          "name": "customField2",
          "value": "value2"
        },
        {
          "id": 25673,
          "name": "customField1",
          "value": "value_updated"
        },
        {
          "id": 25674,
          "name": "customField3",
          "value": "value3"
        }
      ]
    }
  ],
  "meta": {
    "hasMore": false,
    "scrollId": null
  }
}

```

### With Pagination

#### Initial Request

When you first request a paginated response, you don't have a scrollId yet. The initial request is sent without it:

```text
GET https://api.8x8.com/directoryContacts/api/v3/contacts?size=10&sort=id,ASC&useScrollId=true
Authorization: Bearer {access_token}

```

#### Initial Response

```json
{
    "data": [
      // Data not shown here as it's available in the previous example
    ],
    "meta": {
        "hasMore": true,
        "scrollId": "WyI2ODA1MDUyZDc1ZjY0N2E5OTQxYzdiYTJjNDU5ODc5OSJd"
    }
}

```

> 📘 **Note**
>
> The initial response includes a scrollId, which is necessary for subsequent paginated requests. This ID ensures that the subsequent requests fetch the next set of results in the sequence. Remember to use page=0 in conjunction with scrollId for keyset pagination.
>
>

#### Subsequent Request with `scrollId`

For the next set of results, you'll use the scrollId provided in the initial response:

```text
GET https://api.8x8.com/directoryContacts/api/v3/contacts?page=0&size=10&sort=id,ASC&useScrollId=true&scrollId=WyI2ODA1MDUyZDc1ZjY0N2E5OTQxYzdiYTJjNDU5ODc5OSJd
Authorization: Bearer {access_token}

```

#### Subsequent Response

```json
{
    "data": [
      // Data not shown here as it's available in the previous example
    ],
    "meta": {
        "hasMore": true,
        "scrollId": "WyI3YzA4YWM5ZjkxNTU0M2RjYTg2YWRiMzg2MDBkNTZhZCJd"
    }
}

```

## Rate Limiting

The Contact Search and Contact Management APIs are limited to **60 requests per minute**, in a rolling window, across all the keys under your customer account.

If this limit is exceeded then a **429 Too Many Requests** response code will be returned.
