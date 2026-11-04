
let soundscape = document.getElementById("soundscape");
let sceneImage = document.getElementById("sceneImage");
let sceneLabel = document.getElementById("sceneLabel");
let sceneTitle = document.getElementById("sceneTitle");
let sceneDescription = document.getElementById("sceneDescription");
let playbackStatus = document.getElementById("playbackStatus");
let restartButton = document.getElementById("restartButton");
let motionButton = document.getElementById("motionButton");
let sceneButtons = document.getElementsByClassName("scene-button");


let imageFiles = [
  "images/morning.jpg",
  "images/streets.jpg",
  "images/evening.jpg"
];

let imageDescriptions = [
  "Morning in a Lahore garden",
  "A busy street in Lahore",
  "An outdoor scene in Lahore during the evening"
];

let sceneLabels = [
  "SCENE 1 — MORNING",
  "SCENE 2 — BUSY STREETS",
  "SCENE 3 — EVENING"
];

let sceneTitles = [
  "Before the Rush",
  "Lahore’s Busy Streets",
  "When the City Slows"
];

let sceneDescriptions = [
  "Birds sing and a gentle breeze moves through the trees as the city begins to wake.",

  "The sound of traffic fills the streets as people move through their day.",

  "Crickets and frogs create a peaceful atmosphere in a greener, quieter part of the city."
];

let sceneThemes = [
  "morning",
  "streets",
  "evening"
];

let startTimes = [0, 25, 50];
let currentScene = -1;
let pendingScene = null;
let motionOff = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
function showScene(index) {
  if (currentScene === index) {
    return;
  }
  currentScene = index;
  sceneImage.src = imageFiles[index];
  sceneImage.alt = imageDescriptions[index];
  sceneLabel.textContent = sceneLabels[index];
  sceneTitle.textContent = sceneTitles[index];
  sceneDescription.textContent = sceneDescriptions[index];
  for (let i = 0; i < sceneButtons.length; i++) {
    document.body.classList.remove(sceneThemes[i]);
    sceneButtons[i].classList.remove("active");
    sceneButtons[i].setAttribute("aria-pressed", "false");
  }
  document.body.classList.add(sceneThemes[index]);
  sceneButtons[index].classList.add("active");
  sceneButtons[index].setAttribute("aria-pressed", "true");
}

function updateSceneFromTime() {
  if (soundscape.currentTime < 25) {
    showScene(0);
  } else if (soundscape.currentTime < 50) {
    showScene(1);
  } else {
    showScene(2);
  }
}

function playSoundscape() {
  let playRequest = soundscape.play();
  if (playRequest !== undefined) {
    playRequest.catch(function () {
      playbackStatus.textContent =
        "Press play on the audio player. If playback fails, check the audio file.";
    });
  }
}

function jumpToScene(index) {
  if (soundscape.readyState === 0) {
    pendingScene = index;
    playbackStatus.textContent = "Loading the soundscape…";
    if (soundscape.networkState === 0 || soundscape.error) {
      soundscape.load();
    }

    return;
  }

  soundscape.currentTime = startTimes[index];

  showScene(index);
  playSoundscape();
}
soundscape.addEventListener("loadedmetadata", function () {
  if (pendingScene !== null) {
    let selectedScene = pendingScene;
    pendingScene = null;

    jumpToScene(selectedScene);
  }
});
for (let i = 0; i < sceneButtons.length; i++) {
  sceneButtons[i].addEventListener("click", function () {
    jumpToScene(i);
  });
}
soundscape.addEventListener(
  "timeupdate",
  updateSceneFromTime
);

soundscape.addEventListener(
  "seeked",
  updateSceneFromTime
);
// Animate the photo when the audio is playing.
soundscape.addEventListener("playing", function () {
  document.body.classList.add("playing");

  playbackStatus.textContent =
    "Playing your walk through Lahore.";
});
// Stop animation when the audio pauses.
soundscape.addEventListener("pause", function () {
  document.body.classList.remove("playing");

  if (soundscape.ended === false) {
    playbackStatus.textContent =
      "Paused. Press play to continue.";
  }
});
// Stop animation while audio is buffering.
soundscape.addEventListener("waiting", function () {
  document.body.classList.remove("playing");
  playbackStatus.textContent = "Loading audio…";
});

// Show a completion message.

soundscape.addEventListener("ended", function () {
  document.body.classList.remove("playing");

  playbackStatus.textContent =
    "Your walk is complete. Restart or choose a scene to listen again.";
});


// Handle a missing or unreadable audio file.

soundscape.addEventListener("error", function () {
  document.body.classList.remove("playing");

  playbackStatus.textContent =
    "Audio could not load. Check that lahore-soundscape.mp3 is inside the audio folder.";
});


// Restart from the morning scene.

restartButton.addEventListener("click", function () {
  jumpToScene(0);
});


// Update the motion setting and button label.

function updateMotion() {
  if (motionOff === true) {
    document.body.classList.add("motion-off");

    motionButton.textContent = "Turn Motion On";
    motionButton.setAttribute("aria-pressed", "true");

  } else {
    document.body.classList.remove("motion-off");

    motionButton.textContent = "Turn Motion Off";
    motionButton.setAttribute("aria-pressed", "false");
  }
}


// Toggle motion when the button is clicked.

motionButton.addEventListener("click", function () {
  motionOff = !motionOff;
  updateMotion();
});


// Set the initial scene and motion preference.

showScene(0);
updateMotion();