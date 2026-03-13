export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキー未設定" });

    // 最も互換性が高い 'gemini-1.0-pro' を使用
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "JSON形式のみで返して。少女ルナとして、bed, desk, chestから1つ選び、その理由も短く。例：{\"target\":\"bed\",\"reason\":\"眠い\"}" }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // エラーが出た場合、メッセージを簡略化して表示
      return res.status(200).json({ 
        target: "bed", 
        reason: `Googleエラー(${data.error.code}): ${data.error.message}` 
      });
    }

    if (data.candidates && data.candidates[0].content) {
      let resultText = data.candidates[0].content.parts[0].text;
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.status(200).json(JSON.parse(resultText));
    } else {
      res.status(200).json({ target: "desk", reason: "AIが応答しませんでした" });
    }

  } catch (error) {
    res.status(200).json({ target: "chest", reason: "通信エラーが発生しました" });
  }
}
