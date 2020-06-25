// for Safari compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;

// what to do when clicking "Play"
document.getElementById('playButton').addEventListener('click', () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'triangle';
  oscillator.connect(ctx.destination);

  oscillator.start();
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);

  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 1000);
});
