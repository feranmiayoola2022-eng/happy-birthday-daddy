/* ==========================================
   CINEMATIC INTRODUCTORY SEQUENCE
   ================================---------- */
document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const line1 = document.getElementById('intro-line-1');
    const line2 = document.getElementById('intro-line-2');
    const line3 = document.getElementById('intro-line-3');
    const skipBtn = document.getElementById('skip-intro-btn');

    let introFinished = false;

    function finishIntro() {
        if (introFinished) return;
        introFinished = true;
        introOverlay.classList.add('fade-out');
        // Initial entrance confetti
        triggerConfettiBurst();
    }

    // Sequence timing
    setTimeout(() => { line1.classList.add('visible'); }, 500);
    setTimeout(() => { line1.classList.add('hidden'); line2.classList.remove('hidden'); line2.classList.add('visible'); }, 3500);
    setTimeout(() => { line2.classList.add('hidden'); line3.classList.remove('hidden'); line3.classList.add('visible'); }, 6500);
    setTimeout(() => { finishIntro(); }, 9500);

    skipBtn.addEventListener('click', finishIntro);
});

/* ==========================================
   CONFETTI UTILITY
   ================================---------- */
function triggerConfettiBurst() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#f3e5ab', '#ffffff', '#aa8c2c']
        });
    }
}

/* ==========================================
   MOBILE NAVIGATION TOGGLE
   ================================---------- */
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

/* ==========================================
   WEB AUDIO API BIRTHDAY SONG SYNTHESIZER
   ================================---------- */
let audioCtx = null;
let isPlayingMelody = false;
let melodyInterval = null;

const audioToggleBtn = document.getElementById('audio-toggle-btn');
const audioLabel = document.getElementById('audio-label');

// Simple pleasant birthday notes sequence frequencies
const notes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy Birthday to you
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy Birthday to you
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy Birthday dear Daddy
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy Birthday to you
];

function playTone(frequency, duration) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error("Audio playback error:", e);
    }
}

function startBirthdayMelody() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isPlayingMelody = true;
    audioLabel.textContent = 'Pause Song';
    audioToggleBtn.classList.add('active');

    let noteIndex = 0;
    melodyInterval = setInterval(() => {
        playTone(notes[noteIndex], 0.4);
        noteIndex = (noteIndex + 1) % notes.length;
    }, 450);
}

function stopBirthdayMelody() {
    isPlayingMelody = false;
    audioLabel.textContent = 'Play Birthday Song';
    audioToggleBtn.classList.remove('active');
    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
        if (!isPlayingMelody) {
            startBirthdayMelody();
        } else {
            stopBirthdayMelody();
        }
    });
}

/* ==========================================
   ACCESSIBILITY: FONT SIZE ADJUSTER
   ================================---------- */
const fontSizeBtn = document.getElementById('font-size-btn');
let isLargeFont = false;

if (fontSizeBtn) {
    fontSizeBtn.addEventListener('click', () => {
        isLargeFont = !isLargeFont;
        if (isLargeFont) {
            document.documentElement.style.setProperty('--base-font-size', '18px');
            fontSizeBtn.textContent = 'A-';
            fontSizeBtn.title = 'Reset Text Size';
        } else {
            document.documentElement.style.setProperty('--base-font-size', '16px');
            fontSizeBtn.textContent = 'A+';
            fontSizeBtn.title = 'Make Text Larger';
        }
    });
}

/* ==========================================
   LIVE BIRTHDAY COUNTDOWN TIMER
   ================================---------- */
function updateCountdown() {
    // Set target to September 23 (or adjust to Daddy's exact birth date)
    const now = new Date();
    let targetYear = now.getFullYear();
    let birthday = new Date(targetYear, 8, 23); // September 23

    if (now > birthday) {
        birthday = new Date(targetYear + 1, 8, 23);
    }

    const diff = birthday - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownHeader = document.getElementById('countdownHeader');
    const countdownTimer = document.getElementById('countdownTimer');

    if (diff <= 0) {
        countdownHeader.textContent = "TODAY, WE CELEBRATE YOU, DADDY!";
        countdownTimer.innerHTML = "<div style='font-size: 1.3rem; color: var(--gold-light); font-family: var(--font-heading); width: 100%;'>Happy Birthday to Associate Professor Dr. Elder Ayoola Isiah Adesoye! 🎉</div>";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ==========================================
   CINEMATIC SURPRISE MODAL INTERACTION
   ================================---------- */
const triggerSurpriseBtn = document.getElementById('triggerSurpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeSurpriseModal = document.getElementById('closeSurpriseModal');

if (triggerSurpriseBtn) {
    triggerSurpriseBtn.addEventListener('click', () => {
        surpriseModal.classList.add('active');
        triggerConfettiBurst();
        // Trigger extra celebratory burst
        setTimeout(triggerConfettiBurst, 400);
    });
}

if (closeSurpriseModal) {
    closeSurpriseModal.addEventListener('click', () => {
        surpriseModal.classList.remove('active');
    });
}

// Close modal when clicking backdrop
if (surpriseModal) {
    surpriseModal.addEventListener('click', (e) => {
        if (e.target === surpriseModal || e.target.classList.contains('surprise-backdrop')) {
            surpriseModal.classList.remove('active');
        }
    });
}

/* ==========================================
   LIGHTBOX GALLERY VIEWER
   ================================---------- */
function openLightbox(element) {
    const img = element.querySelector('img');
    const caption = element.querySelector('.gallery-caption span').textContent;

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
}

function closeLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal) {
        lightboxModal.classList.remove('active');
    }
}