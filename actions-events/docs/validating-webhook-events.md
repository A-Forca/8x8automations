# Validating Webhook Events

The Webhook events HTTP **`POST`** requests have custom headers containing the digital signature of the event that enable you to establish:

* Integrity
* Confidentiality
* Idempotency
* Non-repudiation
* Authentication

for the event.

## Custom HTTP headers

| Header                        | Description                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`x-8x8-tenant-id`**         | Contains your tenant ID <br /><br /> This information matches the information in **[Configuration Manager](https://docs.8x8.com/8x8WebHelp/VCC/configuration-manager-general/content/cfgoverview.htm)** **> Home > Profile > Tenant Label**                                                                                                                                        |
| **`x-8x8-event-id`**          | The unique ID that is used to determine that the event notification you received is distinct from previous ones.                                                                                                                                                                                                                                                                   |
| **`x-8x8-signature`**         | The **[digital signature](/actions-events/docs/validating-webhook-events#signature)** which enables you to establish identity and confirms that the message has not been compromised. <br /><br />If the signature is not valid, the message can be dropped. <br /><br />See **[signature](/actions-events/docs/validating-webhook-events#signature)** for validation information. |
| **`x-8x8-transmission-time`** | The header for the request timestamp. <br /><br /> This is different from the event timestamp that you may receive in the payload. If you are not able to confirm the event with a 2XX code, then 8x8 will retry the event after a brief delay. The transmission time changes at each retry.                                                                                       |
| **`x-8x8-retry`**             | Indicates the retry attempt for the same event.                                                                                                                                                                                                                                                                                                                                    |
| **`x-8x8-customer-id`**       | The unique customer ID.                                                                                                                                                                                                                                                                                                                                                            |

## Signature

The JSON Web Signature (JWS) with detached content and an unencoded payload.

The JWS is as specified according to [RFC 7515](https://datatracker.ietf.org/doc/html/rfc7515) which consists of:

* A [JOSE Header](/actions-events/docs/validating-webhook-events#jose-header)
* [Data to be Signed](/actions-events/docs/validating-webhook-events#data-to-be-signed) (not present if detached)
* The JWS signature value

#### JOSE Header

The JOSE Header describes the cryptographic operations applied to JWS.

The Chat API signature consists of:

* **`alg`**: The **`alg`** (algorithm) header parameter identifies the cryptographic algorithm used to secure JWS (**[RFC 7515 Section 4.1.1](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1)**)
* **`kid`**: The **`kid`** (key ID) header parameter is a hint indicating which key was used to secure JWS (**[RFC 7515 Section 4.1.4](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.4)**)

The **`kid`** is the ID of the keys resource used to sign JWS

You can use this kid to fetch the **[public key](/actions-events/reference/getjwkpublickey-1)** and use it to validate JWS

* **`b64`**: The **`b64`** header parameter stores password hashes computed with encoding **[RFC 7797 Section 3](https://datatracker.ietf.org/doc/html/rfc7797#section-3)**)

Because the payload is not encoded, this value is **false**

* **crit**: the **`crit`** (Critical) header parameter **[RFC 7515 Section 4.1.11](https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.11)**

This list contains **`b64`** encoding. **[RFC 7797 Section 6](https://datatracker.ietf.org/doc/html/rfc7797#section-6)**

#### Data to be signed

The unencoded detached payload is in JSON format containing the following properties:

| Key                       | Description                                                                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`checksum`** <br />long | The checksum of the **`POST`** payload.<br /><br />You must:<br /><br />- Serialize the byte array with UTF-8 encoding<br /><br />- Compute the CRC32 checksum of the encoded body<br /><br />The CRC32 checksum value should be expressed in decimal format. |
| **`tt`** <br />long       | **Transmission Time** - this value can be obtained from the **x-8x8-transmission-time** header                                                                                                                                                                |
| **`cid`** <br />string    | **Customer ID** - this value can be obtained from the **x-8x8-customer-id** header                                                                                                                                                                            |
| **`tid`** <br />string    | **Tenant ID** - this value can be obtained from the **x-8x8-tenant-id** header                                                                                                                                                                                |
| **`eid`** <br />string    | **Event ID** - this value can be fetched from the **x-8x8-event-id** header                                                                                                                                                                                   |
| **`retry`** <br />long    | **Retry attempt** - this value can be fetched from the **x-8x8-retry** header                                                                                                                                                                                 |

> 📘 **Note:**
>
> Since a signature is computed for this payload, the order of keys is of critical importance. Review and adhere to the following order.
>
>

The keys are lexicographically ordered as follows:

1. **`checksum`**
2. **`cid`**
3. **`eid`**
4. **`retry`**
5. **`tid`**
6. **`tt`**

For example:

```json
{
  "checksum": 1411811814,
  "cid": "vccC8ProdChecksUS",
  "eid": "g4nqGuj8TpCa6tiZ3DeeNw",
  "retry": 0,
  "tid": "vccC8ProdChecksUS",
  "tt": 1629804577296
}

```

The request should resemble the following:

```bash
curl --request POST \
  --url http://your-webhook-domain-url/callback \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --header 'x-8x8-customer-id: vccC8ProdChecksUS' \
  --header 'x-8x8-event-id: g4nqGuj8TpCa6tiZ3DeeNw' \
  --header 'x-8x8-retry: 0' \
  --header 'x-8x8-signature: eyJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdLCJraWQiOiJrZXkxIiwiYWxnIjoiUlMyNTYifQ..O4kXJAvWFtxYZERsJX-OkGLYL__7-rtQrm6y9MFwaISGw1timf1QDQpXy6-8095M67-eN-rUQDNwalktIdHs--DBpR-ratQd1bDlrPMR5CGlsbLFso-KziuqJycBBYmpLIs0JhFihTfoBstduRsQyK-oX0bAu1ZytTVLgmzPkAptlczoS7hsQHfH2QMH8LoEZk99wKqCNczsnu8bfJllSiMXxzZqYa_ll7i-Wy1myjzdvMArtSggbxqsSdbNRmSQgT6KDbWriJD7ucsEDwuKVe-q9cQMEMU2tO9aeyDbCMFo-FKXPUPzQ5J8xkQU8nn3tNurKVBB8x_8YJ8s0EKg3g' \
  --header 'x-8x8-tenant-id: vccC8ProdChecksUS' \
  --header 'x-8x8-transmission-time: 1629804577296' \
  --data '{"eventType":"AGENT_JOINED","messageType":"SYSTEM","conversationId":"Aka5NMHU8MtIG7lUQOxI0DTOvM4","agentId":"cmalutan","agentName":"Cosmin,Malutan","timestamp":1629804577002}'

```

## Signature validation

To validate a signature:

1. Obtain the request payload and compute the CRC32 **`checksum`** value for it.

Note that **`checksum`** should be presented in decimal format.
2. Extract all of the critical HTTP headers described in [**list of custom HTTP headers**](/actions-events/docs/validating-webhook-events#custom-http-headers)
3. Reconstruct the detached payload of the JWS signature as shown in section [data to be signed](/actions-events/docs/validating-webhook-events#data-to-be-signed)

This UTF8 encoded JSON will be your **JWS Payload**
4. Construct JWS Signing Input

ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' || (JWS Payload))
5. Obtain the public key ID from the JOSE Header
6. Obtain the public key in JWK format from the [public key API](/actions-events/reference/getjwkpublickey-1)
7. Validate the **JWS Signature** against the **JWS Signing Input** using the RS256 algorithm and the obtained key

```php
<?php
/*
 In the following example we use the following mvn packages:

  - group: com.nimbusds
    artifact: nimbus-jose-jwt
    version: 9.9.3
  - group: com.google.code.gson
    artifact: gson
    version: 2.8.7
  - group: org.springframework
    artifact: spring-web
    version: 5.1.2.RELEASE
*/

package com.example.controller;

import com.google.gson.JsonObject;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.util.Map;
import java.util.zip.CRC32;

@RestController
@RequestMapping("/callback")
public class MessageWebhookController {
    private static final String KEY_URL = "https://api.8x8.com/vcc/us/chat/v2/jwk/{keyID}/public";
    private static final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<Void> webhook(@RequestBody String body, @RequestHeader Map<String, String> headers) {
        final byte[] content = body.getBytes();

        final String signature = headers.get("x-8x8-signature");
        final String customerId = headers.get("x-8x8-customer-id");
        final String tenantId = headers.get("x-8x8-tenant-id");
        final String eventId = headers.get("x-8x8-event-id");
        final String transmissionTime = headers.get("x-8x8-transmission-time");
        final String retry = headers.get("x-8x8-retry");

        final CRC32 crc32 = new CRC32();
        crc32.update(content);
        final long checksum = crc32.getValue();

        final JsonObject json = new JsonObject();
        json.addProperty("checksum", checksum);
        json.addProperty("cid", customerId);
        json.addProperty("eid", eventId);
        json.addProperty("retry", Long.valueOf(retry));
        json.addProperty("tid", tenantId);
        json.addProperty("tt", Long.valueOf(transmissionTime));

        final String signaturePayload = json.toString();
        final Payload payload = new Payload(signaturePayload);
        try {
            final JWSObject jwsObject = JWSObject.parse(
                    signature,
                    payload
            );
            final String keyID = jwsObject.getHeader().getKeyID();
            final ResponseEntity<String> entity = restTemplate.getForEntity(KEY_URL, String.class, keyID);
            final RSAKey publicJWK = RSAKey.parse(entity.getBody());

            JWSVerifier verifier = new RSASSAVerifier(publicJWK);
            if (jwsObject.verify(verifier)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (ParseException | JOSEException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

```

```php
<?php
/*
 In this example we use the following composer modules: 
   - web-token/jwt-core                    ^2.1
   - web-token/jwt-signature               ^2.1
   - web-token/jwt-signature-algorithm-rsa ^2.1
 */
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\JWSSerializerManager;
use Jose\Component\Signature\Serializer\CompactSerializer;

$algorithmManager = new AlgorithmManager([
    new RS256(),
]);

// The serializer manager. We only use the JWS Compact Serialization Mode.
$serializerManager = new JWSSerializerManager([
    new CompactSerializer(),
]);

// We instantiate our JWS Verifier.
$jwsVerifier = new JWSVerifier($algorithmManager);

$headers = getallheaders();
$raw_post_data = file_get_contents('php://input');
$header_signature = $headers['X-8x8-Signature'];
$header_customerId = $headers['X-8x8-Customer-Id'];
$header_tenantId = $headers['X-8x8-Tenant-Id'];
$header_eventId = $headers['X-8x8-Event-Id'];
$header_transmissionTime = $headers['X-8x8-Transmission-Time'];
$header_retry = $headers['X-8x8-Retry'];

$checksum = sprintf("%u", crc32( $raw_post_data ));

// We try to load the token.
$jws = $serializerManager->unserialize($header_signature);
$payload = json_encode([
    "checksum" => intval($checksum),
    "cid" => $header_customerId,
    "eid" => $header_eventId,
    "retry" => intval($header_retry),
    "tid" => $header_tenantId,
    "tt" => intval($header_transmissionTime)
]);

$keyID= $jws->getSignature(0)->getProtectedHeader()["kid"];

$ch = curl_init(sprintf("https://api.8x8.com/vcc/us/chat/v2/jwk/%s/public", $keyID));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);
$data = curl_exec($ch);
curl_close($ch);

$jwk = JWK::createFromJson($data);

$isVerified = $jwsVerifier->verifyWithKey($jws, $jwk, 0, $payload);

if (!$isVerified) {
    header("HTTP/1.1 401 Unauthorized");
    exit;
}

```

```javascript
/*
 In the following example we use the following npm packages:
    jshashes: ^1.0.8
    fastify: ^4.9.2
    jose: ^4.10.4,
    node-fetch: ^3.2.10
*/
import * as Hashes from "jshashes"
import fastify from 'fastify';
import { errors, flattenedVerify, importJWK, decodeProtectedHeader } from 'jose';
import fetch from 'node-fetch';
const UNAUTHORIZED = 401;
const INTERNAL_SERVER_ERROR = 500;
const getPublicKey = async(keyId) => {
  const keyUrl = `https://api.8x8.com/vcc/us/chat/v2/jwk/${keyId}/public`;
  const response = await fetch(keyUrl);
  const data = await response.json();
  return importJWK(data, 'RS256');
};
const getJwsParts = (token) => {
  const parts = token.split('.');
  if (parts.length === 3 || parts.length === 5) {
    const [protectedHeaderBase64, , signatureBase64] = parts;
    return {
      signatureBase64,
      protectedHeaderBase64
    };
  }
  throw new Error(`Invalid token ${token}`);
};
const app = Fastify();
app.post('/callback', async(request, reply) => {
  const { headers, body } = request;
  const checksum = Hashes.CRC32(JSON.stringify(body));
  const signature = headers['x-8x8-signature'];
  const customerId = headers['x-8x8-customer-id'];
  const tenantId = headers['x-8x8-tenant-id'];
  const eventId = headers['x-8x8-event-id'];
  const transmissionTime = headers['x-8x8-transmission-time'];
  const retry = headers['x-8x8-retry'];
  const signaturePayload = {
    checksum,
    cid: customerId,
    eid: eventId,
    retry: parseInt(retry, 10),
    tid: tenantId,
    tt: parseInt(transmissionTime, 10),
  };
  try {
    const { signatureBase64, protectedHeaderBase64 } = getJwsParts(signature);
    const protectedHeader = decodeProtectedHeader(signature);
    const publicKey = await getPublicKey(protectedHeader.kid);
    const jws = {
      signature: signatureBase64,
      payload: JSON.stringify(signaturePayload),
      protected: protectedHeaderBase64,
    };
    await flattenedVerify(jws, publicKey);
    reply.status(200).send();
  } catch (err) {
    if (err.code === errors.JWSSignatureVerificationFailed.code) {
      reply.status(UNAUTHORIZED).send(err);
      return;
    }
    reply.status(INTERNAL_SERVER_ERROR).send();
  }
});
// Run the server!
try {
  await app.listen({ port: 3000 })
  console.log('Server start http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

```
