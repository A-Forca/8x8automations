# SMPP TLVs

### SMS - SMPP TLVs

📘Optional Parameters are fields, which may be optionally included in an SMPP message. (SMPP v3.4 Spec, section 5.3). These fields contain 3 parts, namely Tag, Length and Value.

Some TLVs are defined by the SMPP protocol and then there is room for vendors to create their own TLVs. Below are the vendor specific TLVs defined by 8x8. These TLVs are supported only when using SMPP to make requests to 8x8

---

### Mo Message Id

A unique 36 alphanumeric character string (UUID v4) to identify the MO message at the SMSC. This message ID can be used when contacting 8x8 support regarding the message.

| Field | Sized Octets | Type | Description                                                                                                                                           |
| --- | --- | --- |-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tag | 2 | Integer | Equal to **0x1502** (5378 Decimal)                                                                                                                    |
| Length | 2 | Integer | Equal to 0x0024 (36 Decimal)<br>This means the size of the `value` is 36 bytes                                                                        |
| Value | 36 | Octet String | Octet string of 36 characters. This is a UUID v4 value which represents the 8x8 unique message Id (UMID)<br>Note that this is NOT null-terminated |

---

### Destination Mcc and Destination Mnc

Mobile Country Code (mcc) and the Mobile Network Code (mnc) values of the destination phone number corresponding to a particular DLR (in Delivered state).

| Field | Sized Octets | Type | Description |
| --- | --- | --- | --- |
| Tag | 2 | Integer | Equal to **0x1503** (5379 Decimal) |
| Length | 2 | Integer | Equal to **0x0002** (2 Decimal) |
| Value | 3 | Octet String | **mcc** value as string. 3 characters |

| Field | Sized Octets | Type | Description |
| --- | --- | --- | --- |
| Tag | 2 | Integer | Equal to **0x1504** (5380 Decimal) |
| Length | 2 | Integer | Equal to **0x0002** (2 Decimal) |
| Value | 1-3 | Octet String | **mnc** value as string. 1 - 3 characters |
