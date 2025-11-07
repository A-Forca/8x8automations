# Cloud Storage Service Bulk Download

Customers looking to download content in bulk from [Cloud Storage Service](/analytics/reference/searchobject) can follow the this multi step process. Use cases include downloading 8x8 Work Call Recordings, Meeting Recordings, Contact Center Recordings or any of the other data types in the Cloud Storage Service.

> 📘 **You will need a working API key to begin**
>
> [How to get API Keys](/analytics/docs/how-to-get-api-keys)
>
> To create a "Call Recording & Storage" API Keys, the user must first have the 'Cloud Storage API' assignment. This assignment must be granted by the Super Admin.
>
>

For interacting with Cloud Storage Service `https://api.8x8.com/storage/{region}/v{version}/`

* {region} to be replaced by a valid region based on region discovery
* {version} to be replaced by current Version. Currently 3 resulting in /v3/

## 1. Authenticate to retrieve access token

[OAuth Authentication for 8x8 XCaaS APIs](/analytics/docs/oauth-authentication-for-8x8-xcaas-apis) is used to get a temporary `access_token` for use in with this API

**Outputs For Next Step:**

* access_token
* expires_in

The following steps will use the access_token as a Bearer Token form of authentication. This takes the form of the  

`Authorization` header being set to `Bearer access_token` (Space between Bearer and the access_token)

## 2. Get My Regions

8x8 Cloud Storage Service persists data regionally based on the customer locations/setup. For many customers this may be a single region for others this can be a number of regions. Each Region contains it's metadata/database and storage only. You cannot search in "us-east" and find items in "uk" since this could involve data export.

### Parameters

**Method: GET**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| region | ✓ | Pass any valid region in for the discovery process. `us-east` or `uk` (The region does not need to be one of your regions for this request | `us-east` |
| version | ✓ | The current version is `v3` | v3 |

### My Regions Request

genericus-eastuk

```bash
curl --location --request GET 'https://api.8x8.com/storage/{region}/v3/regions' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer {access_token}'

```

```bash
curl --location --request GET 'https://api.8x8.com/storage/us-east/v3/regions' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer {access_token}'

```

```bash
curl --location --request GET 'https://api.8x8.com/storage/uk/v3/regions' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer {access_token}'

```

### Regions Response

```json
[
    "us-east",
    "uk"
]

```

**Outputs For Next Step:**

* region

> 📘 **Only one region at a time can be searched.**
>
> If you have multiple regions and your use case spans regions. If you want to download all recordings for a specific date then steps 3 - 5 need to be performed per region
>
>

## 3. Find Objects

> 🚧 **Only objects with a state of AVAILABLE are returned unless other object states are specifically requested.**
>
> To return objects in multiple states specify this in the filter.  
>
> Example to return all objects that are REVOKED and AVAILABLE the filter should include `(objectState==AVAILABLE,objectState==REVOKED)`  
>
> In FIQL ; = AND and , = OR
>
>

### Parameters

**Method: GET**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| region | ✓ | The region you are want to search in. **Must be one of the regions returned by the Regions request** | us-east |
| version | ✓ | The current version is `v3` | v3 |

#### Query

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| pageKey | ☐ | Optional on first page, first page is 0 (zero), see pagination example below. | 0 |
| limit | ☐ | Number of records per page, 100 is the default. | 200 |
| filter | ☐ | filter to apply when searching See **FIQL Query Guide** | type==callcenterrecording;duration=gt=100 |
| sortField | ☐ | the field to sort on | createdTime |
| sortDirection | ☐ | whether to sort ascending `ASC` or descending `DESC` | ASC |

In our example we are going to find all Contact Center Call Recordings in the `us-east` region `type==callcenterrecording` that have a duration of over 100 seconds `duration=gt=100` and we will sort be createdTime `sortField=createdTime` ascending `sortDirection=ASC` and get the first page `pageKey=0` and get 100 records per page `limit=100`

Combined the query becomes `filter=type==callcenterrecording;duration=gt=100&sortField=createdTime&sortDirection=ASC&pageKey=0&limit=100`

[Cloud Storage Service Objects](/analytics/docs/cloud-storage-service-objects) has a more examples of filtering options.

### Find Objects Request

```bash
curl --location --request GET 'https://api.8x8.com/storage/{region}/v3/objects?filter=type==callcenterrecording;duration=gt=100&sortField=createdTime&sortDirection=ASC&pageKey=0&limit=100' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer {access_token}' 

```

### Find Objects Response

> 🚧 **TAGS SHORTENED TO KEEP SAMPLE SHORT**
>
> NOTE TAGS HAVE BEEN SHORTENED FOR SIMPLICITY, SEE [Cloud Storage Service Objects](/analytics/docs/cloud-storage-service-objects) for details on additional object types.
>
>

**Response:**

```json
{
  "lastPage": true,
  "pageKey": 100,
  "pageSize": 2,
  "content": [
    {
      "id": "58bc5748-339b-43c2-ad15-572a35dc3aad",
      "type": "callcenterrecording",
      "mimeType": "audio/mpeg",
      "objectName": "int-1819420cbe2-sHtEBArUkmmtmyczfbcDGWMwl-phone-00-supertenantcsm01.mp3",
      "checksumType": "MD5",
      "checksum": "922ce8066731381f4a843e0bcf013826",
      "customerId": "0012J00002KTQJYQA5",
      "userId": "TMZIdbKzQGWvvi_04IC9Lg",
      "storedBytes": 3644352,
      "createdTime": "2022-06-24T05:22:35",
      "updatedTime": "2022-06-24T05:22:37",
      "objectState": "AVAILABLE",
      "bucketId": "4339ea5d-36c2-4105-8225-1f8e916ebebe",
      "tags": [
        {
          "key": "callId",
          "value": "int-1819420cbe2-sHtEBArUkmmtmyczfbcDGWMwl-phone-00-supertenantcsm01"
        }
      ],
      "shared": false
    },
    {
      "id": "b6aca571-ebe2-40ed-b553-24b8dc3bc035",
      "type": "callcenterrecording",
      "mimeType": "audio/mpeg",
      "objectName": "int-181940b61ea-IMzQUGTvUjs03b07NaxsLqfJ3-phone-00-supertenantcsm01.mp3",
      "checksumType": "MD5",
      "checksum": "713aba80d38d371471bdb6357b66a8ff",
      "customerId": "0012J00002KTQJYQA5",
      "userId": "TMZIdbKzQGWvvi_04IC9Lg",
      "storedBytes": 96768,
      "createdTime": "2022-06-24T04:50:08",
      "updatedTime": "2022-06-24T04:50:08",
      "objectState": "AVAILABLE",
      "bucketId": "5a079a66-e669-4e68-a0a1-6481d1c5bfbc",
      "tags": [
        {
          "key": "callId",
          "value": "int-181940b61ea-IMzQUGTvUjs03b07NaxsLqfJ3-phone-00-supertenantcsm01"
        }
      ],
      "shared": false
    }
  ]
}

```

**Outputs For Next Step:**

* id's of the objects we want to download.
* objectName => these will be the file names within the zip file after the zip is downloaded

### Pagination

This is controlled by `pageKey` and `limit`

* `limit` is the number of records to return per page.
* `pageKey` is the offset from the beginning of the returned content. Start at zero, if there are multiple pages then the returned pageKey will be the input for the next request.

**Pagination Example**  

Assuming there will be 245 records in total. With an initial input of `pageKey=0&limit=100` the returned meta data will be

```json
{
    "lastPage": false,
    "pageKey": 100,
    "pageSize": 100,
    "content": [ ]
}

```

The request for the next page would be `pageKey=100&limit=100` the pageKey has been incremented to the value returned, the following result would be.

```json
{
    "lastPage": false,
    "pageKey": 200,
    "pageSize": 100,
    "content": [ ]
}

```

The request for the next page would be `pageKey=200&limit=100` the pageKey has been incremented to the value returned, the following result would be.

```json
{
    "lastPage": true,
    "pageKey": 300,
    "pageSize": 45,
    "content": [ ]
}

```

Note: the `lastPage` is now true indicating that there are no more records and the `pageSize` is 45 which is less than the requested `limit` of 100, be aware the pageKey HAS INCREMENTED and should NOT be used to determine if the last page has been reached.

## 4. Create Bulk Download

### Parameters

**Method: POST**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| region | ✓ | The region the objects are in. **Must be one of the regions returned by the Regions request** | us-east |
| version | ✓ | The current version is `v3` | v3 |

#### Body

Array of object ids to be downloaded

```json
[
    "58bc5748-339b-43c2-ad15-572a35dc3aad",
    "b6aca571-ebe2-40ed-b553-24b8dc3bc035"
]

```

### Create Download Request

```bash
curl --location --request POST 'https://api.8x8.com/storage/{region}/v3/bulk/download/start' \
--header 'Authorization: Bearer {access_token}' \
--header 'Content-Type: application/json' \
--data-raw '[
    "58bc5748-339b-43c2-ad15-572a35dc3aad",
    "b6aca571-ebe2-40ed-b553-24b8dc3bc035"
]'

```

### Create Download Response

Assuming success, the return will give information on the zipName of the download to be created, the status should be `NOT_STARTED` or `DONE` if it has completed very quickly

**Response:**

```json
{
    "zipName": "0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip",
    "status": "NOT_STARTED"
}

```

**Outputs For Next Step:**

* status
* zipName

## 5. Check Download Status

Check for the download status until the status equals DONE (or an error status..), most use cases are not time critical so leave a sensible delay between polling ( 15-30 seconds perhaps)

### Parameters

**Method: POST**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| region | ✓ | The region the objects are in. **Must be one of the regions returned by the Regions request** | us-east |
| version | ✓ | The current version is `v3` | v3 |
| zipName | ✓ | the `zipName` returned in the create download request | 0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip |

### Check Download Status Request

```bash
curl --location --request GET 'https://api.8x8.com/storage/{region}/v3/bulk/download/status/0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip' \
--header 'Authorization: Bearer  access_token' \
--header 'Content-Type: application/json' 

```

### Check Download Status Response

```json
{
    "zipName": "0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip",
    "status": "DONE"
}

```

**Outputs For Next Step:**

* status
* zipName

## 6. Download Zip File

Once the status is `DONE` then we can download the content

### Parameters

**Method: POST**

#### Headers

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| Authorization | ✓ | Pass the access_token returned from the authentication request as a Bearer token `Bearer {access_token}` | Bearer kfjdfi3jfopajdkf93fa9pjfdoiap |

#### Path

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| region | ✓ | The region the objects are in. **Must be one of the regions returned by the Regions request** | us-east |
| version | ✓ | The current version is `v3` | v3 |
| zipName | ✓ | the `zipName` returned in the create download request | 0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip |

### Download Zip File Request

```bash
curl --location --request GET 'https://api.8x8.com/storage/{region}/v3/bulk/download/0bccb889-09f1-4092-a4d7-d1b8c05c0c31.zip' \
--header 'Authorization: Bearer {access_token}' \
--header 'Content-Type: application/json'

```

### Download Zip File Response

**Response:**  

In the case of callcenterrecording the response will be a zip file containing 1 mp3 per object Id  

The mp3 files will be named per the objectName from step 3.

Example file names within zip file:

* int-181940b61ea-IMzQUGTvUjs03b07NaxsLqfJ3-phone-00-supertenantcsm01.mp3
* int-1819420cbe2-sHtEBArUkmmtmyczfbcDGWMwl-phone-00-supertenantcsm01.mp3

> 🚧 **The meta data and content type vary for each object type**
>
> The Zip file will contain the contents of the objects and the file names within the zip file will be the objectName. It is possible to request objects of multiple types in a single download so the content type/file type need not be the same.  
>
> Example: If you downloaded a callrecording and the transcript of the call then the content would be two files, one with mp3 content and one with json content.
>
>
