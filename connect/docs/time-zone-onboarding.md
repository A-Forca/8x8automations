# Time zone & Onboarding

> 🚧 **[BETA]**
>
> This product is currently in early access. Please reach out to your account manager to get more information.
>

## Time Zones

Certain date and time functions (in scripting) requires you to specify the timezone using a timezone id. You can get the supported time zone ids using the following request. You can use the optional parameter **contains** to filter timezones whose name contains the specified value.

```bash
curl --location --request GET 'https://automation.8x8.com/api/v1/accounts/:accountId/steps/timezones?contains=europe' \
--header 'Authorization: Bearer {apiKey}'
```

If the request is successful, you will get the HTTP status code 200 with the following response body:

```json
[
    {
        "id": "Central Europe Standard Time",
        "name": "Belgrade, Bratislava, Budapest, Ljubljana, Prague (UTC+01:00)"
    },
    {
        "id": "Central European Standard Time",
        "name": "Sarajevo, Skopje, Warsaw, Zagreb (UTC+01:00)"
    },
    {
        "id": "E. Europe Standard Time",
        "name": "Chisinau (UTC+02:00)"
    },
    {
        "id": "W. Europe Standard Time",
        "name": "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna (UTC+01:00)"
    }
]
```

## Onboarding

To get access to this service, you will need your CPaaS account to be enabled for the Automation API.
Please reach out to your account manager to get this done.

For the events to be sent to the Automation service, you **don't** need to change your [webhooks](/connect/docs/webhooks-configuration-api). We will enable the Customer Integration on your account, for the events to be sent to the Automation service.

You can still continue to manage your [webhooks](/connect/docs/webhooks-configuration-api) as usual and you will still receive the events.
