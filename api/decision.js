export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキー未設定" });

    // 2026年の標準モデル名 gemini-2.0-flash を使用
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "JSONのみで返して。少女ルナとしてbed, desk, chestから1つ選び、理由も。例：{\"target\":\"bed\",\"reason\":\"眠い\"}" }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // エラーが起きた場合、今使えるモデル名をヒントとして出す
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
      res.status(200).json({ target: "desk", reason: "AIの応答が空でした" });
    }

  } catch (error) {
    res.status(200).json({ target: "chest", reason: `内部エラー: ${error.message}` });
  }
}
