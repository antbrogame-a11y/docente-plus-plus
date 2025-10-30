# OpenRouter API Integration Example

## Endpoint
```
https://openrouter.ai/api/v1/chat/completions
```

## Authentication
The API key is sent in the `Authorization` header as a Bearer token:
```
Authorization: Bearer YOUR_OPENROUTER_API_KEY
```

## Default Model
```
alibaba/tongyi-deepresearch-30b-a3b
```
This is a free model used by default. The application now allows users to configure any OpenRouter model through the settings interface.

## Configurable Models

Starting from the latest version, Docente++ allows users to configure which OpenRouter model to use through the settings interface. This provides flexibility to:

- Use different models based on specific needs
- Switch between free and paid models
- Test different models for optimal results

### Popular OpenRouter Models

| Model | Provider | Type | Cost |
|-------|----------|------|------|
| `alibaba/tongyi-deepresearch-30b-a3b` | Alibaba | Free | Free |
| `openai/gpt-3.5-turbo` | OpenAI | Fast & Economical | Paid |
| `openai/gpt-4` | OpenAI | Advanced | Paid |
| `anthropic/claude-2` | Anthropic | Conversational | Paid |
| `google/palm-2-chat-bison` | Google | Chat | Paid |

For a complete list of available models, visit [OpenRouter Models](https://openrouter.ai/models).

### How to Configure a Custom Model

1. Open Docente++ in your browser
2. Navigate to the "Impostazioni" (Settings) tab
3. Enter your OpenRouter API Key
4. Enter the Model ID in the "Model ID" field (e.g., `openai/gpt-3.5-turbo`)
5. Click "Verifica API Key" to verify the model is accessible
6. Click "Salva Impostazioni" to save

The application will use your configured model for all AI operations.

## Example Request

### JavaScript Fetch Example
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_OPENROUTER_API_KEY`
    },
    body: JSON.stringify({
        model: 'alibaba/tongyi-deepresearch-30b-a3b',
        messages: [
            {
                role: 'system',
                content: 'Sei un assistente IA specializzato nell\'aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale.'
            },
            {
                role: 'user',
                content: 'Genera un piano di lezione per matematica'
            }
        ],
        temperature: 0.7,
        max_tokens: 2000
    })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### cURL Example
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "alibaba/tongyi-deepresearch-30b-a3b",
    "messages": [
      {
        "role": "system",
        "content": "Sei un assistente IA specializzato nell'\''aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale."
      },
      {
        "role": "user",
        "content": "Genera un piano di lezione per matematica"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 2000
  }'
```

## Response Format
The response follows the OpenAI-compatible format:
```json
{
  "id": "gen-xxxxxxxxxxxxx",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "content": "Ecco un piano di lezione per matematica...",
        "role": "assistant"
      },
      "index": 0
    }
  ],
  "created": 1234567890,
  "model": "alibaba/tongyi-deepresearch-30b-a3b",
  "object": "chat.completion"
}
```

## Getting Your API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and paste it in the application settings

## Notes

- The `alibaba/tongyi-deepresearch-30b-a3b` model is the default free model available on OpenRouter
- **NEW**: The application now supports configurable models - users can specify any OpenRouter model in the settings
- The API is compatible with OpenAI's chat completions format
- The application uses a standard message structure and parameters (temperature, max_tokens)
- When verifying the API key, the application tests with the configured model to ensure it's accessible
