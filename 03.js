function showSpinner(cell) {
  cell.innerHTML = `
    <div class="spinner">
      <div></div><div></div><div></div><div></div>
      <div></div><div></div><div></div><div></div>
    </div>`;
}

function randomNumber(length) {
  let n = "";
  for (let i = 0; i < length; i++) {
    n += Math.floor(Math.random() * 10);
  }
  return n;
}

// ✅ parseTime ใหม่ → ถ้าเวลาเล็กกว่าปัจจุบัน ขยับไปวันถัดไป
function parseTime(t) {
  let [h, m, s] = t.split(":").map(Number);
  let d = new Date();
  d.setHours(h, m, s, 0);
  if (d < new Date()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function scheduleSpin(cell) {
  let startTime = cell.dataset.start;
  let stopTime = cell.dataset.stop;
  let duration = parseInt(cell.dataset.duration || 20);
  let finalNum = cell.dataset.final;
  let length = parseInt(cell.dataset.length || (finalNum ? finalNum.length : 2));

  let startDate = parseTime(startTime);
  let stopDate = parseTime(stopTime);

  function startRandom() {
    cell.innerHTML = "";
    let endTime = Date.now() + duration * 1000;
    let timer = setInterval(() => {
      let rand = randomNumber(length);
      cell.textContent = rand;

      if (Date.now() >= endTime) {
        clearInterval(timer);
        if (finalNum) {
          cell.textContent = finalNum;
        } else {
          cell.dataset.final = cell.textContent;
        }
      }
    }, 100);
  }

  let now = new Date();

  if (now < startDate) {
    cell.textContent = finalNum || "";
    setTimeout(() => {
      showSpinner(cell);
      setTimeout(startRandom, stopDate - startDate);
    }, startDate - now);
  } else if (now >= startDate && now < stopDate) {
    showSpinner(cell);
    setTimeout(startRandom, stopDate - now);
  } else if (now >= stopDate) {
    if (finalNum) {
      cell.textContent = finalNum;
    } else {
      let rand = randomNumber(length);
      cell.textContent = rand;
      cell.dataset.final = rand;
    }
  }
}

document.querySelectorAll(".spin").forEach(scheduleSpin);