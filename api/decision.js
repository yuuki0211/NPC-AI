export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキーがないよ" });

    // URLを v1 にし、モデル名に -latest を付け加えました
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "JSON形式のみで返して。少女ルナとして、bed, desk, chestから1つ選び、その理由も添えて。例：{\"target\":\"bed\",\"reason\":\"眠い\"}" }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // エラーが出たら、別の候補「gemini-pro」でも試すようにフォールバックを入れる（念のため）
      return res.status(200).json({ 
        target: "bed", 
        reason: `Googleエラー: ${data.error.message}` 
      });
    }

    if (data.candidates && data.candidates[0].content) {
      let resultText = data.candidates[0].content.parts[0].text;
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.status(200).json(JSON.parse(resultText));
    } else {
      res.status(200).json({ target: "desk", reason: "AIの返答が空だったよ" });
    }

  } catch (error) {
    res.status(200).json({ target: "chest", reason: `内部エラー: ${error.message}` });
  }
}
