# Hangup

This action should be used to hang up the incoming call.

The following is an example of the JSON response you would need to provide:

```json
{
  "clientActionId": "NumberMaskingId1",
  "callflow": [ 
    {
      "action": "hangup" 
    }
  ]
}
```

Note: The Hangup action is needed only if you do not want to complete any other action. This action is not necessary if the calling user hangs up the call.
