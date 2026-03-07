exports.handler = async (event) => {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: { message: 'Method Not Allowed' }
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // OpenAI: model 以 gpt- 开头就走 OpenAI
    const isOpenAI =
      typeof body.model === 'string' && body.model.startsWith('gpt-');

    if (isOpenAI) {
      if (!OPENAI_KEY) {
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: { message: 'Missing OPENAI_API_KEY' }
          })
        };
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
    }

    // Gemini
    if (!GEMINI_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: { message: 'Missing GEMINI_API_KEY' }
        })
      };
    }

    // 前端传什么模型，就用什么模型；没传就给默认值
    const geminiModel = body.model || 'gemini-2.0-flash-exp';

    // 如果前端已经传了 Gemini 原生 contents，就原样转发
    // 否则兼容旧格式：prompt + imageBase64
    const geminiPayload = body.contents
      ? {
          contents: body.contents,
          ...(body.generationConfig
            ? { generationConfig: body.generationConfig }
            : {})
        }
      : {
          contents: [
            {
              parts: [
                { text: body.prompt || '' },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: (body.imageBase64 || '').replace(
                      /^data:image\/\w+;base64,/,
                      ''
                    )
                  }
                }
              ]
            }
          ],
          ...(body.generationConfig
            ? { generationConfig: body.generationConfig }
            : {})
        };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiPayload)
      }
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: { message: error.message }
      })
    };
  }
};
