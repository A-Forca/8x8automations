# Webhook migration guide

The Webhook configuration API is available for [SMS](/connect/reference/webhook-configuration-api-sms) and for [Chat Apps] ([/connect/reference/get-webhooks-2](/connect/reference/get-webhooks-2)).

This allows you to manage your webhooks and to receive the object documented [here](/connect/docs/webhook-object-structure) such as your Delivery Receipts and Inbound Messages.

These Configuration API and object are different from the deprecated Wavecell versions.  

This means that you might need to migrate to the new version, which is the goal of this guide.

The main difference is the new API doesn't have webhook types, as the objects structure now contains namespace and eventType.

**1. Check which version you are on**

The easiest way to check if you have any old webhook setup is to insert new record using the new API at your account level.  

You can do this using this [Webhook Configuration API](/connect/reference/get-webhooks-2)

```bash
curl --request POST \
     --url https://sms.8x8.com/api/v1/accounts/{mySubAccountId}/webhooks \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer {yourApiKey}' \
     --header 'Content-Type: application/json' \
     --data '
[
     {
          "enabled": true,
          "subAccountId": "*",
          "url": "http://example.com"
     }
]
'

```

If this doesn't return an error, you are all set and can focus on using the new API.

If you get an error like this, then you need to migrate from the old version:

> 🚧
>
> Unable to setup the webhook of the new format, while the webhook with an old format exists for this subaccount. Please delete the current webhook first and try again. Existing webhook details: Type = MO, SubAccountId: mySubAccountId_hq, Version = V1, Url = [http://example.com](http://example.com)
>
>

**2. Delete old webhook**

If the step #1 returned you an error, you will need to use the old API to delete a webhook.  

In the example above, your subaccount is mySubAccountId_hq and already has an old webhook setup.

To delete it, you can use the [old API](https://developer.wavecell.com/sms/configuration-api/webhooks-configuration-api/delete-webhooks), for example:

```bash
curl --request DELETE \
  --url https://api.wavecell.com/config/v1/webhook \
  --header 'authorization: Bearer {yourApiKey}' \
  --header 'content-type: application/json' \
  --data '[{"subAccountId":"mySubAccountId_hq","type":"*"}'

```

If you want to delete all your old webhook at once, you can do this:

```bash
curl --request DELETE \
  --url https://api.wavecell.com/config/v1/webhook \
  --header 'authorization: Bearer {yourApiKey}' \
  --header 'content-type: application/json' \
  --data '[{"subAccountId":"*","type":"*"}]'

```

**3. Add new webhook**

Now that you have delete your old webhook, or at least some, we can insert new ones.  

For example for a specific subaccount:

```bash
curl --request POST \
     --url https://sms.8x8.com/api/v1/accounts/sfdsfsfsfs/webhooks \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer {yourApiKey}' \
     --header 'Content-Type: application/json' \
     --data '
[
     {
          "enabled": true,
          "subAccountId": "mySubAccountId_hq",
          "url": "http://example.com"
     }
]
'

```

Or for all your subaccounts:

```bash
curl --request POST \
     --url https://sms.8x8.com/api/v1/accounts/sfdsfsfsfs/webhooks \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer {yourApiKey}' \
     --header 'Content-Type: application/json' \
     --data '
[
     {
          "enabled": true,
          "subAccountId": "*",
          "url": "http://example.com"
     }
]
'

```

**Common errors:**

> 🚧 **When trying to use the old api to manage webhook of new format**
>
> Unable to setup the webhook of the old format with the new API. Please use [https://api.wavecell.com](https://api.wavecell.com) endpoint for this operation.
>
>

> 🚧 **When trying to use the new api to manage the webhook of old format**
>
> Unable to setup the webhook of the new format with the old API. Please use a new API for this operation.
>
>

> 🚧 **When there're webhooks format conflict**
>
> Unable to setup the webhook of the new format, while the webhook with an old format exists for this subaccount. Please delete the current webhook first and try again. Existing webhook details: Type = MO, SubAccountId: \*, Version = V1, Url = [http://example.com](http://example.com)
>
>

or

> 🚧 **When there're webhooks format conflict**
>
> Unable to setup the webhook of the old format, while the webhook with a new format exists for this subaccount. Please delete the current webhook first and try again. Existing webhook details: SubAccountId: \*, Url = [http://example.com](http://example.com)
>
>
