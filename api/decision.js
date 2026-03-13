export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. キーがない場合に即座にエラーを出す（ログで確認するため）
    if (!apiKey) {
      return res.status(200).json({ target: "desk", reason: "APIキーが設定されていないみたい！" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = {
      contents: [{
        parts: [{
          text: "宇宙好きの少女ルナとして、bed, desk, chestのいずれか1つをjson形式で選んで。例：{\"target\":\"desk\",\"reason\":\"読書する\"}"
        }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();

    // 2. Googleからの返答がエラーでないかチェック
    if (data.error) {
      console.error("Gemini Error:", data.error);
      return res.status(200).json({ target: "bed", reason: "AIが少し疲れちゃったみたい（APIエラー）" });
    }

    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    res.status(200).json(JSON.parse(resultText));

  } catch (error) {
    // 3. 何が起きてもフリーズさせない
    console.error("Server Error:", error);
    res.status(200).json({ target: "chest", reason: "エラーが起きたけど、頑張って動くよ！" });
  }
}
