# Send SMS API

To send a single SMS using the 8x8 SMS API you need to submit a `JSON` object to the URL
`https://sms.8x8.com/api/v1/subaccounts/{subAccountId}/messages`.

The JSON object has the following properties:

| Property name | Property type | Description |
| --- | --- | --- |
| destination | string\* | **Required**. Destination phone number. |
| text | string\* | **Required**. SMS body (ie: text of the message). |
| source | string | Alphanumeric or numeric string used as Sender ID for the SMS. |
| clientMessageId | string | Unique id that you want to associate with the SMS (*50 chars max*) |
| encoding | string | `enum`, Character set to use for this SMS. Possible values are `AUTO`, `GSM7`, `UCS2` |
| scheduled | string | `timestamp`, Pre-defined date and time for this SMS to be sent in the future. |
| expiry | string | `timestamp`, Maximum date and time for this SMS to be sent at |
| dlrCallbackUrl | string | `uri`, Webhook URL where delivery status for the SMS will be posted (*Overwrites your default account callback URL* |

## Parameters overview

Below is a more detailed description of the parameters in the SMS request body (`JSON` object submitted to the API)

### destination

* This property is mandatory.
* This is the destination phone number for the SMS.
* The destination should be submitted following the international format and should include the country code (the leading + sign can be omitted but this is not an obligation).

Valid examples: `+12025550308`, `12025550308`

> 👍
>
> We also accept national formats (for national you have to specify the `country` in the dedicated field).
>
>

### text

* This property is mandatory
* The text or the message (or SMS body) is the main part of your SMS: it is what is going to be displayed on the destination handset.
* It can contain characters from the GSM7 character set or from the UNICODE character set (see next section for more information).
* According to the encoding of the SMS, the number of SMS accounted per message will be proportional to the length of the text:
  * **For GSM7 messages**:
    * if the total length of the message is inferior or equal to 160 characters then the first and only message part can accommodate 160 characters.
    * If the total length is superior to 160 characters then each message part can contain 153 characters (fewer characters can be fit into one part as extra data space is taken to concatenate the SMS on the destination handset)
  * **For Unicode messages**:
    * if the total length of the message is inferior or equal to 70 characters then the first and only message part can accommodate 70 characters.
    * If the total length is superior to 70 characters then each message part can contain 67 characters (fewer characters can be fit into one part as extra data space is taken to concatenate the SMS on the destination handset)
  * For Unicode messages, 70 characters = 1 SMS (1 part)
* The maximum length for a message is 10 message parts. Longer messages will be truncated to this limit and sent.

### source

* This value is optional.
* The source value can also be called `senderID` or TPOA.
* It is the from address that will be used when delivering the SMS to the handset.
* It can take different formats:
  * **Alphanumeric** *(example: MyBrand):* this is the case when a source is composed of an alphanumeric string (max 11 characters: letters from the ASCII character set, digits and the space character). Alphanumeric sources are generally used for branded SMS to help the SMS receiver to identify the brand or services which originated the SMS.
  * **Numeric** *(example: +6512345678):* this the case when a source is composed of a string made purely of digits (max 17 chars). It can also start with the + sign. Numeric sources are generally used when the originator intends to receive an answer to the SMS as it is interpreted as a regular phone number by the destination handset.

> 🚧 **Limitations**
>
> According to the country where the SMS is sent to, the sources can be overwritten in order to ensure better delivery. If you have some specific inquiries related to the type of source available for your account towards a specific destination, please [contact your account manager](mailto:sales-cpaas@8x8.com).
>
>

### clientMessageId

* This value is optional.
* If used, the `ClientMessageId` allows you to submit SMS associated to your custom message ID. That way, you are able to match the information contained in the API response  with the ID from your own business logic. You can later read `ClientMessageId` from delivery reports.
* The maximum length allowed for the `ClientMessageId` is 50 characters.

### encoding

`AUTO`, `GSM7` or `UCS2`

* This property is optional. The default value is `AUTO`.
* **AUTO**: the API will analyze the content of your SMS text and select the correct encoding according to the characters used: if your SMS text contains UNICODE characters, then UNICODE will be selected, otherwise it will be GSM7
* **GSM7**: by using GSM7, you are forcing the encoding in use to be GSM 7 bit: it will render correctly any of the characters from the character set (See a complete list [here](https://en.wikipedia.org/wiki/GSM_03.38#GSM_7-bit_default_alphabet_and_extension_table_of_3GPP_TS_23.038_.2F_GSM_03.38)). 8x8 SMS API considers each block of 160 GSM 7 bit characters as 1 SMS unit.
* **UCS2**: by using UCS2, you are forcing the encoding in use to be UNICODE: it will render correctly any of the characters from the UNICODE character set (See a complete list [here](https://en.wikipedia.org/wiki/List_of_Unicode_characters8)). 8x8 SMS API considers each block of 70 UNICODE characters as 1 SMS unit.

### scheduled

* This property is optional.
* The scheduled parameter should be used if you wish to schedule your message up to 7 days in advance. The SMS will be stored on the 8x8 SMS platform and sent out at the predefined time and date. You can specify the scheduling timestamp using the standard ISO 8601 format (which includes and specifies the timezone offset to use):

Example: `2016-11-07T19:20:30+08:00`

### expiry

* This property is optional.
* The expiry parameter should be used if you wish to specify a maximum time and date for the SMS to be sent. If for any reason the 8x8 SMS platform fails to send the message before the date and time predefined, the SMS will be discarded.
  You can specify the expiry timestamp using the standard ISO 8601 format (which includes and specifies the timezone offset to use):

Example: `2016-11-07T19:20:30+08:00`

### dlrCallbackUrl

* This property is optional.
* The `dlrCallbackUrl` allows specifying a webhook URL (a.k.a callback URL) that will be used to POST the delivery reports for the SMS sent in the request
* If included in the request, the webhook URL in the request will be used instead of your default account webhook

> 👍
>
> We strongly recommend to set a default webhook (a.k.a callback URL) for your account using a [Webhooks Configuration API](/connect/reference/webhooks-configuration-api)
>
>

## Response

8x8 API returns the following response:

| Property name | Property type | Description |
| --- | --- | --- |
| umid | string | `uuid`, unique message ID automatically generated by 8x8 |
| clientMessageId | string | Message ID that you submitted (if any) |
| destination | string | Destination phone number to which the SMS was sent to |
| encoding | string | Final encoding that will be used for SMS. Helpful when initial `encoding` was set to `AUTO` and you want to know detected SMS encoding. |
| status | object | The object, which contains the information about a message status |

Status object description

| Property name | Property type | Description |
| --- | --- | --- |
| code | string | The status code can be either:<br>- `QUEUED`: the SMS has been accepted by 8x8 SMS API and is queued for processing.<br>- `REJECTED`: the SMS has been rejected by 8x8 SMS API and the reason is stated in the description field. It will not be processed. |
| description | string | This field describes the status code and provides additional information explaining the status. |

> 📘 **Downloading SMS APIs (OAS File)**
>
> You can download the OAS File - **[Click Here](https://github.com/8x8Cloud/public-developer-docs/blob/master/docs_oas/connect/sms_api.json)**  
>
> ***Please do take note that the file provides all the SMS APIs so please look through the .OAS file and select the specific SMS API(s) required.***
>
>
