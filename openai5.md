# GPT-5 Mini Reference

A quick reference for using the cost-optimized GPT-5 mini model across our services.

## Snapshot IDs
- `gpt-5-mini` (alias)
- `gpt-5-mini-2025-08-07` (current dated snapshot)

## Positioning
- Fast, lower-cost member of the GPT-5 family; great for well-defined prompts and structured outputs.
- 400,000 token context window; up to 128,000 max output tokens.
- May 31, 2024 knowledge cutoff; supports reasoning tokens.
- Pricing (per 1M tokens): input $0.25, cached input $0.025, output $2.00.

## Endpoints & Features
- Endpoints: `v1/responses`, `v1/chat/completions`, `v1/realtime`, `v1/assistants`, `v1/batch`, `v1/fine-tuning`, `v1/embeddings`, `v1/images/generations`, `v1/videos`, `v1/audio/speech`, `v1/audio/transcriptions`, `v1/audio/translations`, `v1/moderations`, `v1/completions` (legacy).
- Function calling and structured outputs supported; streaming supported.
- Tools: web search, file search, code interpreter available; image generation and computer use not supported for this model.
- Fine-tuning and distillation are not supported.

## Parameter Notes
- Do **not** send `temperature`, `top_p`, or `logprobs` with GPT-5 mini; these fields raise errors for non-GPT-5.1 models.
- Use `max_output_tokens` (Responses API) or `max_completion_tokens` (Chat Completions) to cap length.
- For verbosity control with Responses API, use `text: { verbosity: "low" | "medium" | "high" }`.

## Quickstart (Responses API)
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5-mini",
  input: [
    { role: "system", content: "You are a concise call analysis assistant." },
    { role: "user", content: "Summarize this transcript in 3 sentences: <transcript here>" }
  ],
  text: { verbosity: "low" },
  max_output_tokens: 300
});

console.log(response.output_text);
```

## Quickstart (Chat Completions)
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: "gpt-5-mini",
  messages: [
    { role: "system", content: "You are a concise call analysis assistant." },
    { role: "user", content: "Summarize this transcript in 3 sentences: <transcript here>" }
  ],
  response_format: { type: "text" },
  max_completion_tokens: 300
});

console.log(completion.choices[0]?.message?.content);
```

## Rate Limits (per usage tier)
- Tier 1: 500 RPM / 500,000 TPM / 5,000,000 batch queue
- Tier 2: 5,000 RPM / 2,000,000 TPM / 20,000,000 batch queue
- Tier 3: 5,000 RPM / 4,000,000 TPM / 40,000,000 batch queue
- Tier 4: 10,000 RPM / 10,000,000 TPM / 1,000,000,000 batch queue
- Tier 5: 30,000 RPM / 180,000,000 TPM / 15,000,000,000 batch queue

## Usage Tips
- Keep prompts explicit and structured for best latency/cost trade-offs.
- Prefer cached prompts for repeated system instructions to leverage cached input pricing.
- If a response returns unexpected structure, inspect `output_text` first and fall back to concatenating `output` parts when present.
