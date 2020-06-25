// Notes of the C major scale
const NOTES = {
  ' ': 0,
  'a': 880,
  'b': 988,
  'c': 523,
  'd': 587,
  'e': 659,
  'f': 698,
  'g': 783,
}

const MELODY = [NOTES.c, NOTES.g, NOTES.e, NOTES.c];

// for Safari compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;

// what to do when clicking "Play"
document.getElementById('playButton').addEventListener('click', () => {
  playFrequencies(MELODY);
});

async function playFrequencies(frequencies) {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'triangle';
  oscillator.connect(ctx.destination);

  oscillator.start();

  frequencies = frequencies.slice(); // clone, since we'll shift()
  while (frequencies.length) {
    const freq = frequencies.shift();
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    await tick();
  }

  oscillator.stop();
  ctx.close();
}

function tick() {
  // pause for 300 milliseconds
  return new Promise(res => setTimeout(res, 300));
}
