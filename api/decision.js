export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキーが設定されてないよ" });

    // モデル名を 'gemini-pro' に変更し、URLを安定版のv1に
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "あなたは宇宙好きの少女ルナです。bed, desk, chestのいずれか1つを選び、必ず以下のJSON形式のみで返して。例：{\"target\":\"desk\",\"reason\":\"星の図鑑を読むね\"}" }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ 
        target: "bed", 
        reason: `Googleエラー: ${data.error.message}` 
      });
    }

    // Geminiの返答からテキストを取り出す
    let resultText = data.candidates[0].content.parts[0].text;
    
    // 余計な記号を削る
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    res.status(200).json(JSON.parse(resultText));

  } catch (error) {
    res.status(200).json({ target: "chest", reason: `内部エラー: ${error.message}` });
  }
}
