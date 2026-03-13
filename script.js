const canvas = document.getElementById('roomCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

// 家具の配置
const objects = {
    bed: { x: 70, y: 530, label: "ベッド" },
    desk: { x: 330, y: 300, label: "机と椅子" },
    chest: { x: 70, y: 300, label: "チェスト" }
};

// ルナの状態
let player = { x: 200, y: 300 };
let currentTarget = null;
let waitTimer = 0;

function update() {
    if (waitTimer > 0) {
        waitTimer--;
        return;
    }

    if (!currentTarget) {
        // 目的地がない場合、ランダムで次の場所を決める
        const keys = Object.keys(objects);
        const nextKey = keys[Math.floor(Math.random() * keys.length)];
        currentTarget = objects[nextKey];
        document.getElementById('status').innerText = `ルナ: ${currentTarget.label}へ移動中...`;
    } else {
        // 目的地へ向かう計算
        const dx = currentTarget.x - player.x;
        const dy = currentTarget.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            // スピード調整（数値を大きくすると遅くなる）
            player.x += dx / 30;
            player.y += dy / 30;
        } else {
            // 到着！
            document.getElementById('status').innerText = `ルナ: ${currentTarget.label}で作業中...`;
            currentTarget = null;
            waitTimer = 60; // 到着後、約2秒間その場で待機（60フレーム）
        }
    }
}

function draw() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 家具の描画
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    for (let key in objects) {
        const obj = objects[key];
        ctx.strokeRect(obj.x - 25, obj.y - 25, 50, 50);
        ctx.fillStyle = "#333";
        ctx.fillText(obj.label, obj.x - 20, obj.y - 35);
    }

    // 棒人間の描画
    drawStickman(player.x, player.y);
    requestAnimationFrame(draw); // 滑らかに動かすための命令
}

function drawStickman(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.arc(x, y - 30, 10, 0, Math.PI * 2); // 頭
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y); // 体
    ctx.moveTo(x, y - 15); ctx.lineTo(x - 10, y - 5); // 左腕
    ctx.moveTo(x, y - 15); ctx.lineTo(x + 10, y - 5); // 右腕
    ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 15); // 左足
    ctx.moveTo(x, y); ctx.lineTo(x + 10, y + 15); // 右足
    ctx.stroke();
}

// 起動！
draw();
