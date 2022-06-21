"use strict";
const trackImage = document.querySelector(".image img");
const artist = document.querySelector(".artist");
const song = document.querySelector(".song");
const album = document.querySelector(".album");
const currentTime = document.querySelector(".current-time");
const durationTime = document.querySelector(".duration-time");
const trackSlider = document.getElementById("track-slider");
const beginBtn = document.querySelector(".begin i");
const endBtn = document.querySelector(".end i");
const previousBtn = document.querySelector(".rewind i");
const nextBtn = document.querySelector(".forward i");
const playPauseBtn = document.querySelector(".play-pause i");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const volumeSlider = document.getElementById("volume-slider");
const playlist = document.querySelector(".playlist ul");
const openBtn = document.getElementById("open");
const closeBtn = document.getElementById("close");

const playList = [
  {
    artist: "Adele",
    title: "Send My Love",
    album: "25",
    image: "./imgs/25.jpeg",
    track: "./music/sendMeLove.mp3",
  },
  {
    artist: "Demi Lovato Ft. Joe Jonas",
    title: "This Is Me",
    album: "Here We Go Again",
    image: "./imgs/here-we-go-again.png",
    track: "./music/thisIsMe.mp3",
  },
  {
    artist: "Kendrick Lamar",
    title: "All The Stars",
    album: "Black Panther",
    image: "./imgs/black-panther.jpeg",
    track: "./music/allTheStars.mp3",
  },
  {
    artist: "JB",
    title: "An Epic story",
    album: "Music Album",
    image: "./imgs/epic.jpeg",
    track: "./music/An-Epic-story.mp3",
  },
  {
    artist: "Inspirations",
    title: "Inspiring Dreams",
    album: " Inspire Music Album",
    image: "./imgs/dreams.jpeg",
    track: "./music/Inspiring-Dreams.mp3",
  },
  {
    artist: "Musica",
    title: "Powerful Emotional Trailer",
    album: "PE Music Album",
    image: "./imgs/powerful.jpeg",
    track: "./music/Powerful-Emotional-Trailer.mp3",
  },
];
let stream = document.createElement("audio");
let isPlaying = false;
let isRandom = false;
let trackIndex = 0;
let updateSliderProgress;

//Load track details(mp3,image,artist,album and title) function
let loadTrack = (trackIndex) => {
  clearInterval(updateSliderProgress);
  reset();
  stream.src = playList[trackIndex].track;
  stream.load();
  trackImage.src = playList[trackIndex].image;
  song.textContent = playList[trackIndex].title;
  artist.textContent = playList[trackIndex].artist;
  album.textContent = playList[trackIndex].album;
  updateSliderProgress = setInterval(updateProgressing, 1000);
  stream.addEventListener("ended", nextTrack);
};

let reset = () => {
  currentTime.textContent = "00:00";
  durationTime.textContent = "00:00";
  trackSlider.value = 0;
};

//Play track function
const playTrack = () => {
  stream.play();
  playPauseBtn.classList.remove("fa-play");
  playPauseBtn.classList.add("fa-pause");
  isPlaying = true;
};

//Pause track function
const pauseTrack = () => {
  stream.pause();
  playPauseBtn.classList.remove("fa-pause");
  playPauseBtn.classList.add("fa-play");
  isPlaying = false;
};

//Play previous track
const previousTrack = () => {
  trackIndex--;
  if (trackIndex < 0) trackIndex = playList.length - 1;
  loadTrack(trackIndex);
  playTrack();
};
//Play next track function
const nextTrack = () => {
  if (trackIndex < playList.length - 1 && isRandom === false) {
    trackIndex++;
  } else if (trackIndex < playList.length - 1 && isRandom === true) {
    let randomNum = Math.floor(Math.random() * playList.length);
    trackIndex = randomNum;
  } else {
    trackIndex = 0;
  }

  loadTrack(trackIndex);
  playTrack();
};
//Shuffle function
const shuffle = () => {
  isRandom = true;
  shuffleBtn.classList.add("active");
};

//No shuffle function
const noShuffle = () => {
  isRandom = false;
  shuffleBtn.classList.remove("active");
};

//Reapeat function
const repeatTrack = () => {
  stream.loop = true;
  repeatBtn.classList.add("active");
};
//No-reapeat function
const noRepeat = () => {
  stream.loop = false;
  repeatBtn.classList.remove("active");
};
//Reapeat-noRepeat track
const checkLoop = () => {
  if (!stream.loop) {
    repeatTrack();
  } else {
    noRepeat();
  }
};
//Restart track
const rewindTrack = () => {
  if (stream.currentTime < stream.duration) {
    stream.currentTime = 0;
    trackSlider.value = 0;
  }
};

//End track
const forwardTrack = () => {
  if (stream.currentTime < stream.duration) {
    stream.currentTime = stream.duration - 1;
    trackSlider.value = 99;
  }
};

//Progress track slider function
const progressSlider = () => {
  progress = stream.duration * (trackSlider.value / 100);
  stream.currentTime = progress;
};

//Update s function
const updateProgressing = () => {
  let startPoint = 0;
  startPoint = stream.currentTime * (100 / stream.duration);
  trackSlider.value = startPoint;
  // Calculate the time left and the total duration
  let currentMinutes = Math.floor(stream.currentTime / 60);
  let currentSeconds = Math.floor(stream.currentTime % 60);
  let durationMinutes = Math.floor(stream.duration / 60);
  let durationSeconds = Math.floor(stream.duration % 60);

  // Adding a zero to the single digit time values
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }
  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }
  if (durationMinutes < 10) {
    durationMinutes = "0" + durationMinutes;
  }

  currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
  durationTime.textContent = `${durationMinutes}:${durationSeconds}`;
};

//Update volume slider
const updateVolume = () => {
  stream.volume = volumeSlider.value / 100;
};

/* Insert tracks and their details into playList side */
for (let i = 0; i < playList.length; i++) {
  let liTag = `<li>
  <div class="t-image">
  <img src=${playList[i].image}>
  </div>
  <div class="t-title">
  <h3>${playList[i].title}</h3>
  </div>
  <div class="t-artist">
  <h3>${playList[i].artist}</h3>
  </div>
  </li>`;
  playlist.insertAdjacentHTML("beforeend", liTag);
}
//List of EventListeners
playPauseBtn.addEventListener("click", () => {
  !isPlaying ? playTrack() : pauseTrack();
});
previousBtn.addEventListener("click", previousTrack);
nextBtn.addEventListener("click", nextTrack);
volumeSlider.addEventListener("change", updateVolume);
trackSlider.addEventListener("change", progressSlider);
beginBtn.addEventListener("click", rewindTrack);
endBtn.addEventListener("click", forwardTrack);
repeatBtn.addEventListener("click", checkLoop);
shuffleBtn.addEventListener("click", () => {
  !isRandom ? shuffle() : noShuffle();
});
//open and close tracklist events
openBtn.addEventListener("click", () => {
  openBtn.style.display = "none";
  closeBtn.style.display = "block";
  document.querySelector(".playlist").style.left = "36.4rem";
});
closeBtn.addEventListener("click", () => {
  openBtn.style.display = "block";
  closeBtn.style.display = "none";
  document.querySelector(".playlist").style.left = "15rem";
});

//Call load function
loadTrack(trackIndex);
