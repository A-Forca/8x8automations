# SMPP - Delivery receipts

8x8 sends delivery report information in the `short_message` field of a `deliver_sm` PDU.

The following format should be expected:

## Format

```text
id:IIIIIIIIII sub:SSS dlvrd:DDD submit date:YYMMDDhhmm done date:YYMMDDhhmm stat:DDDDDDD err:E Text: . . . . . . . . .

```

Where:

* `stat`: is one of the message states below
* `err`: is one of the error codes below, if available.

## Message States

The following message states can be found in a delivery report:

* `DELIVRD`
* `EXPIRED`
* `UNDELIV`
* `ACCEPTD`
* `UNKNOWN`
* `ENROUTE`
* `REJECTD`

## Error Codes

For the list of error codes that might be sent in DLR please refer to [SMS Delivery receipts error codes](/connect/reference/delivery-receipts-error-codes)
