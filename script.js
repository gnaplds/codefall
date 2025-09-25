// Simple sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine', volume = 0.1) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playButtonClick() {
    playSound(800, 0.1, 'square', 0.05);
}

function playTypingSound() {
    playSound(400 + Math.random() * 200, 0.05, 'square', 0.03);
}

function playDeleteSound() {
    playSound(300, 0.08, 'sawtooth', 0.04);
}

function playWordComplete() {
    playSound(523, 0.2, 'sine', 0.08);
    setTimeout(() => playSound(659, 0.2, 'sine', 0.06), 50);
    setTimeout(() => playSound(784, 0.3, 'sine', 0.08), 100);
}

function playLifeLoss() {
    playSound(440, 0.15, 'triangle', 0.12);
    setTimeout(() => playSound(349, 0.2, 'triangle', 0.1), 100);
    setTimeout(() => playSound(294, 0.25, 'triangle', 0.08), 200);
}

function playGameOver() {
    playSound(440, 0.3, 'triangle', 0.1);
    setTimeout(() => playSound(392, 0.3, 'triangle', 0.1), 150);
    setTimeout(() => playSound(349, 0.5, 'triangle', 0.12), 300);
}

function playGameStart() {
    playSound(262, 0.15, 'sine', 0.08);
    setTimeout(() => playSound(330, 0.15, 'sine', 0.08), 100);
    setTimeout(() => playSound(392, 0.2, 'sine', 0.1), 200);
}

function playPause() {
    playSound(440, 0.3, 'sine', 0.08);
}

const WORD_LIST = [
    'algorithm', 'variable', 'function', 'method', 'class', 'object', 'instance',
    'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface',
    'constructor', 'destructor', 'parameter', 'argument', 'return', 'void',
    'integer', 'string', 'boolean', 'float', 'double', 'char', 'array', 'list',
    'stack', 'queue', 'tree', 'graph', 'hash', 'map', 'set', 'tuple',
    'dictionary', 'vector', 'matrix', 'struct', 'enum', 'pointer', 'reference',
    'loop', 'while', 'for', 'foreach', 'if', 'else', 'switch', 'case', 'break',
    'continue', 'goto', 'try', 'catch', 'finally', 'throw', 'exception',
    'python', 'java', 'javascript', 'typescript', 'cpp', 'csharp', 'ruby',
    'php', 'swift', 'kotlin', 'rust', 'go', 'scala', 'perl', 'lua', 'dart',
    'html', 'css', 'dom', 'ajax', 'json', 'xml', 'http', 'https', 'api',
    'rest', 'soap', 'url', 'uri', 'cookie', 'session', 'jwt', 'oauth',
    'react', 'angular', 'vue', 'node', 'express', 'webpack', 'babel',
    'database', 'sql', 'query', 'select', 'insert', 'update', 'delete',
    'join', 'index', 'primary', 'foreign', 'key', 'table', 'schema',
    'mysql', 'postgres', 'mongodb', 'redis', 'sqlite', 'nosql', 'acid',
    'debugging', 'testing', 'unittest', 'integration', 'deployment',
    'refactoring', 'optimization', 'profiling', 'logging', 'version',
    'git', 'commit', 'branch', 'merge', 'pull', 'push', 'clone', 'fork',
    'agile', 'scrum', 'sprint', 'kanban', 'devops', 'cicd', 'pipeline',
    'recursion', 'iteration', 'complexity', 'bigO', 'sorting', 'searching',
    'binary', 'hex', 'bit', 'byte', 'memory', 'cpu', 'thread', 'process',
    'synchronous', 'asynchronous', 'parallel', 'concurrent', 'mutex',
    'semaphore', 'deadlock', 'race', 'condition', 'atomic', 'volatile',
    'microservice', 'container', 'docker', 'kubernetes', 'cloud', 'aws',
    'azure', 'serverless', 'lambda', 'blockchain', 'machine', 'learning',
    'neural', 'network', 'artificial', 'intelligence', 'tensorflow',
    'callback', 'promise', 'async', 'await', 'closure', 'scope', 'hoisting',
    'prototype', 'delegate', 'event', 'handler', 'listener', 'observer',
    'singleton', 'factory', 'builder', 'adapter', 'decorator', 'facade',
    'proxy', 'strategy', 'template', 'visitor', 'command', 'iterator',
    'state', 'mediator', 'chain', 'responsibility', 'flyweight', 'composite',
    'bridge', 'abstract', 'concrete', 'virtual', 'override', 'overload',
    'static', 'final', 'const', 'immutable', 'mutable', 'private', 'public',
    'protected', 'package', 'namespace', 'module', 'import', 'export',
    'include', 'require', 'dependency', 'injection', 'inversion', 'control',
    'framework', 'library', 'package', 'bundle', 'build', 'compile', 'link',
    'runtime', 'interpreter', 'compiler', 'transpiler', 'preprocessor',
    'syntax', 'semantic', 'lexical', 'parser', 'token', 'grammar', 'regex',
    'expression', 'statement', 'declaration', 'assignment', 'operator',
    'operand', 'precedence', 'associativity', 'evaluation', 'execution',
    'stack', 'heap', 'garbage', 'collection', 'reference', 'counting',
    'mark', 'sweep', 'generation', 'collection', 'allocation', 'deallocation',
    'buffer', 'overflow', 'underflow', 'segmentation', 'fault', 'null',
    'undefined', 'nan', 'infinity', 'precision', 'rounding', 'casting',
    'conversion', 'serialization', 'deserialization', 'encoding', 'decoding',
    'compression', 'encryption', 'decryption', 'hashing', 'checksum',
    'validation', 'sanitization', 'escaping', 'injection', 'xss', 'csrf',
    'authentication', 'authorization', 'permission', 'role', 'privilege',
    'security', 'vulnerability', 'exploit', 'patch', 'update', 'upgrade',
    'version', 'control', 'release', 'hotfix', 'rollback', 'migration',
    'backup', 'restore', 'recovery', 'disaster', 'redundancy', 'failover',
    'load', 'balancing', 'scaling', 'horizontal', 'vertical', 'clustering',
    'sharding', 'partitioning', 'replication', 'synchronization', 'consistency',
    'availability', 'partition', 'tolerance', 'cap', 'theorem', 'eventual',
    'strong', 'weak', 'isolation', 'atomicity', 'durability', 'transaction',
    'commit', 'rollback', 'savepoint', 'lock', 'unlock', 'shared', 'exclusive',
    'read', 'write', 'dirty', 'phantom', 'repeatable', 'uncommitted',
    'committed', 'serializable', 'snapshot', 'optimistic', 'pessimistic',
    'concurrency', 'contention', 'starvation', 'livelock', 'fairness',
    'throughput', 'latency', 'bandwidth', 'bottleneck', 'profiling',
    'benchmark', 'metric', 'monitoring', 'alerting', 'dashboard', 'analytics'
];

let gameState = {
    words: [],
    score: 0,
    highScore: 0,
    gameRunning: false,
    gamePaused: false,
    gameOver: false,
    currentInput: '',
    lives: 3,
    startTime: 0,
    pauseStartTime: 0,
    totalPausedTime: 0,
    gameTime: 0,
    baseSpeed: 0.8,
    speedMultiplier: 1
};

let gameLoopInterval = null;
let timeUpdateInterval = null;
let nextWordTimeout = null;

// Create background particles
function createBackgroundParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function loadHighScore() {
    gameState.highScore = 0;
    document.getElementById('high-score').textContent = gameState.highScore;
}

function saveHighScore() {
    // Placeholder for localStorage implementation
}

function calculateWordSpeed() {
    const minutes = Math.floor(gameState.gameTime / 60);
    const baseSpeedIncrease = minutes * 0.3;
    const randomVariation = Math.random() * 0.8 + 0.6;
    return gameState.baseSpeed + baseSpeedIncrease + randomVariation;
}

function generateWord() {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    const screenWidth = window.innerWidth || 800;
    return {
        id: Math.random().toString(36).substr(2, 9),
        word: randomWord,
        x: Math.random() * Math.max(50, screenWidth - 200),
        y: -100,
        speed: calculateWordSpeed()
    };
}

function createFallingWordElement(wordObj) {
    const wordElement = document.createElement('div');
    wordElement.className = 'falling-word';
    wordElement.id = wordObj.id;
    wordElement.style.left = wordObj.x + 'px';
    wordElement.style.top = (wordObj.y + 60) + 'px';
    
    updateWordElement(wordElement, wordObj.word, gameState.currentInput);
    
    return wordElement;
}

function updateWordElement(element, word, currentInput) {
    element.innerHTML = '';
    
    word.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        
        if (index < currentInput.length) {
            if (currentInput[index]?.toLowerCase() === char.toLowerCase()) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        } else if (index === currentInput.length && currentInput.length > 0) {
            span.classList.add('next');
        }
        
        element.appendChild(span);
    });
}

function triggerSuccessConfetti(wordX, wordY) {
    if (typeof confetti === 'undefined') return;
    
    const screenWidth = window.innerWidth || 800;
    const screenHeight = window.innerHeight || 600;
    
    const originX = Math.max(0.1, Math.min(0.9, wordX / screenWidth));
    const originY = Math.max(0.1, Math.min(0.8, (wordY + 60) / screenHeight));
    
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4'],
        gravity: 1,
        scalar: 0.8,
        drift: 0
    });
}

function triggerGroundHitConfetti(wordX, wordY) {
    if (typeof confetti === 'undefined') return;
    
    const screenWidth = window.innerWidth || 800;
    const originX = Math.max(0.1, Math.min(0.9, wordX / screenWidth));
    
    confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: originX, y: 0.95 },
        colors: ['#ef4444', '#f59e0b', '#dc2626', '#ea580c'],
        gravity: 0.8,
        scalar: 0.6,
        drift: 0,
        startVelocity: 20
    });
}

function triggerGameOverConfetti() {
    if (typeof confetti === 'undefined') return;
    
    const positions = [0.2, 0.4, 0.6, 0.8];
    
    positions.forEach((x, index) => {
        setTimeout(() => {
            confetti({
                particleCount: 40,
                spread: 70,
                origin: { x: x, y: 0.6 },
                colors: ['#ef4444', '#f59e0b', '#dc2626', '#ea580c', '#7c2d12'],
                gravity: 1,
                scalar: 0.7,
                drift: 0
            });
        }, index * 150);
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateGameTime() {
    if (!gameState.gameRunning || gameState.gamePaused) return;
    
    const currentTime = Date.now();
    gameState.gameTime = Math.floor((currentTime - gameState.startTime - gameState.totalPausedTime) / 1000);
    document.getElementById('game-time').textContent = formatTime(gameState.gameTime);
}

function pauseGame() {
    if (!gameState.gameRunning || gameState.gameOver) return;
    
    playPause();
    gameState.gamePaused = true;
    gameState.pauseStartTime = Date.now();
    
    // Update pause screen with current stats
    document.getElementById('pause-score').textContent = gameState.score;
    document.getElementById('pause-time').textContent = formatTime(gameState.gameTime);
    document.getElementById('pause-lives').textContent = gameState.lives;
    document.getElementById('pause-high-score').textContent = gameState.highScore;
    
    // Show pause screen
    document.getElementById('pause-screen').classList.remove('hidden');
    
    // Clear intervals and timeouts
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    if (nextWordTimeout) clearTimeout(nextWordTimeout);
}

function resumeGame() {
    if (!gameState.gamePaused) return;
    
    playButtonClick();
    gameState.gamePaused = false;
    
    // Calculate paused time
    gameState.totalPausedTime += Date.now() - gameState.pauseStartTime;
    
    // Hide pause screen
    document.getElementById('pause-screen').classList.add('hidden');
    
    // Restart intervals
    gameLoopInterval = setInterval(gameLoop, 16);
    timeUpdateInterval = setInterval(updateGameTime, 1000);
    
    // Resume word spawning
    scheduleNextWord();
    
    // Focus hidden input
    setTimeout(() => {
        document.getElementById('hidden-input').focus();
    }, 100);
}

function scheduleNextWord() {
    if (!gameState.gameRunning || gameState.gamePaused) return;
    
    const minutes = Math.floor(gameState.gameTime / 60);
    const spawnRate = Math.max(2000, 3500 - (minutes * 150));
    
    nextWordTimeout = setTimeout(() => {
        if (!gameState.gameRunning || gameState.gamePaused) return;
        
        const newWord = generateWord();
        gameState.words.push(newWord);
        
        const wordElement = createFallingWordElement(newWord);
        document.getElementById('falling-words-area').appendChild(wordElement);
        
        scheduleNextWord();
    }, spawnRate + Math.random() * 1200);
}

function startGame() {
    playGameStart();
    
    gameState = {
        words: [],
        score: 0,
        gameRunning: true,
        gamePaused: false,
        gameOver: false,
        currentInput: '',
        lives: 3,
        highScore: gameState.highScore,
        startTime: Date.now(),
        pauseStartTime: 0,
        totalPausedTime: 0,
        gameTime: 0,
        baseSpeed: 0.8,
        speedMultiplier: 1
    };
    
    updateUI();
    
    // Show game elements
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('ground-line').classList.remove('hidden');
    document.getElementById('lives-display').classList.remove('hidden');
    document.getElementById('time-display').classList.remove('hidden');
    
    // Focus hidden input
    setTimeout(() => {
        document.getElementById('hidden-input').focus();
    }, 100);
    
    // Start time updates
    timeUpdateInterval = setInterval(updateGameTime, 1000);
    
    // Start spawning words
    setTimeout(() => {
        scheduleNextWord();
    }, 2500);
    
    // Start game loop
    gameLoopInterval = setInterval(gameLoop, 16);
}

function goHome() {
    playButtonClick();
    
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.gameOver = false;
    gameState.currentInput = '';
    
    // Clear intervals and timeouts
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    if (nextWordTimeout) clearTimeout(nextWordTimeout);
    
    // Clear falling words
    document.getElementById('falling-words-area').innerHTML = '';
    
    // Show welcome screen
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('ground-line').classList.add('hidden');
    document.getElementById('lives-display').classList.add('hidden');
    document.getElementById('time-display').classList.add('hidden');
}

function endGame() {
    playGameOver();
    
    gameState.gameRunning = false;
    gameState.gameOver = true;
    
    // Trigger game over confetti
    setTimeout(() => {
        triggerGameOverConfetti();
    }, 500);
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore();
        document.getElementById('new-high-score').classList.remove('hidden');
    } else {
        document.getElementById('new-high-score').classList.add('hidden');
    }
    
    clearInterval(gameLoopInterval);
    clearInterval(timeUpdateInterval);
    if (nextWordTimeout) clearTimeout(nextWordTimeout);
    
    // Clear falling words
    document.getElementById('falling-words-area').innerHTML = '';
    
    // Show game over screen
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('ground-line').classList.add('hidden');
    document.getElementById('lives-display').classList.add('hidden');
    document.getElementById('time-display').classList.add('hidden');
    
    updateUI();
}

function gameLoop() {
    if (!gameState.gameRunning || gameState.gamePaused) return;
    
    const screenHeight = window.innerHeight || 600;
    const wordsArea = document.getElementById('falling-words-area');
    
    gameState.words = gameState.words.filter(wordObj => {
        const element = document.getElementById(wordObj.id);
        if (!element) return false;
        
        // Update position
        wordObj.y += wordObj.speed;
        element.style.top = (wordObj.y + 60) + 'px';
        
        // Check if word hit the ground
        if (wordObj.y > screenHeight - 80) {
            // Trigger ground hit confetti
            triggerGroundHitConfetti(wordObj.x, wordObj.y);
            
            gameState.lives--;
            playLifeLoss();
            element.remove();
            
            if (gameState.lives <= 0) {
                endGame();
            } else {
                updateUI();
            }
            
            return false;
        }
        
        return true;
    });
}

function handleInputChange(value) {
    gameState.currentInput = value;
    
    // Update all word elements with new highlighting
    gameState.words.forEach(wordObj => {
        const element = document.getElementById(wordObj.id);
        if (element) {
            updateWordElement(element, wordObj.word, value);
        }
    });
    
    // Check for matches
    const matchIndex = gameState.words.findIndex(wordObj => 
        wordObj.word.toLowerCase() === value.toLowerCase()
    );
    
    if (matchIndex !== -1) {
        playWordComplete();
        
        const matchedWord = gameState.words[matchIndex];
        
        // Trigger success confetti at the matched word position
        triggerSuccessConfetti(matchedWord.x, matchedWord.y);
        
        // Remove word from game state and DOM
        gameState.words.splice(matchIndex, 1);
        const element = document.getElementById(matchedWord.id);
        if (element) {
            element.remove();
        }
        
        // Update score based on word length and speed
        const basePoints = matchedWord.word.length * 10;
        const speedBonus = Math.floor(matchedWord.speed * 5);
        gameState.score += basePoints + speedBonus;
        
        // Clear input and reset highlighting for all remaining words
        gameState.currentInput = '';
        
        // Update all remaining words to remove any highlighting
        gameState.words.forEach(wordObj => {
            const wordElement = document.getElementById(wordObj.id);
            if (wordElement) {
                updateWordElement(wordElement, wordObj.word, '');
            }
        });
        
        updateUI();
    }
}

function clearAllInput() {
    playDeleteSound();
    gameState.currentInput = '';
    
    // Update all word elements
    gameState.words.forEach(wordObj => {
        const element = document.getElementById(wordObj.id);
        if (element) {
            updateWordElement(element, wordObj.word, '');
        }
    });
}

function handleKeyPress(e) {
    const key = e.key;
    
    // Handle pause menu keys
    if (gameState.gamePaused) {
        if (key === 'Escape') {
            e.preventDefault();
            resumeGame();
        } else if (key.toLowerCase() === 'q') {
            e.preventDefault();
            goHome();
        }
        return;
    }
    
    // Handle game keys
    if (!gameState.gameRunning) return;
    
    if (key === 'Escape') {
        e.preventDefault();
        pauseGame();
    } else if (key === 'Backspace') {
        e.preventDefault();
        if (e.ctrlKey) {
            clearAllInput();
        } else {
            playDeleteSound();
            gameState.currentInput = gameState.currentInput.slice(0, -1);
            
            // Update all word elements with new highlighting
            gameState.words.forEach(wordObj => {
                const element = document.getElementById(wordObj.id);
                if (element) {
                    updateWordElement(element, wordObj.word, gameState.currentInput);
                }
            });
        }
    } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        e.preventDefault();
        playTypingSound();
        handleInputChange(gameState.currentInput + key.toLowerCase());
    }
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('high-score').textContent = gameState.highScore;
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-time').textContent = formatTime(gameState.gameTime);
    
    // Update lives display
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('empty', index >= gameState.lives);
    });
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

// Keep focus on hidden input
document.addEventListener('click', () => {
    if (gameState.gameRunning && !gameState.gamePaused) {
        document.getElementById('hidden-input').focus();
    }
});

// Prevent context menu on right click to avoid focus loss
document.addEventListener('contextmenu', (e) => {
    if (gameState.gameRunning && !gameState.gamePaused) {
        e.preventDefault();
    }
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (gameState.gameRunning && !gameState.gamePaused) {
        if (document.hidden) {
            // Auto-pause when tab becomes hidden
            pauseGame();
        } else {
            // Refocus when tab becomes visible again (game remains paused)
            setTimeout(() => {
                if (!gameState.gamePaused) {
                    document.getElementById('hidden-input').focus();
                }
            }, 100);
        }
    }
});

// Initialize
createBackgroundParticles();
loadHighScore();