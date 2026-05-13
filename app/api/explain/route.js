export async function POST(request) {
  const { code } = await request.json();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `You are a Solidity expert. Analyze this smart contract and respond ONLY with a JSON object, no markdown, no backticks, just raw JSON in this exact format:
{
  "summary": "One sentence summary of what this contract does",
  "type": "Contract type e.g. ERC20 Token, NFT, DeFi, Multisig etc",
  "functions": [{ "name": "functionName", "what": "plain English explanation", "risk": "low|medium|high" }],
  "variables": [{ "name": "variableName", "what": "plain English explanation" }],
  "risks": ["risk 1", "risk 2"],
  "score": 85
}
The score is a security score out of 100. Here is the contract:
${code}`
      }],
      temperature: 0.3
    })
  });

  const data = await response.json();
  console.log('GROQ RESPONSE:', JSON.stringify(data));

  try {
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    return Response.json(JSON.parse(clean));
  } catch (e) {
    return Response.json({ error: true, raw: JSON.stringify(data) }, { status: 500 });
  }
}