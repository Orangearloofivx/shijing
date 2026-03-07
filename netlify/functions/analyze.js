exports.handler = async (event) => {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        message: 'ANALYZE_FUNCTION_IS_WORKING',
        hasOpenAIKey: !!OPENAI_KEY,
        hasGeminiKey: !!GEMINI_KEY,
        method: event.httpMethod
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const isOpenAI = !!body.model;

    let response;

    if (isOpenAI) {
      if (!OPENAI_KEY) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: { message: 'Missing OPENAI_API_KEY' }
          })
        };
      }

      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(body)
      });
    } else {
      if (!GEMINI_KEY) {
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: { message: 'Missing GEMINI_API_KEY' }
          })
        };
      }

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: body.prompt || '' },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: (body.imageBase64 || '').replace(/^data:image\/\w+;base64,/, '')
                    }
                  }
                ]
              }
            ]
          })
        }
      );
    }

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        debug: {
          isOpenAI,
          hasOpenAIKey: !!OPENAI_KEY,
          hasGeminiKey: !!GEMINI_KEY,
          upstreamStatus: response.status
        },
        ...data
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: { message: error.message }
      })
    };
  }
};
