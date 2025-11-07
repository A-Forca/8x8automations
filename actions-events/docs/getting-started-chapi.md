# Getting Started with 8x8 Chat

Chapi is what we call our Chat API. It allows you to send and fetch messages from an 8x8 Work chat room.

## Getting Prepared for Beta Access

> 🚧 **Get your API Key (beta) — Skip this if you've already got one!**
>
> There's one prerequisite before you're able to use these APIs, and that's getting your API Key. You can generate your API key in the Admin Console. [Here's how](/actions-events/docs/chat-api-key)
>
>

## 1. Get Messages from a Room

First up, let's get the messages for a room If we're using a `test_key` we'll default our room to the room named `CHAPI sandbox`

```bash
curl --request GET \
  --url 'https://api.8x8.com/chat/api/chat/v1/messages?pageSize=10' \
  --header 'x-api-key: test_key_kjdfidj238jf9123df221'

```

> 📘 **Did you get an error?**
>
> If you see `{"fault":{"faultstring":"Invalid access token","detail":{"errorcode":"oauth.v2.InvalidAccessToken"}}}` You'll want to make sure you replace the api key (`test_key_kjdfidj238jf9123df221`) with your own.
>
>

Awesome! You should have received a JSON payload with something like the following:

```json
[
    {
        "authorUser": {
            "avatarUrl": "https://s.gravatar.com/avatar/c0fc68541276afaf1ecf7e7f761f518e?s=80",
            "email": "user@example.com",
            "id": "007",
            "name": "Matt Gardner"
        },
        "parsed": "Hello World!",
        "id": "uv4y2dmXRy_v868BZQJadWAPWv7Am-oRO1p86k00dZY",
        "timestamp": 1594169304503487
    },
    {
        "authorUser": {
            "avatarUrl": "https://s.gravatar.com/avatar/c0fc68541276afaf1ecf7e7f761f518e?s=80",
            "email": "user@example.com",
            "id": "007",
            "name": "Matt Gardner"
        },
        "parsed": "i r developer!",
        "id": "AFsG2zb5ckapn-RJalcNWHxZGy70IDhv6dzbkvA5t2g",
        "timestamp": 1594169027435340
    }
]

```

**Two messages already exist in this room — you may not have any. That's ok, let's send a message!**

## 2. Sending a Message to a Room

Let's send a message to a room. Copy/paste the below into your terminal

```bash
curl -H "Accept: application/json" \
  -H 'content-type: application/json' \
  -H "x-api-key: test_key_kjdfidj238jf9123df221" \
  --request POST \
  --data '{"messageRaw":"Hello from Terminal!"}' \
  https://api.8x8.com/chat/api/chat/v1/messages

```

**P.S.** Want to see this message come through in realtime? Log into 8x8 Work and find the room called `CHAPI Sandbox`.\*\* *If it doesn't exist, it will once you've successfully sent your first message!*

Now that we've sent a message, you should also see it when logged into 8x8 Work. Plus, if we re-run the first snippet, we'll see that our message was added to the array it returns, like so:

```json
[
    {
        "authorUser": {
            "avatarUrl": "https://s.gravatar.com/avatar/c0fc68541276afaf1ecf7e7f761f518e?s=80",
            "email": "user@example.com",
            "id": "007",
            "name": "Matt Gardner"
        },
        "parsed": "Hello World!",
        "id": "uv4y2dmXRy_v868BZQJadWAPWv7Am-oRO1p86k00dZY",
        "timestamp": 1594169304503487
    },
    {
        "authorUser": {
            "avatarUrl": "https://s.gravatar.com/avatar/c0fc68541276afaf1ecf7e7f761f518e?s=80",
            "email": "user@example.com",
            "id": "007",
            "name": "Matt Gardner"
        },
        "parsed": "i r developer!",
        "id": "AFsG2zb5ckapn-RJalcNWHxZGy70IDhv6dzbkvA5t2g",
        "timestamp": 1594169027435340
    },
    {
        "authorUser": {
            "avatarUrl": "https://s.gravatar.com/avatar/c0fc68541276afaf1ecf7e7f761f518e?s=80",
            "email": "user@example.com",
            "id": "007",
            "name": "Matt Gardner"
        },
        "parsed": "Hello from Terminal!",
        "id": "AFsG2zb5ckapn-RJalcNWHxZGy70IDhv6dzbkvA5t24",
        "timestamp": 1594169027435321
    }
]

```

***Note: your API key is limited to 5 requests per second.***
