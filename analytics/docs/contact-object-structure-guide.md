# Contact Object Structure

This section is dedicated to the Contact object structure, which is a central element in contact management. This guide will help you understand the detailed structure of the Contact object used across various endpoints, such as contact details retrieval, updates, and listings.

> 📘 **Contact Types**
>
> In our system, contacts are categorized as follows:
>
> * **Corporate** or **Service**
>
>
> >
> > These are pre-configured or system-generated contacts that are essential for the functioning of various services or corporate operations.
> >
> >
> >
>
> * **Company**
>
>
> >
> > These are user-defined or manually added contacts that represent individuals or company entities outside of the core system functionalities.
> >
> >
> >
>
> This API allows modifications to company contacts only. You can create, update or delete company contacts as needed. Please note that modifications to other types of contacts are not supported
>
>

## Contact JSON Object Structure

Below is the detailed JSON structure of the Contact object. This structure is utilized in several API endpoints related to contact operations.

```json
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
            "purposeType": "WORK",
            "state": "California",
            "streetName": "1st St",
            "streetNumber": "675"
        }
    ],
    "emails": [
        {
            "id": 86533,
            "email": "contact@example.com",
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
            "primary": true,
            "purposeType": "WORK",
            "source": "EXTERNAL"
        },
        {
            "id": 48074,
            "phone": "0756124412",
            "primary": false,
            "purposeType": "HOME",
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

```

> 🚧 **Legacy Field Usage**
>
> In the latest version of our application, we have retained certain fields from the previous system iteration, such as **subscriptionId** and **contactRecordId**, for archival and reference purposes. These fields are crucial in preserving historical data linkages and ensuring continuity.
>
> **We advise against using these legacy fields for current decision-making or feature development**
>
>

## Detailed Field Descriptions

### Basic Information

| Name | Type | Description | Example | Applicability | Restrictions |
| --- | --- | --- | --- | --- | --- |
| id\* | string | Unique identifier for the contact | null (auto-generated) | All | Read Only |
| assignedUserId | string | Identifier for the user to whom the contact is assigned | bhjT03CtUvWgAy9b3DOQ | Corporate | Read Only |
| branchId | string | Identifier for the site where the contact is located | br_301 | All | Max 64 chars |
| branchName | string | Name of the site where the contact is located | Tech Support Division | All | Max 128 chars |
| companyName | string | Name of the company the contact is associated with | 8x8 Inc. | Company | Max 128 chars |
| contactType\* | string | Type of contact, e.g., company | company | All | Read Only Enum: company, corporate, service |
| customerId\* | string | Identifier for the customer to whom the contact belongs | 0016C00000VM1BeQAX | All | Max 32 chars |
| department | string | Department within the company where the contact works | Support | Company, Corporate | Max 100 chars |
| displayWhenNoExtension | boolean | Flag to control visibility of a corporate contact that does not have an extension (i.e. a user with no license). This setting is ignored for corporate contacts that have one more more extensions (extensions[x].displayInDirectory will be used instead) | false | Corporate | Read Only |
| firstName | string | First name of the contact | Alicia | Company, Corporate | Max 128 chars |
| jobTitle | string | Professional title of the contact | Account Manager | Corporate | Read Only |
| lastName | string | Last name of the contact | Rodriguez | Company, Corporate | Max 30 chars |
| locale | string | Locale setting representing the contact's language and region format | en_US | Company, Corporate | This expects a language code(en-US), or a string representation(en_US) |
| location | string | Physical or office location of the contact | New York Office | Company | Max 128 chars |
| middleName | string | Middle name of the contact | B. | Company, Corporate | Max 30 chars |
| nickName | string | Nickname or informal name used for the contact | Ali | Company, Corporate | Max 30 chars |
| pbxId | string | Identifier for the PBX associated with the contact | tVK8Vd5Aj1yskcl_-_13A | All | Max 32 chars |
| pbxName | string | Name of the PBX associated with the contact | voedidionworkflow25 | All | Max 32 chars |
| pictureHash | string | A unique hash value representing the picture, used for verification purposes. | a046a853f0e131f18001d1174d | Company, Corporate | Read Only |
| subscriptionId | string | Unique identifier for the subscription | 0_0qy7cCMFK1HEXLZZA | Service | Read Only |
| subscriptionName | string | The name of the subscription plan or service | Helpdesk | Service | Read Only |
| subscriptionType | string | Indicates the service type associated with this extension. It defines which service or functionality the extension is currently linked to or utilizing. | CQ | Service | Read Only Supported Values: UE, VCCE, RG, CQ, AA |
| subscriptionUserId | string | Identifier for the user associated with the subscription | 0eDDyAIIQU1Sb771BB23g | Service | Read Only |
| timeZone | string | Time zone where the contact is located | America/New_York | Company, Corporate | Accepts region-based zone IDs only (e.g., "America/New_York") |

### Addresses

| Name | Type | Description | Example | Restrictions |
| --- | --- | --- | --- | --- |
| apartmentNumber | string | The specific apartment number within a building or complex | 102 | Max 5 digits |
| city | string | The city of the contact’s address | San Jose | Max 64 chars |
| country | string | The nation where the address is located | United States | Max 64 chars |
| county | string | The county of the contact's address | Santa Clara | Max 64 chars |
| notes | string | Additional notes about the address | 8x8 Headquarters | Max 128 chars |
| postalCode | string | The postal or ZIP code for the address | 95131 | Max 16 chars |
| primary | boolean | Indicates if this is the primary address for the contact | true |  |
| purposeType | string | The intended use of the address (e.g., WORK, HOME) | WORK | Supported Values: HOME, WORK, OTHER |
| state | string | The state or region in which the contact is located | California | Max 64 chars |
| streetName | string | The name of the street for the address | 1st St | Max 64 chars |
| streetNumber | string | The house or building number | 675 | Max 8 chars |

### Emails

| Name | Type | Description | Example                         | Restrictions |
| --- | --- | --- |---------------------------------| --- |
| email\* | string | The email address associated with the contact | [contact@example.com](mailto:contact@example.com) | Valid email format; must be unique |
| primary\* | boolean | Indicates if this is the primary email address for the contact | true                            | Only one email can be designated as primary |
| purposeType\* | string | The intended use of the email address | WORK                            | Supported Values: HOME, WORK, OTHER |

### Phones

| Name | Type | Description | Example | Restrictions |
| --- | --- | --- | --- | --- |
| phone\* | string | Phone number of the contact. Recommended format: E.164 without punctuation | +18005551234 | Valid phone format; must be unique |
| primary\* | boolean | Indicates if this is the primary phone number for the contact | true | Only one phone can be designated as primary |
| purposeType\* | string | The intended use of the phone number | WORK | Supported Values: HOME, HOME_FAX, WORK, WORK_FAX, MOBILE, PAGER, OTHER |
| source | string | Origin of the phone number | EXTERNAL | Supported Value: EXTERNAL |

### Tags

| Name | Type | Description | Example | Restrictions |
| --- | --- | --- | --- | --- |
| name\* | string | The name or key of the tag | customField1 | Limited to 10 values like **customField1** through **customField10.** |
| value | string | The value assigned to the tag | value1 | Max 254 chars |

> 📘 **Mandatory Attributes**
>
> Fields marked with an asterisk (\*) are mandatory for creating a contact. These attributes are essential and a contact cannot exist without them.
>
>

### Extensions

| Name | Type | Description | Example | Restrictions |
| --- | --- | --- | --- | --- |
| branchId | string | Unique identifier for the branch | ovYzzgfDSDqolA3RbhWjbw | Read Only |
| branchName | string | Name of the branch where the extension is located | DowntownBranch | Read Only |
| contactId | string | Unique identifier for the associated contact | 2h_JNsaISleZWA36GRh3YQ | Read Only |
| displayInDirectory | boolean | Indicates if the extension is visible in the directory | true | Read Only |
| extension | string | Extension number | 60000001 | Read Only |
| extensionType | string | Indicates whether it is a UC or CC extension | CC | Read Only |
| fqExtension | string | Fully qualified extension number | 1460000001 | Read Only |
| hideInAA | boolean | Flag to hide the contact in the Auto Attendant | true | Read Only |
| pbxId | string | Unique identifier for the PBX | bhjLT03CTJuVwgAy9y3DOQ | Read Only |
| pbxName | string | Name of the PBX system associated with the extension | qmsarealenv1 | Read Only |
| subscriptionId | string | Unique identifier for the subscription | aK60JcBERnKIya9Rt7BCxA | Read Only |
| subscriptionType | string | Type of subscription | UE | Read Only |

> 🚧 **Extensions Operational Restrictions**
>
> Considered system-generated resources, we restrict modifications to extensions to maintain system integrity.
>
>

### Visibility Flags Information

| Name | Type | Description | Level | Example |
| --- | --- | --- | --- | --- |
| displayInDirectory | boolean | Indicates if the extension is visible in the directory | Extension | true |
| displayWhenNoExtension | boolean | Indicates whether to display the contact when there is no extension number associated | Contact | false |
| hideInAA | boolean | Determines if the contact should be hidden in the Auto Attendant | Extension | true |
