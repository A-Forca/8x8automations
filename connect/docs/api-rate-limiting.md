# API Rate Limiting

To protect the platform from being overloaded and maintain a high quality of service to all customers, 8x8 enforces API rate limits for its SMS API.

The default request rate limit is **1800** HTTP requests per second **per sub-account** (can be adjusted upon request), and **3000** requests per second **per IP address** with no maximum daily quota.  

All requests exceeding this quota will be rejected by the API with `429 Too Many Requests` HTTP Status.

The API will also return the `Retry-After` HTTP header with the value indicating when the client can retry the request.

Retry-After header example

```text
Retry-After: 1

```

In this example, you can retry the request after 1 second.

> 👍 **Hint**
>
> If you need to submit a higher volume of messages in bulk, please ensure to use the [Send SMS batch](/connect/reference/send-many-sms) API that allows you to submit up to **10,000** messages in a single API request, which currently is roughly equivalent to 25 000 messages per second.
>
>
