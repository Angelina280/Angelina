const markerIds = [1, 2, 3, 4, 5];
const collected = new Set();
let timeLeft = 120;
let timerInterval;
let focusTimeout = null;
let currentMarker = null;

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");

  markerIds.forEach(id => {
    const marker = document.createElement("a-marker");
    marker.setAttribute("type", "pattern");
    marker.setAttribute("url", `Marker${id}.patt`);
    marker.setAttribute("id", `marker-${id}`);

    const coin = document.createElement("a-cylinder");
    coin.setAttribute("position", "0 0.2 0");
    coin.setAttribute("radius", "0.1");
    coin.setAttribute("height", "0.02");
    coin.setAttribute("color", "#FFD700");
    marker.appendChild(coin);

marker.addEventListener("markerFound", () => {
  if (!collected.has(id) && !focusTimeout) {
    currentMarker = id;
    startFocusTimer(id);
  }
      showSparkle(marker);
    });
  
    marker.addEventListener("markerLost", () => {
      if (currentMarker === id) {
        cancelFocusTimer();
      }
    });

    scene.appendChild(marker);
  });

  // Starte den 60-Sekunden-Timer
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
});

function startFocusTimer(id) {
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");

  let progress = 0;
  progressBar.style.visibility = "visible";

  focusTimeout = setInterval(() => {
    progress += 5;
    progressFill.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(focusTimeout);
      focusTimeout = null;
      progressBar.style.visibility = "hidden";
      progressFill.style.width = `0%`;

      collected.add(id);
      updateHUD();

      if (collected.size === 5) {
        endGame(true);
      }
    }
  }, 200); // 20 x 200ms = 4000ms (4 Sekunden)
}

function cancelFocusTimer() {
  if (focusTimeout) {
    clearInterval(focusTimeout);
    focusTimeout = null;
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("progressBar").style.visibility = "hidden";
  }
}

function updateHUD() {
  document.getElementById("coins").textContent = `${collected.size}`;
}

function rainCoins() {
  const rainContainer = document.createElement("div");
  rainContainer.id = "coin-rain";
  document.body.appendChild(rainContainer);

  for (let i = 0; i < 100; i++) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.style.left = Math.random() * 100 + "vw";
    coin.style.animationDelay = Math.random() * 1.5 + "s";
    rainContainer.appendChild(coin);
  }

  setTimeout(() => {
    rainContainer.remove();
  }, 4000);
}

function showSparkle(marker) {
  const numParticles = 16;
  const duration = 2200;

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("a-entity");
    particle.setAttribute("geometry", "primitive: sphere; radius: 0.07"); // noch größer für Test
    particle.setAttribute("material", "color: #fff; opacity: 0.95; emissive: #fff; emissiveIntensity: 1");
    particle.setAttribute("position", "0 0.3 0");

    const angle = (2 * Math.PI * i) / numParticles;
    const distance = 0.22 + Math.random() * 0.12;
    const x = Math.cos(angle) * distance;
    const y = 0.3 + (Math.random() - 0.5) * 0.09;
    const z = Math.sin(angle) * distance;

    marker.appendChild(particle);
    setTimeout(() => {
      particle.setAttribute("animation__move",
        `property: position; to: ${x} ${y} ${z}; dur: ${duration}; easing: ease-out`
      );
      particle.setAttribute("animation__fade",
        `property: material.opacity; to: 0; dur: ${duration + 800}; easing: linear`
      );
    }, 50);

    setTimeout(() => {
      particle.parentNode && particle.parentNode.removeChild(particle);
    }, duration + 1200);
  }
}
