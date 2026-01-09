const { fork } = require("child_process");

let accProcess = null;

// Hàm bật acc.js
function startAcc() {
  console.log("▶️ Bật acc.js");
  accProcess = fork("./acc.js");

  // Sau 6 tiếng thì tắt
  setTimeout(() => {
    stopAcc();
  }, 6 * 60 * 60 * 1000); // 6 tiếng
}

// Hàm tắt acc.js
function stopAcc() {
  if (accProcess) {
    console.log("⛔ Tắt acc.js");
    accProcess.kill();
    accProcess = null;

    // Sau 10s bật lại
    setTimeout(() => {
      startAcc();
    }, 10 * 1000);
  }
}

// Bắt đầu lần đầu
startAcc();
