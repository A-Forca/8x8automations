# Price object reference

8x8 API uses the following universal object for describing the price across different APIs.

Object structure

| Parameter name | Parameter type | Description                                                                                                |
| --- | --- |------------------------------------------------------------------------------------------------------------|
| total | decimal\* | The total price of the message.                                                                            |
| perSms | decimal | Price per SMS (for SMS API only).<br>The `total` value is equivalent to `perSms` x `smsCount`.             |
| currency | string\* | Currency code of price information expressed in [ISO 4217 format](https://en.wikipedia.org/wiki/ISO_4217). |

> 🚧
>
> Please note that the Price object is optional and might not be included in the Delivery Receipts callback. When a message was not sent successfully, you will still receive Delivery Receipts with Failed/Undelivered status without incurring any charges. Hence, the price information is not available for the Delivery Receipts.
>
>

Examples of price object:
SMS PriceChatApps Price

```json
{
  "price": {
      "total": 0.0375,
      "perSms": 0.0125,
      "currency": "USD"
    }
}

```

```json
{
  "price": {
      "total": 0.0375,
      "currency": "USD"
    }
}

```
