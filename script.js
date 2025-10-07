let playerScore = 0;
let computerScore = 0;
let history = JSON.parse(localStorage.getItem('rpsHistory')) || [];

const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');
const result = document.getElementById('result');
const score = document.getElementById('score');
const reset = document.getElementById('resetBtn');
const clearHistory = document.getElementById('clearHistoryBtn');

const historyBox = document.getElementById('historyList');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const modalClose = historyModal && historyModal.querySelector('.close');

if (historyBtn) {
    historyBtn.addEventListener('click', () => {
        updateHistory();
        if (historyModal) historyModal.style.display = 'block';
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        if (historyModal) historyModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && historyModal && historyModal.style.display === 'block') {
        historyModal.style.display = 'none';
    }
});

rock.addEventListener('click', () => handleClick('rock'));
paper.addEventListener('click', () => handleClick('paper'));
scissors.addEventListener('click', () => handleClick('scissors'));
reset.addEventListener('click', resetGame);

function handleClick(playerChoice) {
    const options = ['rock', 'paper', 'scissors'];
    const computerChoice = options[Math.floor(Math.random() * options.length)];

    let outcome = '';
    let message = '';

    if (playerChoice === computerChoice) {
        outcome = 'tie';
        message = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        outcome = 'win';
        message = 'You win!';
        playerScore++;
    } else {
        outcome = 'lose';
        message = 'Computer wins!';
        computerScore++;
    }

    result.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${message}`;
    score.textContent = `Player: ${playerScore} | Computer: ${computerScore}`;

    const game = {
        player: playerChoice,
        computer: computerChoice,
        outcome,
        time: new Date().toLocaleString()
    };

    history.push(game);
    localStorage.setItem('rpsHistory', JSON.stringify(history));

    updateHistory();
}

function updateHistory() {
    historyBox.innerHTML = '';

    if (!history.length) {
        historyBox.innerHTML = '<p>No games played yet.</p>';
        return;
    }

    const recent = history.slice(-5);
    recent.forEach((game, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <strong>Game ${history.length - recent.length + index + 1}</strong> (${game.time})<br>
            You: ${game.player} | Computer: ${game.computer}<br>
            ${game.outcome === 'win' ? 'You won!' : game.outcome === 'lose' ? 'You lost.' : 'It was a tie.'}
        `;
        historyBox.appendChild(div);
    });
}

function resetGame() {
    if (!confirm('Are you sure you want to reset everything?')) return;

    playerScore = 0;
    computerScore = 0;
    history = [];
    localStorage.removeItem('rpsHistory');

    result.textContent = '';
    score.textContent = 'Player: 0 | Computer: 0';
    historyBox.innerHTML = '<p>No games played yet.</p>';
}
clearHistory.addEventListener('click', clearGameHistory);

function clearGameHistory() {
    if (!history.length) return alert('No history to clear!');
    if (!confirm('Clear all game history?')) return;

    history = [];
    localStorage.removeItem('rpsHistory');
    historyBox.innerHTML = '<p>No games played yet.</p>';
    alert('History cleared successfully!');
}


document.addEventListener('DOMContentLoaded', () => {
    if (history.length) {
        playerScore = history.filter(g => g.outcome === 'win').length;
        computerScore = history.filter(g => g.outcome === 'lose').length;
        score.textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
        updateHistory();
    }
});
