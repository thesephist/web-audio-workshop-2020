const SINGLE_TICK = 250;

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

// Safari compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;

function tick() {
  return new Promise(res => setTimeout(res, SINGLE_TICK));
}

const inputField = document.getElementById('inputField');
const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

let player = null;

// read notes from the <input> and return
// an array of frequencies
function getInputFrequencies() {
  const input = inputField.value.trim();
  const frequencies = [];
  for (const letter of input) {
    const freq = NOTES[letter.toLowerCase()];
    if (freq === undefined) {
      alert(`Unknown note "${letter}"!`);
      throw new Error('Unknown note ' + letter);
    }

    frequencies.push(freq);
  }
  return frequencies;
}

playButton.addEventListener('click', async () => {
  // do nothing if already playing
  if (player) return;

  player = new Player();
  await player.play(getInputFrequencies(), freq => {
    console.log(`Playing ${freq}Hz`);
  }, () => {
    player = null;
  }).catch(e => console.error(e));
});
stopButton.addEventListener('click', () => {
  // do nothing if already stopped
  if (player == null) return;

  player.stop();
  player = null;
});

class Player {
  constructor() {
    this.ctx = new AudioContext();
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'triangle';
    this.oscillator.connect(this.ctx.destination);
    this.stopped = false;
  }

  async play(frequencies, afterBeat, afterComplete) {
    this.oscillator.start();

    frequencies = frequencies.slice(); // clone, since we'll shift()
    while (frequencies.length) {
      const freq = frequencies.shift();
      afterBeat(freq);

      this.oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);
      await tick();

      if (this.stopped) return;
    }

    this.stop();
    afterComplete();
  }

  stop() {
    this.stopped = true;
    this.oscillator.stop();
    this.ctx.close();
  }
}
