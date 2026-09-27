const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

let running = true;
let lastTime = performance.now();
let t = 0;

const params = {
  A: 1,
  B: 1,
};

const state = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function reset() {
  t = 0;

  state.x = canvas.clientWidth / 2;
  state.y = canvas.clientHeight / 2;
  state.vx = 0;
  state.vy = 0;

  updateReadout();
}

function update(dt) {
  // Physics goes here later.
  // For now, a simple placeholder motion.
  t += dt;

  state.x += state.vx * dt;
  state.y += state.vy * dt;

  // Temporary example: move in a circle
  const R = 80 * params.A;
  state.x = canvas.clientWidth / 2 + R * Math.cos(t * params.B);
  state.y = canvas.clientHeight / 2 + R * Math.sin(t * params.B);
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  // Draw axes or grid later if needed
  ctx.strokeStyle = "#2a2f3a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  // Draw object
  ctx.beginPath();
  ctx.arc(state.x, state.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#6ea8fe";
  ctx.fill();

  updateReadout();
}

function updateReadout() {
  document.getElementById("readout").innerHTML = `
    t = ${t.toFixed(2)} s<br>
    x = ${state.x.toFixed(1)} px<br>
    y = ${state.y.toFixed(1)} px<br>
    A = ${params.A.toFixed(2)}<br>
    B = ${params.B.toFixed(2)}
  `;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (running) {
    update(dt);
  }

  draw();
  requestAnimationFrame(loop);
}

// Controls
document.getElementById("playPause").addEventListener("click", (e) => {
  running = !running;
  e.target.textContent = running ? "Pause" : "Play";
});

document.getElementById("reset").addEventListener("click", reset);

document.getElementById("paramA").addEventListener("input", (e) => {
  params.A = parseFloat(e.target.value);
  document.getElementById("paramAValue").textContent = params.A.toFixed(1);
});

document.getElementById("paramB").addEventListener("input", (e) => {
  params.B = parseFloat(e.target.value);
  document.getElementById("paramBValue").textContent = params.B.toFixed(1);
});

// Init
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
reset();
requestAnimationFrame(loop);
