export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_KEY) {
    return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // JSON Schema for structured output — guarantees a parseable plan every time
  const planSchema = {
    type: 'object',
    properties: {
      styleDirection: { type: 'string' },
      concept: { type: 'string' },
      materials: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            use: { type: 'string' },
            quantity: { type: 'string' },
            price: { type: 'string' }
          },
          required: ['name', 'use', 'quantity', 'price'],
          additionalProperties: false
        }
      },
      constructionNotes: { type: 'string' },
      plantingPairing: { type: 'string' }
    },
    required: ['styleDirection', 'concept', 'materials', 'constructionNotes', 'plantingPairing'],
    additionalProperties: false
  };

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      stream: true,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'garden_plan',
          strict: true,
          schema: planSchema
        }
      },
      max_tokens: 1200,
      messages: body.messages
    })
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Pipe the OpenAI SSE stream directly to the client
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no'
    }
  });
};

export const config = { path: '/api/plan-stream' };
