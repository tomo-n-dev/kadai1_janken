$(function () {

    // ======== 変数の準備 ============
    const goal = 20;       // ゴールのマス番号
    let playerPos = 0;     // プレイヤーの現在地
    let cpuPos = 0;        // CPUの現在地

    // ======== 盤面を作る ============
    for (let i = 0; i < goal; i++) {
        $("#board").append(`<div class="cell" id="cell-${i}">${i}</div>`);
    }

    // ======== 位置の描画 ============
    function renderPositions() {
        $(".player, .cpu").remove(); // 一度全て消す

        // プレイヤーアイコンを置く
        $(`#cell-${playerPos}`).append(`<div class="player"></div>`);

        // CPUアイコンを置く
        $(`#cell-${cpuPos}`).append(`<div class="cpu"></div>`);

        // 位置表示テキスト更新
        $("#playerPos").text(playerPos);
        $("#cpuPos").text(cpuPos);
    }

    renderPositions();

    // ゲームを最初の状態に戻す関数
    function resetGame() {
        playerPos = 0;
        cpuPos = 0;
        $("#result").text("");
        $("#winner").text("");
        renderPositions();
    }

    // ======== ジャンケン判定 ============
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

    // ======== ボタンクリック ========
    $(".jbtn").on("click", function () {

        $("#winner").text(""); // 勝敗メッセージ消去

        const playerHand = Number($(this).data("hand"));
        const cpuHand = [0, 2, 5][Math.floor(Math.random() * 3)];

        const handText = { 0: "グー", 2: "チョキ", 5: "パー" };

        const result = judge(playerHand, cpuHand);

        // 結果を表示
        $("#result").text(
            `あなた: ${handText[playerHand]} / CPU: ${handText[cpuHand]} → `
            + (result === "draw" ? "あいこ！" :
                result === "player" ? "あなたの勝ち！" :
                    "CPUの勝ち！")
        );

        // 進む処理
        if (result === "player") {
            playerPos += playerHand;
        } else if (result === "cpu") {
            cpuPos += cpuHand;
        }

        // ゴール到達チェック
        if (playerPos >= goal - 1) {
            playerPos = goal - 1;
            renderPositions();
            $("#winner").text("🎉 あなたの勝ち！");
            return;
        }

        if (cpuPos >= goal - 1) {
            cpuPos = goal - 1;
            renderPositions();
            $("#winner").text("💀 CPUの勝ち…");
            return;
        }


        renderPositions();

        $("#resetBtn").on("click", resetGame);

    });
});
