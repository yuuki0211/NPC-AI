const canvas = document.getElementById('roomCanvas');
const ctx = canvas.getContext('2d');

// キャンバスのサイズ設定
canvas.width = 400;
canvas.height = 600;

// 家具の配置（座標データ）
const objects = {
    bed: { x: 50, y: 500, label: "ベッド" },
    desk: { x: 300, y: 300, label: "机と椅子" },
    chest: { x: 50, y: 300, label: "チェスト" }
};

// 棒人間の初期位置
let player = { x: 200, y: 300 };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 家具を描く（図の位置を再現）
    ctx.strokeStyle = "#333";
    for (let key in objects) {
        const obj = objects[key];
        ctx.strokeRect(obj.x - 20, obj.y - 20, 40, 40);
        ctx.fillText(obj.label, obj.x - 20, obj.y - 30);
    }

    // 棒人間を描く
    drawStickman(player.x, player.y);
}

function drawStickman(x, y) {
    ctx.beginPath();
    ctx.arc(x, y - 30, 10, 0, Math.PI * 2); // 頭
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y); // 体
    ctx.moveTo(x, y - 15); ctx.lineTo(x - 10, y - 5); // 左腕
    ctx.moveTo(x, y - 15); ctx.lineTo(x + 10, y - 5); // 右腕
    ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 15); // 左足
    ctx.moveTo(x, y); ctx.lineTo(x + 10, y + 15); // 右足
    ctx.stroke();
}

// 1秒ごとに描画更新
setInterval(draw, 100);

// テスト用：画面をタップするとその場所に移動
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    player.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
