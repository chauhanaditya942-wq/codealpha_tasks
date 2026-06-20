const playlist = [
  {
    title: 'Stellar Drift',
    artist: 'Cosmic Waves',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Neon Pulse',
    artist: 'Synthwave Runner',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'Midnight Echo',
    artist: 'Lo-Fi Astronaut',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    title: 'Crystal Rain',
    artist: 'Ambient Flow',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    title: 'Ultraviolet',
    artist: 'Digital Horizon',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

let currentIndex = 0;
let isPlaying = false;
let autoplayOn = false;

const audio = new Audio();
audio.volume = 0.7;

const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const playlistContainer = document.getElementById('playlist');
const playlistToggle = document.getElementById('playlistToggle');
const autoplayCheckbox = document.getElementById('autoplayCheckbox');
const equalizer = document.getElementById('equalizer');

function loadSong(index) {
  const song = playlist[index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audio.load();
  updatePlaylistActive();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.querySelector('svg').innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  albumArt.classList.add('playing');
  equalizer.classList.add('active');
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.querySelector('svg').innerHTML = '<path d="M8 5v14l11-7z"/>';
  albumArt.classList.remove('playing');
  equalizer.classList.remove('active');
}

function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateProgress() {
  const { currentTime, duration } = audio;
  if (duration) {
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
  }
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

function updateVolume() {
  audio.volume = volumeSlider.value;
  muteBtn.querySelector('svg').innerHTML = audio.volume === 0
    ? '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'
    : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
}

function toggleMute() {
  if (audio.volume > 0) {
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = 0.7;
    volumeSlider.value = 0.7;
  }
  updateVolume();
}

function renderPlaylist() {
  playlistContainer.innerHTML = '';
  playlist.forEach((song, idx) => {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    item.innerHTML = `<span>${song.title}</span><span style="opacity:0.6;font-size:0.75rem">${song.artist}</span>`;
    item.addEventListener('click', () => {
      if (currentIndex !== idx) {
        currentIndex = idx;
        loadSong(currentIndex);
        playSong();
      } else {
        if (isPlaying) pauseSong(); else playSong();
      }
    });
    playlistContainer.appendChild(item);
  });
}

function updatePlaylistActive() {
  document.querySelectorAll('.playlist-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === currentIndex);
  });
}

// Event listeners
playBtn.addEventListener('click', () => {
  if (isPlaying) pauseSong();
  else playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
progressBar.addEventListener('click', setProgress);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('ended', () => {
  if (autoplayOn) nextSong();
  else pauseSong();
});

volumeSlider.addEventListener('input', updateVolume);
muteBtn.addEventListener('click', toggleMute);

playlistToggle.addEventListener('click', () => {
  playlistContainer.classList.toggle('visible');
});

autoplayCheckbox.addEventListener('change', (e) => {
  autoplayOn = e.target.checked;
});

// Initialize
renderPlaylist();
loadSong(currentIndex);