// I used a bit of info from AI here to maked my file responsive

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const status = document.getElementById("status");
const lights = Array.from(document.querySelectorAll(".light"));

const COLORS = ["red", "yellow", "green"];
let currentColor = null;
let timerId = null;

// Update the UI so the given color appears lit (and the others dimmed).
// Also updates the status text and stores the current state.
function setLight(color) {
  lights.forEach((light) => {
    const isActive = light.dataset.color === color;
    light.classList.toggle("active", isActive);
    light.setAttribute("aria-label", `${light.dataset.color} light ${isActive ? "on" : "off"}`);
  });

  currentColor = color;
  status.textContent = `Current: ${color.toUpperCase()}`;
}

// Pick a random next color, ensuring it is not the same as the current one.
function randomNextColor() {
  const available = COLORS.filter((c) => c !== currentColor);
  return available[Math.floor(Math.random() * available.length)];
}

// Schedule the next color change after a fixed interval.
// This creates a loop via recursive setTimeout calls so we can stop it cleanly.
function scheduleNextChange() {
  timerId = window.setTimeout(() => {
    const next = randomNextColor();
    setLight(next);
    scheduleNextChange();
  }, 3000);
}

// Enable/disable buttons to reflect whether the simulation is running.
function setControls(running) {
  startBtn.disabled = running;
  stopBtn.disabled = !running;
}

// Starts the cycling simulation and disables the Start button.
function startSimulation() {
  if (timerId) return;

  setControls(true);
  status.textContent = "Running...";

  if (!currentColor) {
    // Start with a random initial light.
    setLight(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }

  scheduleNextChange();
}

// Stops the cycling simulation and re-enables the Start button.
function stopSimulation() {
  if (!timerId) return;

  window.clearTimeout(timerId);
  timerId = null;
  setControls(false);
  status.textContent = "Simulation stopped. Press Start to run again.";
}

startBtn.addEventListener("click", startSimulation);
stopBtn.addEventListener("click", stopSimulation);

// Make it accessible: allow Enter / Space to activate the buttons.
[startBtn, stopBtn].forEach((btn) => {
  btn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      btn.click();
    }
  });
});

// Initialize initial state.
setLight("red");
setControls(false);
