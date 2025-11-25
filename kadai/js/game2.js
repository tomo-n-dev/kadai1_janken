$(function () {

    const goal = 20;
    let playerPos = 0;
    let cpuPos = 0;
    let confettiCount = 0;
    let lastPlayerHand = null;
    let sameHandCount = 0;



    // ======= 盤面生成 =======
    for (let i = 0; i < goal; i++) {
        $("#board").append(`<div class="cell" id="cell-${i}">${i}</div>`);
    }

    // ======= 位置表示 =======
    function renderPositions() {
        $(".player, .cpu").remove();

        $(`#cell-${playerPos}`).append(`<img src="img/player.png" class="player">`);
        $(`#cell-${cpuPos}`).append(`<img src="img/cpu.png" class="cpu">`);

        $("#playerPos").text(playerPos);
        $("#cpuPos").text(cpuPos);
    }
    renderPositions();

    // ======= リセット =======
    function resetGame() {
        confettiCount = 5; // ← 次のループで止まる
        playerPos = 0;
        cpuPos = 0;
        $("#result").text("");
        $("#winner").text("");
        renderPositions();
    }

    $("#resetBtn").on("click", resetGame);

    // ======= 判定 =======
    function judge(playerHand, cpuHand) {
        if (playerHand === cpuHand) return "draw";
        if (
            (playerHand === 0 && cpuHand === 2) ||
            (playerHand === 2 && cpuHand === 5) ||
            (playerHand === 5 && cpuHand === 0)
        ) {
            return "player";
        }
        return "cpu";
    }
    // ======= クラッカー =======
    function confettiAnime() {
        if (confettiCount >= 5) return;  // ← 5回鳴らしたら終了

        confetti({
            origin: { x: Math.random(), y: 0.8 },
            particleCount: 100,
            spread: 70,
            zIndex: -1
        });

        confettiCount++;  // ← 回数カウント
        setTimeout(confettiAnime, 2000);  // ← 2秒後にまた鳴らす
    }

    // ======= ボタン処理 =======
    $(".jbtn").on("click", function () {

        $("#winner").text("");

        const playerHand = Number($(this).data("hand"));
        // プレイヤーの手を見て連打回数を更新
        if (playerHand === lastPlayerHand) {
            sameHandCount++;
        } else {
            sameHandCount = 1;
            lastPlayerHand = playerHand;
        }
        let cpuHand;

        // 同じ手を3回以上出したら学習モード
        if (sameHandCount >= 3) {
            // プレイヤーの手を倒せる手を出す（じゃんけんに勝てる手）
            const winHand = { 0: 5, 2: 0, 5: 2 };
            cpuHand = winHand[playerHand];


        } else {
            // 通常ランダム
            cpuHand = [0, 2, 5][Math.floor(Math.random() * 3)];
        }


        const handText = { 0: "グー", 2: "チョキ", 5: "パー" };

        const result = judge(playerHand, cpuHand);

        $("#result").text(
            `あなた: ${handText[playerHand]} / CPU: ${handText[cpuHand]} → ` +
            (result === "draw" ? "あいこ！" :
                result === "player" ? "あなたの勝ち！" : "CPUの勝ち！")
        );
        // ===== 学習表示 =====
        if (sameHandCount >= 3) {
            $("#result").append(`<span class="learn">（その手は通用しない！）</span>`);
        }

        // ----- 進む -----
        if (result === "player") playerPos += playerHand;
        if (result === "cpu") cpuPos += cpuHand;

        // ----- ゴール判定 -----
        if (playerPos >= goal - 1) {
            playerPos = goal - 1;
            renderPositions();
            $("#winner").text("🎉 あなたの勝ち！");

            confettiCount = 0;   // ← カウントを0にする
            confettiAnime();      // ← クラッカー開始
            return;
        }
        if (cpuPos >= goal - 1) {
            cpuPos = goal - 1;
            renderPositions();
            $("#winner").text("💀 CPUの勝ち…");
            return;
        }

        renderPositions();
    });

});
