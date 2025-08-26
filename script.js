const tracks = [
    {
        title: "Sidu Sidu ",
        artist: "vijay Antony",
        src: "audio/sidu1.mp3",
        artwork: "images/sidu sidu.jpg"
    },
    {
        title: "Kanana Kanne",
        artist: "Anirudh",
        src: "audio/rowdy1.mp3",
        artwork: "images/rowdy.jpg"
    },
    {
        title: "Remo",
        artist: "Anirudh",
        src: "audio/remo1.mp3",
        artwork: "images/remo.jpg"
    }
];

let currentTrack = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const audioPlayer = document.getElementById('audioPlayer');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackArtwork = document.getElementById('trackArtwork');
const trackListContainer = document.getElementById('trackListContainer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressFill = document.getElementById('progressFill');
const progressSlider = document.getElementById('progressSlider');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle (White/Black)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('white-theme');
});

// Render playlist
function renderPlaylist() {
    trackListContainer.innerHTML = '';
    tracks.forEach((track, idx) => {
        const li = document.createElement('li');
        li.textContent = `${track.title} - ${track.artist}`;
        if (idx === currentTrack) li.classList.add('active');
        li.addEventListener('click', () => {
            loadTrack(idx);
            playTrack();
        });
        trackListContainer.appendChild(li);
    });
}

// Load track
function loadTrack(idx) {
    currentTrack = idx;
    const track = tracks[idx];
    audioPlayer.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    trackArtwork.src = track.artwork || 'default-artwork.png';
    renderPlaylist();
    resetProgress();
}

// Play/Pause
function playTrack() {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.classList.add('playing');
}
function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.classList.remove('playing');
}
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) pauseTrack();
    else playTrack();
});

// Prev/Next
prevBtn.addEventListener('click', () => {
    loadTrack((currentTrack - 1 + tracks.length) % tracks.length);
    playTrack();
});
nextBtn.addEventListener('click', () => {
    loadTrack(getNextTrackIdx());
    playTrack();
});

// Shuffle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});
function getNextTrackIdx() {
    if (isShuffle) {
        let nextIdx;
        do {
            nextIdx = Math.floor(Math.random() * tracks.length);
        } while (nextIdx === currentTrack && tracks.length > 1);
        return nextIdx;
    }
    return (currentTrack + 1) % tracks.length;
}

// Repeat
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});
audioPlayer.addEventListener('ended', () => {
    if (isRepeat) {
        playTrack();
    } else {
        loadTrack(getNextTrackIdx());
        playTrack();
    }
});

// Progress Bar
audioPlayer.addEventListener('timeupdate', () => {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = percent + '%';
    progressSlider.value = percent || 0;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    duration.textContent = formatTime(audioPlayer.duration);
});
progressSlider.addEventListener('input', () => {
    const seekTime = (progressSlider.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});
function resetProgress() {
    progressFill.style.width = '0%';
    progressSlider.value = 0;
    currentTime.textContent = '0:00';
    duration.textContent = '0:00';
}
function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Volume
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
});

// Initial load
loadTrack(0);