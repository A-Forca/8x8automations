# SMS Delivery Receipt Error Codes

> ℹ️ **Troubleshooting tip**
>
> The table below lists *delivery receipt* error codes for SMS  
> If you are debugging an error that appears in the JSON body of an 8x8 **API response** (for example `"code": 1200`), please see the [API Error Codes](/connect/reference/api-error-codes) reference instead.
>
>

Subject to enhanced details available on from outbound route, the following error codes can be sent by 8x8 in the delivery reports

| Code | Reason                                         |
| :--- | :--------------------------------------------- |
| 0    | No reason code                                 |
| 1    | Absent subscriber                              |
| 2    | Content related error                          |
| 3    | Data missing                                   |
| 4    | Deferred delivery                              |
| 5    | Pending upstream                               |
| 7    | Delivery failure                               |
| 8    | Deny                                           |
| 9    | Equipment protocol error                       |
| 10   | ESME external error                            |
| 11   | Flooding                                       |
| 12   | HLR error                                      |
| 13   | Illegal subscriber or equipment                |
| 14   | Internal error                                 |
| 15   | Invalid destination                            |
| 16   | Invalid format                                 |
| 17   | Invalid message length                         |
| 18   | Invalid parameter                              |
| 19   | Invalid source address                         |
| 20   | Local cancel                                   |
| 21   | Memory capacity exceeded                       |
| 22   | Message being retried                          |
| 23   | Network failure                                |
| 24   | Age verification failure                       |
| 25   | Operation aborted by receiving network or user |
| 26   | Operation barred                               |
| 27   | Permanent operator error                       |
| 28   | Permanent phone error                          |
| 29   | Phone related error                            |
| 30   | Portability error                              |
| 31   | Premium SMS error                              |
| 32   | Roaming subscriber                             |
| 33   | Route error                                    |
| 34   | Screening error                                |
| 35   | Service center congestion                      |
| 36   | SMS expired                                    |
| 37   | SMS facility not supported                     |
| 38   | SMS malformed                                  |
| 39   | SMSC cancel                                    |
| 40   | SMSC error                                     |
| 41   | SMSC reject                                    |
| 42   | Source credit insufficiency                    |
| 43   | Spam filter                                    |
| 44   | Subscriber billing issue                       |
| 45   | Subscriber busy for SMS                        |
| 46   | Subscriber not reachable                       |
| 47   | Subscriber temporary unavailable               |
| 48   | System failure                                 |
| 49   | TCAP error                                     |
| 50   | Throttling error                               |
| 51   | Time out error                                 |
| 52   | Unable to decode the response                  |
| 53   | Unexpected data value                          |
| 54   | Unexpected error                               |
| 55   | Unidentified subscriber                        |
| 56   | Unknown delivery state                         |
| 57   | Unknown error                                  |
| 58   | Unknown service center                         |
| 59   | Unknown subscriber                             |
| 60   | Content filtered                               |
| 61   | Session expired                                |
