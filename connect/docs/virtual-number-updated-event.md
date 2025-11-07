# Virtual Number Updated

Notifies customers that a change in either Virtual Number or Virtual Number Health has occurred

A webhook will be sent to your endpoint each time Virtual Numbers are updated in the Virtual Number pool associated with your subaccount.

The JSON object will contain the following values:

| Name | Type | Description |
| --- | --- | --- |
| namespace | String | 8x8 product channel definition |
| eventType | String | Webhook event type. The default value for the "Virtual Number Updated" event is VIRTUAL\_NUMBER\_UPDATE |
| description | String | Description of the event. The default value for the "Virtual Number Updated" event is "Status of account virtual number(s) updated" |
| payload | Object | It contains information about the updated Virtual Numbers. |
| subAccountId | String | Unique id for your subaccount |
| totalNumbers | Integer | Number of Virtual Number(s) assigned to your subaccount |
| updateEventType | String | Type of "Virtual Number Updated" event. The possible values are: **"SNAPSHOT"** or **"UPDATES"** |
| virtualNumbers | Object | It contains detailed information about Virtual Numbers assigned to your subaccount. |
| msisdn | String | Virtual Number in E.164 format |
| updatedTimestamp | Timestamp | Timestamp of the last update of the given Virtual Number |
| countryCode | String | Country code of the Virtual Number |
| operationalStatus | String | Current status of the Virtual Number. Possible values are:<br>- **Active** - Virtual Number is active and ready to be used for new sessions<br>- **Unhealthy** - Virtual Number with degraded calling services. Unhealthy Numbers should not be used for new sessions. You may still receive calls from previous allocations.<br>- **Expiring** - Virtual Number that will soon be excluded from the Virtual Number pool. Should not be used for new sessions. You may still receive calls from previous allocations.<br>- **Inactive** - Inactive Virtual Number. Should not be used for new sessions. |
| referenceId | String | Unique identifier for the number range the Virtual number belongs to |
| rentalPrice | Number | Recurring monthly fee for the Virtual Number |
| incomingRate | Number | Minute based inbound fee for calls made to the Virtual Number |
| billingUnit | Integer | Billing increment for inbound call duration. Applied to all inbound calls to the Virtual Number |
| billingCurrency | String | Currency for all prices applied to the subaccount.  |
| numberHealthCheckEnabled | Boolean | Boolean check if Number Health services are enabled for this Virtual Number |
| updateStatus | String | Update status for the given Virtual Number. Values indicate if the Virtual Number status has been changed in this event. Possible values are **"NO\_CHANGE"** and **"UPDATED"** |

Example of a JSON object sent to your webhook:

```json
{
  "namespace": "VOICE",
  "eventType": "VIRTUAL_NUMBER_UPDATE",
  "description": "Status of account virtual number(s) updated",
  "payload": {
    "subAccountId": "MySubAccount",
    "totalNumbers": 2,
    "updateEventType": "UPDATES",
    "virtualNumbers": [
      {
        "msisdn": "+65123456789",
        "updatedTimestamp": "2023-02-17T05:10:14.760Z",
        "countryCode": "SG",
        "operationalStatus": "Active",
        "referenceId": "MyVirtualNumber-1",
        "rentalPrice": 5.0,
        "incomingRate": 0.05,
        "billingUnit": 1,
        "billingCurrency": "USD",
        "numberHealthCheckEnabled": false,
        "updateStatus": "UPDATED"
      },
      {
        "msisdn": "+65987654321",
        "updatedTimestamp": "2023-04-11T09:34:18.780Z",
        "countryCode": "SG",
        "operationalStatus": "Active",
        "referenceId": "MyVirtualNumber-2",
        "rentalPrice": 5.0,
        "incomingRate": 0.05,
        "billingUnit": 60,
        "billingCurrency": "USD",
        "numberHealthCheckEnabled": true,
        "updateStatus": "UPDATED"
      }
    ]
  }
}

```
