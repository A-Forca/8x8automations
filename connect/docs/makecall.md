# MakeCall

This function should be used to connect the first call with another party.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "IVRCustomId1",
|"callflow": [
    {
      "action": "makeCall",
      "params": {
        "source": "6512345678", 
        "destination": "6587654321",
      }
    } 
|]
}
```

The action should contain the following parameters:

| Name | Type | Description |
| ----- | ------ | ------------- |
|action | String | makeCall – Action to Connect/Bridge call between two users|
|destination | String | Number of the called party in E.164 format (The second user's number).|
|source |String |Number of the calling party in E.164 format. This should be the Virtual Number allocated to your sub-account|
|clientActionId|String|A custom property that you can use to mark individual actions|
