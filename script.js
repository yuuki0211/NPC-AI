const canvas = document.getElementById('roomCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const objects = {
    bed: { x: 70, y: 530, label: "ベッド" },
    desk: { x: 330, y: 300, label: "机と椅子" },
    chest: { x: 70, y: 300, label: "チェスト" }
};

let player = { x: 200, y: 300 };
let currentTarget = null;
let waitTimer = 0;

// 【新機能】AIに次の行動を聞く関数
async function askAI() {
    document.getElementById('status').innerText = "ルナ: 考え中...";
    try {
        // 自作したNode.js APIを呼び出す
        const response = await fetch('/api/decision');
        const data = await response.json();
        
        // AIが選んだ目的地をセット
        currentTarget = objects[data.target];
        document.getElementById('status').innerText = `ルナ: ${data.reason}`;
    } catch (e) {
        console.error("AI通信失敗", e);
        document.getElementById('status').innerText = "ルナ: 通信エラー...";
        // 失敗したら5秒後に再試行
        setTimeout(askAI, 5000);
    }
}

function update() {
    if (waitTimer > 0) {
        waitTimer--;
        if (waitTimer === 1) askAI(); // 休憩が終わったら次の行動を聞く
        return;
    }

    if (!currentTarget) {
        // 最初に一回だけAIに聞く
        if (player.x === 200 && player.y === 300) askAI();
    } else {
        const dx = currentTarget.x - player.x;
        const dy = currentTarget.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            player.x += dx / 40;
            player.y += dy / 40;
        } else {
            // 到着したら一定時間待機（ここで休憩）
            waitTimer = 180; // 約6秒間待機
        }
    }
}

function draw() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#333";
    for (let key in objects) {
        const obj = objects[key];
        ctx.strokeRect(obj.x - 25, obj.y - 25, 50, 50);
        ctx.fillStyle = "#333";
        ctx.fillText(obj.label, obj.x - 20, obj.y - 35);
    }

    drawStickman(player.x, player.y);
    requestAnimationFrame(draw);
}

function drawStickman(x, y) {
    ctx.beginPath();
    ctx.arc(x, y - 30, 10, 0, Math.PI * 2);
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y);
    ctx.moveTo(x, y - 15); ctx.lineTo(x - 10, y - 5);
    ctx.moveTo(x, y - 15); ctx.lineTo(x + 10, y - 5);
    ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 15);
    ctx.moveTo(x, y); ctx.lineTo(x + 10, y + 15);
    ctx.stroke();
}

draw();
