# Constructing WhatsApp Template Send Requests

Learn how to properly format and send WhatsApp template messages through the 8x8 API using both manual and automated approaches. This guide covers everything from basic template structure to advanced scripting for bulk template preparation.

---

## Overview

WhatsApp Business templates are pre-approved message formats that allow businesses to initiate conversations with customers. This guide demonstrates two methods for sending these templates via the 8x8 API:

| Method | Description | Best For |
| --- | --- | --- |
| Manual | Step-by-step process using curl and JSON payloads | One-off messages, learning the API |
| Automated | Automated generation of ready-to-use cURL commands | Multiple templates, production workflows |

---

## Prerequisites

* 8x8 API credentials (Account ID, Channel ID, Subaccount ID, API Key)
* WhatsApp recipient phone number (E.164 format, e.g., +14155551212)
* WhatsApp templates created and approved either via the [Connect portal](/connect/docs/whatsapp-templates-management) or [API](/connect/reference/add-whatsapp-template)
* [curl](https://curl.se/) installed
* For automated method: [Node.js](https://nodejs.org/) (v16+), `npm install dotenv axios`

---

## Manual Method

### 1. Fetch Templates

Run the following command in a terminal

```bash
curl -s -X GET "https://chatapps.8x8.com/api/v1/accounts/{your_account_id}/channels/{your_channel_id}/templates" \
  -H "Authorization: Bearer {{your_api_key}}" \
  -H "Accept: application/json" > templates.json

```

### 2. Extract Template Details

Open `templates.json` in a text editor. Note:

* `templateName` as per the GET Templates response (or `name`) in the corresponding Send message we're trying to compose
* `language`
* `components` (for required parameters)

---

### 3. Base API Request Structure

Every WhatsApp template message request to the 8x8 API must include the following fields:

```json
{
  "user": { "msisdn": "{{recipientPhoneNumber}}" },
  "type": "template",
  "content": {
    "template": {
      "name": "your_template_name",
      "language": "template_language_code",
      "components": [ /* see examples below */ ]
    }
  }
}

```

* `user.msisdn`: The recipient's phone number in E.164 format.
* `type`: Always `"template"` for template messages.
* `content.template.name`: The template name as shown in your templates list.
* `content.template.language`: The language code (e.g., `"en"`).
* `content.template.components`: An array of components (see examples below).

---

### 4. Compose the Message Payload

Below are examples of the full payload for different template types. Replace the `components` array as needed.

#### Simple Template (No Parameters)

```json
{
  "user": { "msisdn": "{{recipientPhoneNumber}}" },
  "type": "template",
  "content": {
    "template": {
      "name": "{{your_template_name}}",
      "language": "{{language_code}}",
      "components": []
    }
  }
}

```

#### Media Template Example

```json
{
  "user": { "msisdn": "{{recipientPhoneNumber}}" },
  "type": "template",
  "content": {
    "template": {
      "name": "{{your_template_name}}",
      "language": "en",
      "components": [
        {
          "type": "header",
          "parameters": [
            { "type": "image", "url": "{{header_image_url}}" }
          ]
        }
      ]
    }
  }
}

```

#### Body Parameters Example

```json
{
  "user": { "msisdn": "{{recipientPhoneNumber}}" },
  "type": "template",
  "content": {
    "template": {
      "name": "{{your_template_name}}",
      "language": "en",
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "{{body_text_1}}" }
          ]
        }
      ]
    }
  }
}

```

#### AUTHENTICATION Template Example

```json
{
  "user": { "msisdn": "{{recipientPhoneNumber}}" },
  "type": "template",
  "content": {
    "template": {
      "name": "{{your_template_name}}",
      "language": "en",
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "{{otpCode}}" }
          ]
        },
        {
          "type": "Button",
          "subType": "url",
          "index": 0,
          "parameters": [
            { "type": "text", "text": "{{otpCode}}" }
          ]
        }
      ]
    }
  }
}

```

---

### 5. Send the Message

Save your payload to `message.json` and run the command below in the terminal

```bash
SUBACCOUNT_ID="your_subaccount_id"
API_TOKEN="your_api_token"

curl -X POST "https://chatapps.8x8.com/api/v1/subaccounts/$SUBACCOUNT_ID/messages" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @message.json

```

---

## Automated Method

### 1. Setup

* Place [generate-curl-scripts.js](https://gist.github.com/harrism04/c2ed6e3b4a7c7f888e3bdfc75f0cb91f) in your project directory.

```typescript
// @ts-check
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'https://chatapps.8x8.com';
const ACCOUNT_ID = process.env.ACCOUNT_ID || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';
const SUBACCOUNT_ID = process.env.SUBACCOUNT_ID || '';
const API_KEY = process.env.API_KEY || '';

const OUTPUT_DIR = 'generated_curl_scripts';

function getComponents(template) {
  if (
    (template.type && template.type.toUpperCase() === 'AUTHENTICATION') ||
    (template.category && template.category.toUpperCase() === 'AUTHENTICATION')
  ) {
    return [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "{{otpCode}}" // Using placeholder for OTP
          }
        ]
      },
      {
        "type": "Button",
        "subType": "url",
        "index": 0,
        "parameters": [
          {
            "type": "text",
            "text": "{{otpCode}}" // Using placeholder for OTP
          }
        ]
      }
    ];
  }

  // For other templates, generate descriptive placeholders based on structure
  const components = [];
  if (template.components) {
    template.components.forEach(component => {
      const componentType = component.type.toUpperCase();
      if (componentType === 'HEADER') {
        const format = component.format?.toUpperCase();
        if (format === 'TEXT' && component.text) {
          const placeholders = findPlaceholders(component.text);
          if (placeholders.length > 0) {
            components.push({
              type: "header",
              parameters: placeholders.map(num => ({ type: "text", text: `{{header_text_${num}}}` }))
            });
          }
        } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(format)) {
           components.push({
              type: "header",
              parameters: [{ type: format.toLowerCase(), url: `{{header_${format.toLowerCase()}_url}}` }]
            });
        } else if (format === 'LOCATION') {
             components.push({
                type: "header",
                location: { latitude: "{{header_loc_lat}}", longitude: "{{header_loc_lon}}", name: "{{header_loc_name}}", address: "{{header_loc_addr}}" }
             });
        }
      } else if (componentType === 'BODY' && component.text) {
        const placeholders = findPlaceholders(component.text);
        if (placeholders.length > 0) {
          components.push({
            type: "body",
            parameters: placeholders.map(num => ({ type: "text", text: `{{body_text_${num}}}` }))
          });
        }
      } else if (componentType === 'BUTTONS' && component.buttons) {
          component.buttons.forEach((button, buttonIndex) => {
              if (button.type.toUpperCase() === 'URL' && button.url) {
                  const placeholders = findPlaceholders(button.url);
                  if (placeholders.length > 0) {
                      components.push({
                          type: "button",
                          subType: "url",
                          index: buttonIndex,
                          parameters: placeholders.map(num => ({ type: "text", text: `{{button_${buttonIndex}_url_param_${num}}}` }))
                      });
                  }
              }
          });
      }
    });
  }

  return components;
}

// Extracts {{n}} placeholders from a string (copied from static/script.js)
function findPlaceholders(text) {
    if (!text) return [];
    const regex = /{{(\d+)}}/g;
    const placeholders = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
        placeholders.add(parseInt(match[1], 10));
    }
    return Array.from(placeholders).sort((a, b) => a - b);
}

async function fetchTemplates() {
  const url = `${API_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/channels/${CHANNEL_ID}/templates`;
  const headers = { Authorization: `Bearer ${API_KEY}` };
  const { data } = await axios.get(url, { headers });
  return data.templates || [];
}

function generateCurlCommand(template) {
  const payload = {
    user: { msisdn: '{{recipientPhoneNumber}}' }, // Use placeholder here
    type: 'template',
    content: {
      template: {
        name: template.templateName || template.name,
        language: template.language || 'en',
        components: getComponents(template)
      }
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const escapedJsonString = jsonString.replace(/'/g, "'\\''");

  const curlCommand = `curl -X POST \\
  '${API_BASE_URL}/api/v1/subaccounts/${SUBACCOUNT_ID}/messages' \\
  -H 'Authorization: Bearer {{apiKey}}' \\
  -H 'Content-Type: application/json' \\
  -d '${escapedJsonString}'`;

  return curlCommand;
}

(async () => {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    const templates = await fetchTemplates();
    if (templates.length === 0) {
      console.log('No templates found.');
      return;
    }

    console.log(`Generating cURL scripts for ${templates.length} templates in ./${OUTPUT_DIR}/`);

    for (const template of templates) {
      const templateName = template.templateName || template.name;
      const language = template.language || 'en';
      const filename = `${templateName}_${language}.sh`;
      const filepath = path.join(OUTPUT_DIR, filename);
      const curlCommand = generateCurlCommand(template);

      const scriptContent = `#!/bin/bash
# cURL command for template: ${templateName} (${language})
# Category: ${template.category || 'N/A'}

# Replace {{apiKey}} with your actual 8x8 API Key
# Replace placeholder values in the -d payload as needed, including {{recipientPhoneNumber}}

${curlCommand}
`;

      fs.writeFileSync(filepath, scriptContent);
      fs.chmodSync(filepath, '755'); // Make the script executable
    }

    console.log('cURL scripts generated successfully.');

  } catch (err) {
    console.error('Failed to generate cURL scripts:', err.message);
  }
})();

```

* Install dependencies:

```bash
npm install dotenv axios

```

* Create a `.env` file:

```bash
API_BASE_URL=https://chatapps.8x8.com # replace with endpoint associated with your DC region https://developer.8x8.com/connect/docs/data-center-region#api-endpoints-and-data-center-region
ACCOUNT_ID=your_account_id
CHANNEL_ID=your_channel_id
SUBACCOUNT_ID=your_subaccount_id
API_KEY=your_api_key

```

### 2. Generate cURL Scripts

```bash
node generate-curl-scripts

```

* This creates a `generated_curl_scripts` directory with `.sh` files for each template.

### 3. Use the Generated Scripts

* Edit the `.sh` file:
  * Replace `{{apiKey}}` with your API Key.
  * Replace placeholders (e.g., `{{recipientPhoneNumber}}`, `{{otpCode}}`) with real values.
* Run the script:

```bash
./your_template_en.sh

```

---

## Tips & Best Practices

* Always replace placeholders with real values before sending.
* Test with a non-production recipient first.
* Review API responses or [delivery receipts](/connect/reference/delivery-receipts-for-outbound-chatapps) for errors. You can also check the [Logs](/connect/docs/messaging-apps#logs) and take action from there.
* From time to time, Meta might not deliver messages to maintain a healthy ecosystem (Error Code: 131049 and similar), so you can try sending it to a secondary non-production recipient or try again later
