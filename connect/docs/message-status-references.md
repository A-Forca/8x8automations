# Message status reference

8x8 API uses the following universal object for describing the message state across different APIs.

Object structure

| Parameter name | Type | Description                                                                                                                                                                                                            |
| --- | --- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| state | string | General status of the message.**The property is mandatory for status object and always has a value**                                                                                                                   |
| detail | string | Optional additional detail of the `state` property in status.                                                                                                                                                          |
| timestamp | string | UTC date and time when the status was observed expressed in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601): `yyyy-MM-ddTHH:mm:ss.ffZ`**The property is mandatory for status object and always has a value** |
| errorCode | integer | Error code for the operation. This property is optional and set only for errors.                                                                                                                                       |
| errorMessage | string | Description of the error.<br>This property is optional and set only for errors.                                                                                                                                        |

### State

Possible values for `state`:

* `queued`: The request is accepted and queued for processing.
* `rejected`: The request has been rejected by 8x8
* `sent`: The message has been sent to the operator and we have not received an acknowledgment yet.
* `delivered`: The message has been delivered to the destination and we have received confirmation from the operator.
* `undelivered`: We have received a delivery receipt from the operator that the message was not delivered.
* `read`: The message was delivered and read.

### Detail

Possible values for `details`:

* `delivered_to_operator`: The message has been delivered to the operator. Associated with `delivered` state
* `delivered_to_recipient`: The message has been delivered to the recipient. Associated with `delivered` state.
* `rejected_by_operator`: The message has been rejected by the operator. Associated with `undelivered` status.
* `undelivered_to_recipient`: The message has been delivered but rejected by the target device. Associated with `undelivered` state.

### Samples of the status object

Message sent successfully

```json
"status": {
        "state": "queued",
        "timestamp": "2020-12-22T01:24:30.6030893Z"
    }

```
