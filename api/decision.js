export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // ルナの設定（プロンプト）
  const prompt = {
    contents: [{
      parts: [{
        text: `あなたは宇宙とSFが大好きな美少女「ルナ」です。
        部屋には「bed（ベッド）」「desk（机と椅子）」「chest（チェスト）」があります。
        今の状況に合わせて、次に行く場所を1つ選んでください。
        返答は必ず以下のJSON形式のみで返して。余計な説明は不要です。
        {"target": "場所の名前(bed, desk, chestのいずれか)", "reason": "その場所で何をするかの短い理由"}`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // AIの返答をそにままフロントエンドに返す
    res.status(200).json(JSON.parse(resultText));
  } catch (error) {
    res.status(500).json({ error: "AIの思考が遮断されました" });
  }
}
