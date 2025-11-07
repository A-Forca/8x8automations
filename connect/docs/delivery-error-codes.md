# Messaging Apps Delivery Receipt Error Codes

> ℹ️ **Troubleshooting tip**
>
> The table below lists *delivery receipt* error codes for Messaging Apps  
> If you are debugging an error that appears in the JSON body of an 8x8 **API response** (for example `"code": 3038`), please see the [API Error Codes](/connect/reference/api-error-codes) reference instead.
>

Possible error codes returned in the Messaging Apps delivery receipts include:

## General Error Codes

| Code | Possible reason                                | Description                                                                                               |
| :--- | :--------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| 1    | AbsentSubscriber                               | Subscriber is not registered in this chat channel                                                         |
| 2    | ContentRelatedError                            | Content Type is not supported by this channel                                                             |
| 3    | DataMissing                                    | The request is missing a required parameter.                                                              |
| 9    | EquipmentProtocolError                         | The receiver's app version is not capable of receiving business messages                                  |
| 11   | Flooding                                       | Too many messages sent to the recipient in a short period of time.                                        |
| 14   | InternalError                                  | Internal error                                                                                            |
| 15   | InvalidDestination                             | UserId is not valid for that channel or is part of blacklist on Connect                                   |
| 18   | Invalid parameter                              | Invalid or missing parameters. Check that all required parameters are passed and are of the correct type. |
| 23   | ConnectionError                                | Channel connection error                                                                                  |
| 25   | Operation Aborted By Receiving Network Or User | Message is intentionally undelivered by Channel                                                           |
| 29   | PhoneRelatedError                              | The specified parameter value is invalid.                                                                 |
| 36   | Expired                                        | Message expired (not delivered at the requested time)                                                     |
| 41   | SmscReject                                     | Message rejected by Chat channel                                                                          |
| 42   | NoCredit                                       | Not enough credit on Account wallet                                                                       |
| 43   | SpamFilter                                     | Message filtered by anti-spam reason                                                                      |
| 46   | SubscriberNotReachable                         | Message sent to Channel, but user is not reachable for delivery                                           |
| 61   | SessionExpired                                 | Message trashed by session expired reason                                                                 |

## WhatsApp Error Codes

| Code | Possible Reasons           | Description                                                                                       |
| :--- | :------------------------- | :------------------------------------------------------------------------------------------------ |
| 1000 | Authentication failed      | AuthException — Unable to authenticate app user (WhatsApp: 0)                                     |
| 1001 | Method not allowed         | API Method — Capability/permissions issue (WhatsApp: 3)                                           |
| 1002 | Rate limit exceeded        | API Too Many Calls — App rate limit reached (WhatsApp: 4)                                         |
| 1003 | Permission missing         | Permission Denied — Permission not granted or removed (WhatsApp: 10)                              |
| 1004 | Invalid value              | Parameter value not valid — Business phone number deleted (WhatsApp: 33)                          |
| 1005 | Invalid parameter          | Invalid parameter — Misspelled or unsupported parameter (WhatsApp: 100)                           |
| 1006 | Token expired              | Access token expired (WhatsApp: 190)                                                              |
| 1007 | Policy violation           | Temporarily blocked for policy violations (WhatsApp: 368)                                         |
| 1008 | Rate limit hit             | WABA rate limit reached (WhatsApp: 80007)                                                         |
| 1009 | Throughput exceeded        | Rate limit hit — Message throughput limit reached (WhatsApp: 130429)                              |
| 1010 | Experimental number        | Number part of experiment (WhatsApp: 130472)                                                      |
| 1011 | Region restriction         | Business account restricted in this country (WhatsApp: 130497)                                    |
| 1012 | Unknown failure            | Something went wrong — Unknown error (WhatsApp: 131000)                                           |
| 1013 | Access denied              | Access denied — Permission not granted (WhatsApp: 131005)                                         |
| 1014 | Missing parameter          | Required parameter is missing (WhatsApp: 131008)                                                  |
| 1015 | Invalid parameter value    | Parameter value is not valid (WhatsApp: 131009)                                                   |
| 1016 | Service down               | Service unavailable — Temporary service downtime (WhatsApp: 131016)                               |
| 1017 | Sender \= Receiver         | Recipient cannot be sender (WhatsApp: 131021)                                                     |
| 1018 | Message rejected           | Message undeliverable (WhatsApp: 131026)                                                          |
| 1019 | Account locked             | Account locked (WhatsApp: 131031)                                                                 |
| 1020 | Display name not approved  | Display name approval needed (WhatsApp: 131037)                                                   |
| 1021 | Bad certificate            | Incorrect certificate (WhatsApp: 131045)                                                          |
| 1022 | Message window expired     | Re-engagement message (outside 24-hour window) (WhatsApp: 131047)                                 |
| 1023 | Spam control triggered     | Spam rate limit hit (WhatsApp: 131048)                                                            |
| 1024 | Message suppressed         | Meta chose not to deliver (WhatsApp: 131049)                                                      |
| 1025 | Unsupported message        | Unsupported message type (WhatsApp: 131051)                                                       |
| 1026 | Download failed            | Media download error (WhatsApp: 131052)                                                           |
| 1027 | Upload failed              | Media upload error (WhatsApp: 131053)                                                             |
| 1028 | Sender-recipient throttled | Sender/recipient pair rate limit hit (WhatsApp: 131056)                                           |
| 1029 | Account under maintenance  | Account in maintenance mode (WhatsApp: 131057)                                                    |
| 1030 | Wrong number of params     | Template param count mismatch (WhatsApp: 132000)                                                  |
| 1031 | Template missing           | Template does not exist (WhatsApp: 132001)                                                        |
| 1032 | Text too long              | Template hydrated text too long (WhatsApp: 132005)                                                |
| 1033 | Template violation         | Template policy violation (WhatsApp: 132007)                                                      |
| 1034 | Wrong param format         | Template param format mismatch (WhatsApp: 132012)                                                 |
| 1035 | Template paused            | Template paused (WhatsApp: 132015)                                                                |
| 1036 | Template disabled          | Template disabled (WhatsApp: 132016)                                                              |
| 1037 | Flow blocked               | Flow blocked (WhatsApp: 132068)                                                                   |
| 1038 | Flow throttled             | Flow throttled (WhatsApp: 132069)                                                                 |
| 1039 | Deregistration failed      | Incomplete deregistration (WhatsApp: 133000)                                                      |
| 1040 | Server unavailable         | Server temporarily unavailable (WhatsApp: 133004)                                                 |
| 1041 | PIN mismatch               | Two-step PIN mismatch (WhatsApp: 133005)                                                          |
| 1042 | Reverification required    | Phone number re-verification needed (WhatsApp: 133006)                                            |
| 1043 | Too many guesses           | Too many two-step PIN guesses (WhatsApp: 133008)                                                  |
| 1044 | PIN entry too fast         | Two-step PIN guessed too fast (WhatsApp: 133009)                                                  |
| 1045 | Number not registered      | Phone number not registered (WhatsApp: 133010)                                                    |
| 1046 | Retry after delay          | Wait before registering phone number (WhatsApp: 133015)                                           |
| 1047 | Too many attempts          | Account register/deregister limit exceeded (WhatsApp: 133016)                                     |
| 1048 | Unknown client-side issue  | Generic user error (WhatsApp: 135000)                                                             |
| 1049 | Too many sync calls        | Synchronisation request limit exceeded (WhatsApp: 2593107)                                        |
| 1050 | Sync time expired          | Synchronisation request outside allowed time window (WhatsApp: 2593108)                           |
| 1051 | Message can't be delivered | The recipient has opted-out of receiving marketing messages from your business (WhatsApp: 131050) |

## Viber Error Codes

| Code | Possible Reasons              | Description                                           |
| :--- | :---------------------------- | :---------------------------------------------------- |
| 2000 | Successfully sent             | Message sent successfully                             |
| 2001 | Internal server error         | Internal processing failure                           |
| 2002 | Invalid service ID            | Service ID unused or not yet uploaded                 |
| 2003 | Bad request structure         | Malformed request (e.g. JSON formatting)              |
| 2004 | Incorrect message type        | Unsupported or invalid message type                   |
| 2005 | Missing parameters            | Required field like tracking\_data is missing         |
| 2006 | Timeout                       | Viber server timeout                                  |
| 2007 | User blocked                  | User has blocked this ID or all business messages     |
| 2008 | Not a Viber user              | Destination number not registered with Viber          |
| 2009 | No suitable device            | Device not compatible with Business Messages          |
| 2010 | Unauthorized IP or ID         | Wrong IP or ID not whitelisted                        |
| 2012 | Bad label                     | Missing or invalid 'label' parameter                  |
| 2013 | Invalid TTL                   | TTL is out of allowed range                           |
| 2014 | Session message limit reached | Exceeded 10-message session cap                       |
| 2015 | Unsupported file format       | File type not allowed for this feature                |
| 2016 | Filename too long             | File name exceeds 25 character limit                  |
| 2017 | Thumbnail too long            | Thumbnail URL exceeds 1000 characters                 |
| 2018 | File too large                | File size exceeds 200 MB                              |
| 2019 | Video too long                | Video duration exceeds 600 seconds                    |
| 2020 | Template ID not found         | The provided template ID is not found                 |
| 2021 | Template validation failed    | Template variables did not pass the server validation |
