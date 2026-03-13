export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキーが空だよ" });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "bed, desk, chestのいずれか1つをjson形式で選んで。例：{\"target\":\"desk\",\"reason\":\"test\"}" }] }]
      })
    });

    const data = await response.json();

    // ★ ここが重要！Googleからのエラーをそのまま画面に出す
    if (data.error) {
      return res.status(200).json({ 
        target: "bed", 
        reason: `Googleエラー: ${data.error.message} (${data.error.status})` 
      });
    }

    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    res.status(200).json(JSON.parse(resultText));

  } catch (error) {
    res.status(200).json({ target: "chest", reason: `内部エラー: ${error.message}` });
  }
}
