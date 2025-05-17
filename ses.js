const progressCircle = document.querySelector('.progress');
const breathLabel = document.getElementById('breath-label');
const timerEl = document.getElementById('timer');
const circleLength = 2 * Math.PI * 100;

function getSessionDuration() {
  const params = new URLSearchParams(window.location.search);
  const min = parseInt(params.get('duration'), 10) || 0;
  const sec = parseInt(params.get('seconds'), 10) || 0;
  return (min * 60 + sec) * 1000; // ms
}

const sessionDuration = getSessionDuration();
let sessionStart = null;

const phaseLabels = ["Inhale", "Hold", "Exhale", "Hold"];
let phaseDurations = [];
let phases = [];
let phaseIndex = 0;
let startTime = null;
let lastInhaleOffset = circleLength;
let lastExhaleOffset = 0;

function setupPhases() {
  const numPhases = phaseLabels.length;
  const minPhaseDuration = 2000;
  let cycles = Math.floor(sessionDuration / (numPhases * minPhaseDuration));
  if (cycles < 1) cycles = 1;
  const phaseDuration = Math.floor(sessionDuration / (cycles * numPhases));
  phases = [];
  for (let i = 0; i < cycles; i++) {
    for (let label of phaseLabels) {
      phases.push({ label, duration: phaseDuration });
    }
  }
}
setupPhases();

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const sec = String(totalSeconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function animatePhase(timestamp) {
  if (!sessionStart) sessionStart = timestamp;
  if (!startTime) startTime = timestamp;
  const phase = phases[phaseIndex];
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / phase.duration, 1);
  const timeLeft = sessionDuration - (timestamp - sessionStart);
  timerEl.textContent = formatTime(timeLeft);
  if (phase.label === "Inhale") {
    progressCircle.style.strokeDashoffset = circleLength * (1 - progress);
    lastInhaleOffset = circleLength * (1 - progress);
  } else if (phase.label === "Exhale") {
    progressCircle.style.strokeDashoffset = circleLength * progress;
    lastExhaleOffset = circleLength * progress;
  } else if (phase.label === "Hold") {
    if (phases[(phaseIndex - 1 + phases.length) % phases.length].label === "Inhale") {
      progressCircle.style.strokeDashoffset = lastInhaleOffset;
    } else {
      progressCircle.style.strokeDashoffset = lastExhaleOffset;
    }
  }

  if (timestamp - sessionStart >= sessionDuration || phaseIndex >= phases.length - 1) {
    breathLabel.textContent = "WELL DONE";
    timerEl.textContent = "00:00";
    return;
  }

  if (elapsed < phase.duration) {
    requestAnimationFrame(animatePhase);
  } else {
    phaseIndex = (phaseIndex + 1) % phases.length;
    breathLabel.textContent = phases[phaseIndex].label;
    startTime = null;
    requestAnimationFrame(animatePhase);
  }
}

progressCircle.style.strokeDasharray = circleLength;
progressCircle.style.strokeDashoffset = circleLength;
breathLabel.textContent = phases[0].label;
requestAnimationFrame(animatePhase);