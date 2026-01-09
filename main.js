const { fork } = require("child_process");

let accProcess = null;

function startAcc() {
  accProcess = fork("./acc.js");
  setTimeout(() => {
    stopAcc();
  }, 6 * 60 * 60 * 1000);
}

function stopAcc() {
  if (accProcess) {
    accProcess.kill();
    accProcess = null;
    setTimeout(() => {
      startAcc();
    }, 10 * 1000);
  }
}

startAcc();
