export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ target: "desk", reason: "APIキーが設定されてないよ" });

    // モデル名を 'gemini-1.5-pro' もしくは 'gemini-1.5-flash' のフルネームに変更
    // URLは現在の主流である v1beta に戻し、モデル名をより詳細に指定します
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "あなたは宇宙好きの少女ルナです。bed, desk, chestのいずれか1つを選び、必ず以下のJSON形式のみで返して。例：{\"target\":\"desk\",\"reason\":\"星の図鑑を読むね\"}" }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // エラーの詳細をさらに詳しく表示するように強化
      return res.status(200).json({ 
        target: "bed", 
        reason: `Googleエラー: ${data.error.message} (Code: ${data.error.status})` 
      });
    }

    // テキスト抽出処理
    if (data.candidates && data.candidates[0].content) {
      let resultText = data.candidates[0].content.parts[0].text;
      resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.status(200).json(JSON.parse(resultText));
    } else {
      res.status(200).json({ target: "desk", reason: "AIの返答が空っぽだったよ" });
    }

  } catch (error) {
    res.status(200).json({ target: "chest", reason: `内部エラー: ${error.message}` });
  }
}
