# xAI Enterprise REST API Reference

The xAI Enterprise API is a high-performance, OpenAI-compatible REST interface for building chat, reasoning, image, and tooling workflows. This document reformats the original `xaiapi.txt` export into a structured Markdown reference for easier scanning and linking.

> All endpoints follow the OpenAI REST API patterns unless otherwise noted.

## Base URL & Authentication

- **Base URL:** `https://api.x.ai`
- **Authentication:** Include `Authorization: Bearer <your xAI API key>` on every request.
- **Compatibility:** Works as a drop-in replacement for OpenAI REST clients.

## Endpoint Catalog

| Method & Path | Description |
| --- | --- |
| `POST /v1/chat/completions` | Create chat responses (text + image understanding). |
| `POST /v1/responses` | Create a stateful response (store + tool support). |
| `GET /v1/responses/{response_id}` | Retrieve a previously created response. |
| `DELETE /v1/responses/{response_id}` | Delete a stored response. |
| `POST /v1/messages` | Anthropic-compatible Messages endpoint. |
| `POST /v1/images/generations` | Generate images from prompts. |
| `GET /v1/api-key` | Inspect metadata about the active API key. |
| `GET /v1/models` | List available models (minimal info). |
| `GET /v1/models/{model_id}` | Get minimal info about a model. |
| `GET /v1/language-models` | List chat/vision models with pricing + modalities. |
| `GET /v1/language-models/{model_id}` | Inspect a single chat/vision model. |
| `GET /v1/image-generation-models` | List image generation models. |
| `GET /v1/image-generation-models/{model_id}` | Inspect an image generation model. |
| `POST /v1/tokenize-text` | Tokenize text with a specified model. |
| `GET /v1/chat/deferred-completion/{request_id}` | Retrieve the result of a deferred chat completion. |
| `POST /v1/completions` | Legacy OpenAI-style text completions. |
| `POST /v1/complete` | Legacy Anthropic-compatible completions. |

---

## Chat APIs

### Chat Completions (`POST /v1/chat/completions`)

Create a chat response from text and/or image prompts. Supports all standard OpenAI chat completion parameters (temperature, max_tokens, tools, response formats, etc.).

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `messages` | array | ✓ | Ordered list of chat messages with `role` (`system`, `user`, `assistant`, `tool`) and `content` (text and/or images). |
| `model` | string | ✓ | Model ID (for example `grok-4-0709`). |
| `n` | integer |  | Number of choices to generate; `choices` length matches this value. |

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique ID for the completion. |
| `object` | string | Always `chat.completion`. |
| `created` | integer | Unix timestamp when the completion was created. |
| `model` | string | Model used to generate the output. |
| `choices` | array | Each entry contains `index`, `message` (`role`, `content`, `refusal`), and `finish_reason`. |
| `usage` | object | Token accounting (`prompt_tokens`, `completion_tokens`, `total_tokens`, plus detailed breakdowns). |
| `system_fingerprint` | string | Identifier for the serving system configuration. |

#### Example

```json
POST /v1/chat/completions
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant that can answer questions and help with tasks."
    },
    {
      "role": "user",
      "content": "What is 101*3?"
    }
  ],
  "model": "grok-4-0709"
}
```

```json
200 OK
{
  "id": "a3d1008e-4544-40d4-d075-11527e794e4a",
  "object": "chat.completion",
  "created": 1752854522,
  "model": "grok-4-0709",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "101 multiplied by 3 is 303.",
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "completion_tokens": 9,
    "total_tokens": 135,
    "prompt_tokens_details": {
      "text_tokens": 32,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 6
    },
    "completion_tokens_details": {
      "reasoning_tokens": 94,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    },
    "num_sources_used": 0
  },
  "system_fingerprint": "fp_3a7881249c"
}
```

---

## Responses API

The Responses API provides a higher-level interface with optional storage, tool invocation, and conversation continuation features.

### Create Response (`POST /v1/responses`)

Generates a response based on textual or multimodal input and stores it for 30 days by default.

#### Request Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `input` | string &#124; array | ✓ | — | Prompt passed to the model. Accepts raw strings, message arrays, or file references. |
| `model` | string | ✓ | — | Target model (e.g., `grok-4-0709`). |
| `store` | boolean |  | `true` | Persist the conversation state for 30 days. |
| `parallel_tool_calls` | boolean |  | `true` | Allow the model to issue multiple tool calls simultaneously. |
| `tool_choice` | string &#124; object |  | `auto` | Control tool invocation (`none`, `auto`, `required`, or specify `{ "type": "function", "function": {"name": "my_fn"}}`). |
| `tools` | array |  | — | JSON Schema definitions for callable tools (functions, web search). Up to 128 tools. |
| `text` | object |  | — | Settings for text formatting (for example `{ "format": { "type": "text" } }`). |

> `input` mirrors OpenAI’s Responses API and can mix text, image, or file segments.

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| `created_at` | integer | Unix timestamp when the response was created. |
| `id` | string | Unique response ID. |
| `model` | string | Model used. |
| `object` | string | Always `response`. |
| `output` | array | Generated content (messages, reasoning traces, tool calls). |
| `status` | string | `completed`, `in_progress`, or `incomplete`. |
| `parallel_tool_calls` | boolean | Indicates whether parallel tool calls are enabled. |
| `previous_response_id` | string | ID of the prior response in the thread, if any. |
| `reasoning` | object &#124; null | Structured reasoning output (when available). |
| `temperature`, `top_p`, `max_output_tokens` | number &#124; null | Sampling controls if provided. |
| `text` | object | Mirrors request text settings. |
| `metadata` | object &#124; null | Compatibility container mirroring OpenAI’s `metadata` field; often omitted. |
| `tool_choice`, `tools` | mixed | Echo back the effective tool configuration. |
| `usage` | object | Token accounting plus cached token counts. |
| `user` | string &#124; null | Optional user identifier. |
| `incomplete_details` | object &#124; null | Populated if the response is incomplete. |
| `store` | boolean | Indicates whether the response is stored. |

#### Example

```json
POST /v1/responses
{
  "input": [
    {
      "role": "system",
      "content": "You are a helpful assistant that can answer questions and help with tasks."
    },
    {
      "role": "user",
      "content": "What is 101*3?"
    }
  ],
  "model": "grok-4-0709"
}
```

```json
200 OK
{
  "created_at": 1754475266,
  "id": "ad5663da-63e6-86c6-e0be-ff15effa8357",
  "max_output_tokens": null,
  "model": "grok-4-0709",
  "object": "response",
  "output": [
    {
      "content": [
        {
          "type": "output_text",
          "text": "101 multiplied by 3 is 303.",
          "logprobs": null,
          "annotations": []
        }
      ],
      "id": "msg_ad5663da-63e6-86c6-e0be-ff15effa8357",
      "role": "assistant",
      "type": "message",
      "status": "completed"
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": null,
  "temperature": null,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": null,
  "usage": {
    "prompt_tokens": 32,
    "completion_tokens": 9,
    "total_tokens": 151,
    "prompt_tokens_details": {
      "text_tokens": 32,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 8
    },
    "completion_tokens_details": {
      "reasoning_tokens": 110,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    },
    "num_sources_used": 0
  },
  "user": null,
  "incomplete_details": null,
  "status": "completed",
  "store": true
}
```

### Retrieve Response (`GET /v1/responses/{response_id}`)

Fetches a previously generated response by ID.

| Path Parameter | Type | Description |
| --- | --- | --- |
| `response_id` | string | ID returned from `POST /v1/responses`. |

The response body matches the create response schema and may contain additional entries such as reasoning summaries.

```json
GET /v1/responses/ad5663da-63e6-86c6-e0be-ff15effa8357
```

```json
200 OK
{
  "created_at": 1754475266,
  "id": "ad5663da-63e6-86c6-e0be-ff15effa8357",
  "object": "response",
  "output": [
    {
      "content": [
        {
          "type": "output_text",
          "text": "101 multiplied by 3 is 303.",
          "logprobs": null,
          "annotations": []
        }
      ],
      "id": "msg_ad5663da-63e6-86c6-e0be-ff15effa8357",
      "role": "assistant",
      "type": "message",
      "status": "completed"
    },
    {
      "id": "",
      "summary": [
        {
          "text": "First, the user asked: \"What is 101*3?\"\n\nThis is a simple multiplication: 101 multiplied by 3.\n\nCalculating: 100 * 3 = 300, and 1 * 3 = 3, so 300 + 3 = 303.\n\nI should respond helpfully and directly, as per my system prompt: \"You are a helpful assistant that can answer questions and help with tasks.\"\n\nKeep the response concise and accurate. No need for extra fluff unless it adds value.\n\nFinal answer: 303.",
          "type": "summary_text"
        }
      ],
      "type": "reasoning",
      "status": "completed"
    }
  ],
  "status": "completed",
  "store": true
}
```

### Delete Response (`DELETE /v1/responses/{response_id}`)

Deletes a stored response.

| Path Parameter | Type | Description |
| --- | --- | --- |
| `response_id` | string | ID of the stored response. |

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | ID of the deleted response. |
| `object` | string | Always `response`. |
| `deleted` | boolean | `true` if deletion succeeded. |

```json
DELETE /v1/responses/ad5663da-63e6-86c6-e0be-ff15effa8357
```

```json
200 OK
{
  "id": "ad5663da-63e6-86c6-e0be-ff15effa8357",
  "object": "response",
  "deleted": true
}
```

---

## Anthropic-Compatible APIs

### Messages (`POST /v1/messages`)

Creates a response using the Anthropic-compatible Messages format.

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | string | ✓ | Model that will process the request. |
| `messages` | array | ✓ | Anthropic-style conversation turns with `role` (`user`/`assistant`) and `content`. |
| `max_tokens` | integer | ✓ | Maximum number of output tokens. |
| Other settings | various |  | Supports Anthropic-compatible parameters (`temperature`, `top_k`, etc.). |

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique identifier for the message object. |
| `type` | string | Always `message`. |
| `role` | string | Always `assistant` for generated output. |
| `content` | array | List of content blocks (text, etc.). |
| `model` | string | Model that handled the request. |
| `stop_reason` | string | Reason generation stopped. |
| `stop_sequence` | string &#124; null | Custom stop sequence if provided. |
| `usage` | object | Token usage breakdown (`input_tokens`, `output_tokens`, cache metrics). |

#### Example

```json
POST /v1/messages
{
  "model": "grok-4-0709",
  "max_tokens": 32,
  "messages": [
    {
      "role": "user",
      "content": "Hello, world"
    }
  ]
}
```

```json
200 OK
{
  "id": "4f224bfb-9d53-4c82-b40a-b7cd80831ec2",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello there! \"Hello, world\" is a classic, isn't it? Whether you're just saying hi or channeling your inner coder, I'm happy to greet you back"
    }
  ],
  "model": "grok-4-0709",
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 9,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 32
  }
}
```

---

## Image Generation

### Generate Images (`POST /v1/images/generations`)

Generate one or more images from a text prompt using image models such as `grok-2-image`.

#### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `prompt` | string | ✓ | Text description of the desired image. |
| `model` | string | ✓ | Image model ID. |
| `response_format` | string |  | Either `url` or `b64_json`. |
| `n` | integer |  | Number of images to generate. |

#### Response Body

| Field | Type | Description |
| --- | --- | --- |
| `data` | array | Each entry contains a generated image object with `url` (or `b64_json`) and a `revised_prompt`. |

#### Example

```json
POST /v1/images/generations
{
  "prompt": "A cat in a tree",
  "model": "grok-2-image",
  "response_format": "url",
  "n": 2
}
```

```json
200 OK
{
  "data": [
    {
      "url": "...",
      "revised_prompt": "A high-resolution photograph of a cat perched on a branch in a lush, green tree during the daytime..."
    },
    {
      "url": "...",
      "revised_prompt": "1. A high-resolution photograph of a gray tabby cat perched on a branch..."
    }
  ]
}
```

---

## Platform Metadata & Management

### Inspect API Key (`GET /v1/api-key`)

Returns metadata about the active API key, including ACLs and audit fields.

| Field | Type | Description |
| --- | --- | --- |
| `redacted_api_key` | string | Masked API key string. |
| `user_id` | string | Owner of the key. |
| `name` | string | User-defined key name. |
| `create_time`, `modify_time` | string | Timestamps. |
| `modified_by` | string | User who last modified the key. |
| `team_id` | string | Owning team. |
| `acls` | array | Granted ACL strings (`api-key:model:*`, etc.). |
| `api_key_id` | string | Internal key ID. |
| `team_blocked`, `api_key_blocked`, `api_key_disabled` | boolean | Status flags. |

```json
GET /v1/api-key
```

```json
200 OK
{
  "redacted_api_key": "xai-...b14o",
  "user_id": "59fbe5f2-040b-46d5-8325-868bb8f23eb2",
  "name": "My API Key",
  "create_time": "2024-01-01T12:55:18.139305Z",
  "modify_time": "2024-08-28T17:20:12.343321Z",
  "modified_by": "3d38b4dc-4eb7-4785-ae26-c3fa8997ffc7",
  "team_id": "5ea6f6bd-7815-4b8a-9135-28b2d7ba6722",
  "acls": [
    "api-key:model:*",
    "api-key:endpoint:*"
  ],
  "api_key_id": "ae1e1841-4326-4b36-a8a9-8a1a7237db11",
  "team_blocked": false,
  "api_key_blocked": false,
  "api_key_disabled": false
}
```

### List Models (`GET /v1/models`)

Lists all models available to the API key with minimal metadata.

| Field | Type | Description |
| --- | --- | --- |
| `data` | array | Each entry has `id`, `created`, `object`, `owned_by`. |
| `object` | string | Always `list`. |

```json
GET /v1/models
```

```json
200 OK
{
  "data": [
    { "id": "grok-4-0709", "created": 1752019200, "object": "model", "owned_by": "xai" },
    { "id": "grok-code-fast-1", "created": 1755993600, "object": "model", "owned_by": "xai" },
    { "id": "grok-3", "created": 1743724800, "object": "model", "owned_by": "xai" },
    { "id": "grok-3-mini", "created": 1743724800, "object": "model", "owned_by": "xai" },
    { "id": "grok-2-image-1212", "created": 1736726400, "object": "model", "owned_by": "xai" },
    { "id": "grok-2-vision-1212", "created": 1733961600, "object": "model", "owned_by": "xai" }
  ],
  "object": "list"
}
```

### Get Model (`GET /v1/models/{model_id}`)

Retrieves minimal metadata for a specific model.

| Path Parameter | Type | Description |
| --- | --- | --- |
| `model_id` | string | ID from `/v1/models` or the console. |

Response fields: `id`, `created`, `object`, `owned_by`.

```json
GET /v1/models/grok-4-0709
```

```json
200 OK
{
  "id": "grok-4-0709",
  "created": 1743724800,
  "object": "model",
  "owned_by": "xai"
}
```

### List Language Models (`GET /v1/language-models`)

Returns detailed metadata (modalities, pricing, aliases) for chat and image-understanding models.

Each entry includes:

- `id`, `fingerprint`, `created`, `owned_by`, `version`
- `input_modalities`, `output_modalities`
- `prompt_text_token_price`, `cached_prompt_text_token_price`, `prompt_image_token_price`, `completion_text_token_price`, `search_price`
- `aliases`

```json
GET /v1/language-models
```

```json
200 OK
{
  "models": [
    {
      "id": "grok-3",
      "fingerprint": "fp_898ae9f31c",
      "created": 1743724800,
      "object": "model",
      "owned_by": "xai",
      "version": "1.0",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "prompt_text_token_price": 30000,
      "cached_prompt_text_token_price": 7500,
      "prompt_image_token_price": 0,
      "completion_text_token_price": 150000,
      "search_price": 250000000,
      "aliases": ["grok-3-latest", "grok-3-beta"]
    },
    {
      "id": "grok-3-mini",
      "fingerprint": "fp_6a09108ff5",
      "created": 1743724800,
      "object": "model",
      "owned_by": "xai",
      "version": "1.0",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "prompt_text_token_price": 3000,
      "cached_prompt_text_token_price": 750,
      "prompt_image_token_price": 0,
      "completion_text_token_price": 5000,
      "search_price": 250000000,
      "aliases": ["grok-3-mini-latest", "grok-3-mini-beta"]
    },
    {
      "id": "grok-2-vision-1212",
      "fingerprint": "fp_daba7546e5",
      "created": 1733961600,
      "object": "model",
      "owned_by": "xai",
      "version": "0.1.0",
      "input_modalities": ["text", "image"],
      "output_modalities": ["text"],
      "prompt_text_token_price": 20000,
      "prompt_image_token_price": 20000,
      "completion_text_token_price": 100000,
      "aliases": []
    }
  ]
}
```

### Get Language Model (`GET /v1/language-models/{model_id}`)

Retrieves detailed metadata for a specific chat or vision model.

Fields include: `id`, `fingerprint`, `created`, `object`, `owned_by`, `version`, `input_modalities`, `output_modalities`, `prompt_text_token_price`, `cached_prompt_text_token_price`, `prompt_image_token_price`, `completion_text_token_price`, `search_price`, `aliases`.

```json
GET /v1/language-models/grok-4-0709
```

```json
200 OK
{
  "id": "grok-4-0709",
  "fingerprint": "fp_156d35dcaa",
  "created": 1743724800,
  "object": "model",
  "owned_by": "xai",
  "version": "1.0.0",
  "input_modalities": ["text"],
  "output_modalities": ["text"],
  "prompt_text_token_price": 20000,
  "cached_prompt_text_token_price": 0,
  "prompt_image_token_price": 0,
  "completion_text_token_price": 100000,
  "aliases": ["grok-4", "grok-4-latest"]
}
```

### List Image Generation Models (`GET /v1/image-generation-models`)

Provides detailed metadata for image generation models, including max prompt length and pricing.

```json
GET /v1/image-generation-models
```

```json
200 OK
{
  "models": [
    {
      "id": "grok-2-image",
      "fingerprint": "fp_ca78641a52",
      "max_prompt_length": 1024,
      "created": 1738961600,
      "object": "model",
      "owned_by": "xai",
      "version": "1.0.0",
      "prompt_text_token_price": 100000,
      "prompt_image_token_price": 100000,
      "generated_image_token_price": 100000,
      "aliases": []
    }
  ]
}
```

### Get Image Generation Model (`GET /v1/image-generation-models/{model_id}`)

Returns full metadata for a specific image generation model (`id`, `fingerprint`, `max_prompt_length`, `created`, `object`, `owned_by`, `version`, `prompt_text_token_price`, `prompt_image_token_price`, `generated_image_token_price`, `image_price`, `aliases`).

```json
GET /v1/image-generation-models/grok-2-image
```

```json
200 OK
{
  "id": "grok-2-image",
  "fingerprint": "fp_ca78641a52",
  "max_prompt_length": 1024,
  "created": 1737961600,
  "object": "model",
  "owned_by": "xai",
  "version": "1.0.0",
  "prompt_text_token_price": 100000,
  "prompt_image_token_price": 100000,
  "generated_image_token_price": 100000,
  "aliases": []
}
```

---

## Utility Endpoints

### Tokenize Text (`POST /v1/tokenize-text`)

Tokenizes input text using the specified model.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | ✓ | Text to tokenize. |
| `model` | string | ✓ | Model whose tokenizer should be used. |

Response:

| Field | Type | Description |
| --- | --- | --- |
| `token_ids` | array | Each entry includes `token_id`, `string_token`, and `token_bytes`. |

```json
POST /v1/tokenize-text
{
  "text": "Hello world!",
  "model": "grok-4-0709"
}
```

```json
200 OK
{
  "token_ids": [
    { "token_id": 13902, "string_token": "Hello", "token_bytes": [72, 101, 108, 108, 111] },
    { "token_id": 1749, "string_token": " world", "token_bytes": [32, 119, 111, 114, 108, 100] },
    { "token_id": 161, "string_token": "!", "token_bytes": [33] }
  ]
}
```

### Deferred Chat Completion Lookup (`GET /v1/chat/deferred-completion/{request_id}`)

Retrieves the result of a previously started deferred chat completion. Returns `202 Accepted` while still processing.

| Path Parameter | Type | Description |
| --- | --- | --- |
| `request_id` | string | ID returned when the deferred request was created. |

Response fields mirror `POST /v1/chat/completions`.

```json
GET /v1/chat/deferred-completion/335b92e4-afa5-48e7-b99c-b9a4eabc1c8e
```

```json
200 OK
{
  "id": "335b92e4-afa5-48e7-b99c-b9a4eabc1c8e",
  "object": "chat.completion",
  "created": 1743770624,
  "model": "grok-4-0709",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "101 multiplied by 3 is 303.",
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 31,
    "completion_tokens": 11,
    "total_tokens": 42,
    "prompt_tokens_details": {
      "text_tokens": 31,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "system_fingerprint": "fp_156d35dcaa"
}
```

---

## Legacy Endpoints

These endpoints exist for backward compatibility and are not supported by reasoning models.

### Text Completions (`POST /v1/completions`)

Creates a classic text completion (OpenAI-style).

Response fields: `id`, `object` (`text_completion`), `created`, `model`, `choices` (`index`, `text`, `finish_reason`), `usage`, `system_fingerprint`.

```json
POST /v1/completions
{
  "prompt": "1, 2, 3, 4, ",
  "model": "grok-3",
  "max_tokens": 3
}
```

```json
200 OK
{
  "id": "873492b3-6144-4279-ac2e-2c45242c5ce6",
  "object": "text_completion",
  "created": 1743771779,
  "model": "grok-3",
  "choices": [
    {
      "index": 0,
      "text": "5, ",
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 3,
    "total_tokens": 15,
    "prompt_tokens_details": {
      "text_tokens": 12,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "system_fingerprint": "fp_156d35dcaa"
}
```

### Anthropic-Compatible Completions (`POST /v1/complete`)

Legacy endpoint compatible with the Anthropic completion API.

| Field | Type | Description |
| --- | --- | --- |
| `type` | string | Always `completion`. |
| `id` | string | Completion ID. |
| `completion` | string | Generated text (omits stop sequence). |
| `stop_reason` | string | Why generation stopped (e.g., `max_tokens`). |
| `model` | string | Model ID. |

```json
POST /v1/complete
{
  "model": "grok-3",
  "max_tokens_to_sample": 8,
  "temperature": 0.1,
  "prompt": "\n\nHuman: Hello, how are you?\n\nAssistant:"
}
```

```json
200 OK
{
  "type": "completion",
  "id": "982044c5-760c-4c8d-8936-f906b5cedc26",
  "completion": " Hey there! I'm doing great, thanks",
  "stop_reason": "max_tokens",
  "model": "grok-3"
}
```

---

This Markdown file preserves the full content of `xaiapi.txt` while organizing the material into linkable sections, tables, and examples for rapid reference.
