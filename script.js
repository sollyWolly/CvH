let score = 0;
let roundsPlayed = 0;
let correctAnswer = '';
let currentIndex = 0;

async function generateImage(promptText) {
    const response = await fetch('https://college-vs-homeless.iamsollywolly.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
    });

    if (!response.ok) {
        const errorText = await response.text(); // 🔍 Capture error message
        throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
}

async function loadNextImage() {
    if (roundsPlayed >= 5) {
        document.getElementById('game').innerHTML = `<h1>Game Over!</h1><p>Your final score is ${score}/5 (${Math.round((score / 5) * 100)}%)</p>`;
        document.getElementById('game-over').style.display = "block";
        return;
    }

    roundsPlayed++;
    document.getElementById('progress').innerText = `Image ${roundsPlayed} of 5`;

    if (Math.random() < 0.5) {
        correctAnswer = 'college';
        var prompt = "photo portrait of a young college student, who looks like a homeless man, realistic";
    } else {
        correctAnswer = 'homeless';
        var prompt = "photo portrait of a young homeless man, who looks like a college student, realistic";
    }

    document.getElementById('spinner').style.display = "block";
    document.getElementById('image').style.display = "none";

    // Disable buttons during load
    document.querySelectorAll('#buttons button').forEach(btn => btn.disabled = true);

    try {
        const imageUrl = await generateImage(prompt);
        document.getElementById('image').src = imageUrl;
        document.getElementById('result').innerText = "";
    } catch (e) {
        console.error("Failed to load image:", e);
        document.getElementById('result').innerText = "Failed to load image.";
    }

    document.getElementById('spinner').style.display = "none";
    document.getElementById('image').style.display = "block";
    
    // Re-enable buttons after image loads
    document.querySelectorAll('#buttons button').forEach(btn => btn.disabled = false);    

}

function makeGuess(guess) {
    // Disable buttons immediately after a guess
    document.querySelectorAll('#buttons button').forEach(btn => btn.disabled = true);

    if (guess === correctAnswer) {
        score++;
        document.getElementById('result').innerText = "✅ Correct!";
    } else {
        document.getElementById('result').innerText = "❌ Wrong!";
    }
    document.getElementById('score').innerText = `Score: ${score}`;
    currentIndex++;
    setTimeout(() => {
        document.getElementById('result').innerText = "";
        loadNextImage();
    }, 1500);
}

// Dark mode toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');
    const label = document.getElementById('mode-label');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        toggle.checked = true;
        label.textContent = '🌙 Dark';
    }

    // Handle toggle change
    toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        document.body.classList.toggle('dark', isDark);
        label.textContent = isDark ? '🌙 Dark' : '🌞 Light';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});


function restartGame() {
    score = 0;
    roundsPlayed = 0;
    currentIndex = 0;
    document.getElementById('score').innerText = "Score: 0";
    document.getElementById('game-over').style.display = "none";
    document.getElementById('game').innerHTML = `
      <h1>College Student or Homeless?</h1>
      <div id="score">Score: 0</div>
      <div id="spinner" style="display:none;">🌀 Generating image...</div>
      <img id="image" src="" alt="Loading..." width="300" height="300">
      <div id="buttons">
        <button onclick="makeGuess('college')">College Student</button>
        <button onclick="makeGuess('homeless')">Homeless Person</button>
      </div>
      <div id="result"></div>
    `;
    loadNextImage();
}


// Start game
loadNextImage();
