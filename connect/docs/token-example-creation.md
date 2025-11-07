# Token example creation

The Token Creation API can be used to create a token or to create a room, here are few examples:

**Sample 1 - Token creation:**

```bash
curl -X POST https://video-agent.8x8.com/api/v1/tokens \
-H "Content-Type: application/json" \
-H 'authorization: Bearer YourAPIKey' \
```

**Sample Response 1:**

```json
{
"auth_token": "[...]eyJiJIUzI1NiME5B87.qPWXyNNDHBx_LftaH"
}
```

In the sample 1, you are only getting a token and not creating a room. This will allow you to login agents later on and to use the agent console as per usual.

**Sample 2 - Room Creation:**

```bash
curl -X POST https://video-agent.8x8.com/api/v1/tokens \
-H "Content-Type: application/json" \
-H 'authorization: Bearer YourAPIKey' \
-d '{"create_room": true, "phone_number":"+6590893208",
"call_reference":"123abcde"}'
```

**"create_room"**  is an optional parameter, default is false. If you want to create a room while getting the token, you need to set this parameter to ‘true’.
**"phone_number"**  is an optional parameter, it should be an international phone number.
**"call_reference"**  is an optional parameter, it should be a string of min 8 characters and max 20 characters.

**Sample Response 2:**

```json
{
"call_reference": "123abcde",
"guest_link": "https://www.video-interaction.com/guest/Y56IiyJMxx",
"auth_token": "[...]eyJiJIUzI1NiME5B87.qPWXyNNDHBx_LftaHa"
}
```

In the sample 2, you are getting a token and creating a room. This will allow you to login the agents later on and to have a room already created after login.

If you provide a phone number, 8x8 will send the link via SMS to the phone number, when an agent logs with the token. If you want to send the link yourself, do not provide a phone number (you can still provide a Call Reference).
