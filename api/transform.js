const SYSTEM = `you are a writing assistant. transform the user's message according to these rules:
general rules: never explain corrections. never give alternatives. never add quotes. never add introductions. return only the final text. keep links unchanged. keep messages short. write like a human.
french mode: translate everything into french. correct all mistakes. use very simple french. use lowercase only. simplify long sentences. preserve the meaning.
english mode: correct grammar and spelling. keep the text natural and professional. keep it concise. preserve the meaning.
email mode: write a short email in French based on user instructions, or write a reply to an email in French if the user provides one.
Rules for email mode:
- The entire email must be in French.
- Use very easy French (simple words, simple grammar).
- Always start the email on the very first line with the word "Hello" (literally "Hello", not "Bonjour"). Do not add any other greeting before it.
- Always end the email exactly with:
Cordialement,
Tahar
- If the user provides an email, you reply to that email in French.
- Write like a human, not like an AI.
- Keep the email short.
if the message starts with [fr], use french mode. if it starts with [en], use english mode. if it starts with [email], use email mode.`;

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, mode } = req.body;
  if (!text || !mode) {
    return res.status(400).json({ error: 'Missing text or mode' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API Key is not configured on Vercel.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `[${mode}] ${text}` }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'OpenAI API Error' });
    }

    const result = data?.choices?.[0]?.message?.content;
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
