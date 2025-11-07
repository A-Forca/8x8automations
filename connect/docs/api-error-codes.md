# API Error codes

> ℹ️ **Troubleshooting tip**
>
> This page documents **platform level** API error codes returned in 8x8 API responses.  
>
> For delivery related errors coming back *after* we hand messages to suppliers, see the [Messaging Apps Delivery Receipt Error Codes](/connect/reference/delivery-error-codes)  reference and [SMS Delivery Receipt Error Codes](/connect/reference/delivery-receipts-error-codes)
>
>

## HTTP Error Codes

8x8 API might return the following HTTP error codes:

| Code | Description |
| --- | --- |
| 200 | **OK**, The request has succeeded. |
| 201 | **Created**, The request has succeeded and a new resource has been created as a result. |
| 202 | **Accepted**, The request has been received but not yet acted upon. |
| 204 | **No Content**, The request has succeeded, but there is no content to send as a response. |
| 400 | **Bad Request**, Request has invalid syntax. |
| 401 | **Unauthorized**, The client must provide the correct API key in the `Authorization` header. |
| 403 | **Forbidden**, The client is authenticated but does not have permissions to the content |
| 404 | **Not Found**, The server can not find the requested resource. |
| 410 | **Gone**, The requested content has been permanently deleted from the server, with no forwarding address. This usually applied to the API version that's not supported anymore. |
| 422 | **422 Unprocessable Entity**, The request was well-formed but was unable to be followed due to semantic errors. |
| 429 | **Too Many Requests**, The user has sent too many requests in a given amount of time ("rate limiting"). |
| 500 | **Internal Server Error**, The server has encountered a situation it doesn't know how to handle. |

All API responses with HTTP code 400 and above has the following properties:

* `code` (integer) - Error code
* `message` (string) - Human-readable error description
* `errorId` (UUID) - Unique id of the error. You can use it as a reference when sending inquiries to 8x8 support.
* `timestamp` (string, date-time) - Date and time of the error occurrence. Format: `yyyy-MM-ddTHH:mm:ss.ffZ`

Example of error JSON object returned by the API

```json
{
    "code": 1300,
    "message": "Object wasn't found or is already expired",
    "errorId": "1cc1eda1-f5dd-ea11-8288-0263195dd35a",
    "timestamp": "2020-12-22T05:52:01.85Z"
}

```

## API Response Property Values

The table below refers to the possible values of the "code" parameter, in the response body returned by the API as shown above. They can be used for additional clarity of what type of error was encountered.

#### SMS API, Messaging API

| Code | Description |
| --- | --- |
| 1000 | Invalid parameter |
| 1001 | Illegal SubAccountId |
| 1002 | Invalid MSISDN |
| 1003 | Invalid Encoding |
| 1004 | Invalid Text |
| 1005 | Invalid Source |
| 1006 | Invalid Expiry |
| 1007 | Invalid SMS Template |
| 1008 | Invalid ID |
| 1009 | Invalid Country Code |
| 1010 | Parameter out of range |
| 1011 | Invalid Schedule Time |
| 1012 | Invalid Ip Address |
| 1100 | Bulk limit reached |
| 1200 | Unauthorized Access |
| 1201 | Access forbidden |
| 1300 | Not found |
| 1400 | Resending interval violation |
| 2000 | Internal Error |
| 2001 | Function not implemented |
| 2002 | Unsupported API version |
| 2003 | Unsupported product |
| 3001 | Missed User |
| 3002 | Missed MSISDN |
| 3003 | Invalid MSISDN |
| 3004 | Missed Content |
| 3005 | Missed Text |
| 3006 | Too long text |
| 3007 | Missed Media URL |
| 3008 | Invalid Media URL |
| 3009 | Too long ClientMessageId |
| 3010 | Invalid Content Type |
| 3011 | Too long SMS Source |
| 3012 | Missed messages |
| 3013 | Too much messages |
| 3014 | Too long ClientBatchId |
| 3015 | Missed UserId |
| 3016 | Missed WeChatUserId |
| 3017 | Too long Fallback text |
| 3018 | Invalid Country code |
| 3019 | Missed FacebookUserId |
| 3020 | Invalid DR Callback URL |
| 3021 | Empty or Invalid Location |
| 3022 | Invalid Fallback Channel |
| 3023 | Invalid Fallback Delay range |
| 3024 | Invalid Fallback Status |
| 3025 | Invalid Fallback Status Delivered |
| 3026 | Invalid Fallback Status Read |
| 3027 | Invalid Fallback SubAccount Channel |
| 3028 | Missed ZaloUserId |
| 3029 | Missed UMID |
| 3030 | Empty Template |
| 3031 | Invalid Template Name Length |
| 3032 | Invalid Template Name |
| 3033 | Too much template parameters passed |
| 3034 | Invalid template components combination |
| 3035 | SubAccount don’t have channels, supported templates |
| 3036 | Empty Template language |
| 3037 | Invalid Template language |
| 3038 | Template not found |
| 3039 | Invalid Template Component type |
| 3040 | Empty template parameters |
| 3041 | Invalid Template parameter |
| 3042 | Invalid Template parameter type |
| 3043 | Template Text parameter length exceeded |
| 3044 | Template Location parameter empty |
| 3045 | Template parameter not allowed |
| 3046 | Template parameter URL is invalid |
| 3047 | Missed WhatsApp UserID |
| 3048 | Using ChatGroupId with UserId not allowed |
| 3049 | Invalid button parameter |
| 3050 | Missed KakaoId |
| 3051 | Invalid Fallback ChannelID |
| 3052 | Invalid Template Component SubType |
| 3053 | Invalid index |
