import './style.css';

const rounds = [
  { letter: 'M', word: 'moon', emoji: '🌙', sound: '/m/' },
  { letter: 'S', word: 'sun', emoji: '☀️', sound: '/s/' },
  { letter: 'T', word: 'turtle', emoji: '🐢', sound: '/t/' },
  { letter: 'P', word: 'pig', emoji: '🐷', sound: '/p/' }
];
let round = 0;
let stars = 0;
let locked = false;

const app = document.querySelector('#app');
function render() {
  const item = rounds[round];
  const choices = [...new Set([item.letter, ...rounds.map(x => x.letter)])].sort(() => Math.random() - .5).slice(0, 3);
  app.innerHTML = `
    <main class="shell">
      <header class="topbar"><div class="brand"><span class="brand-mark">✦</span><span>Sound Safari</span></div><div class="streak" aria-label="${stars} stars">⭐ ${stars}</div></header>
      <section class="progress" aria-label="Round ${round + 1} of ${rounds.length}"><div class="progress-fill" style="width:${((round + 1) / rounds.length) * 100}%"></div></section>
      <section class="game-card">
        <p class="eyebrow">Listen and find</p>
        <h1>What sound starts<br/>the word?</h1>
        <button class="picture" id="speak" aria-label="Hear the word ${item.word}"><span>${item.emoji}</span><small>tap to hear</small></button>
        <p class="word">${item.word}</p>
        <div class="sound-row"><span>First sound:</span><button class="sound" id="sound" aria-label="Hear the sound ${item.sound}">🔊 ${item.sound}</button></div>
        <div class="choices" role="group" aria-label="Choose a letter">${choices.map(c => `<button class="choice" data-letter="${c}">${c}</button>`).join('')}</div>
        <p class="hint" id="hint">You can try again. Take your time!</p>
      </section>
      <footer><span>Grown-up corner</span><span>•</span><span>Short and sweet practice</span></footer>
    </main>`;
  document.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => choose(b.dataset.letter, item)));
  document.querySelector('#speak').addEventListener('click', () => say(item.word));
  document.querySelector('#sound').addEventListener('click', () => say(`The first sound is ${item.sound}`));
}
function say(text) { if ('speechSynthesis' in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = .75; u.pitch = 1.15; speechSynthesis.speak(u); } }
function choose(letter, item) {
  if (locked) return;
  const button = document.querySelector(`[data-letter="${letter}"]`);
  if (letter === item.letter) { locked = true; stars++; button.classList.add('correct'); document.querySelector('#hint').textContent = 'Great listening! ⭐'; say(`Yes! ${item.letter} says ${item.sound}`); setTimeout(() => { round = (round + 1) % rounds.length; locked = false; render(); }, 1200); }
  else { button.classList.add('try-again'); document.querySelector('#hint').textContent = 'Almost! Listen once more and try again.'; say(`Listen for ${item.sound}`); setTimeout(() => button.classList.remove('try-again'), 600); }
}
render();
