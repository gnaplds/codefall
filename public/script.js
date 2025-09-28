'use strict';

// Modern ES6+ Game Module
class CodeFallGame {
    constructor() {
        this.initializeConstants();
        this.initializeState();
        this.bindEvents();
        this.createBackgroundParticles();
        this.loadHighScore();
    }

    initializeConstants() {
        // Word lists
        this.EASY_WORDS = [
            'algorithm', 'variable', 'function', 'method', 'class', 'object', 'instance',
            'loop', 'while', 'for', 'if', 'else', 'array', 'list', 'string', 'integer',
            'boolean', 'return', 'void', 'print', 'input', 'output', 'debug', 'error',
            'compile', 'run', 'code', 'program', 'software', 'hardware', 'memory',
            'cpu', 'data', 'file', 'folder', 'save', 'load', 'copy', 'paste',
            'delete', 'create', 'update', 'database', 'table', 'query', 'select',
            'insert', 'web', 'html', 'css', 'javascript', 'python', 'java',
            'git', 'commit', 'push', 'pull', 'branch', 'merge', 'clone', 'fork',
            'user', 'admin', 'login', 'password', 'security', 'backup', 'restore',
            'network', 'server', 'client', 'api', 'http', 'url', 'domain',
            'browser', 'website', 'application', 'framework', 'library', 'package',
            'install', 'import', 'export', 'module', 'component', 'interface',
            'button', 'click', 'event', 'mouse', 'keyboard', 'screen', 'window',
            'menu', 'dialog', 'form', 'text', 'image', 'video', 'audio',
            'file', 'download', 'upload', 'sync', 'cloud', 'storage', 'drive'
        ];

        this.FULL_WORD_LIST = [
            ...this.EASY_WORDS,
            'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface',
            'constructor', 'destructor', 'parameter', 'argument', 'return', 'void',
            'integer', 'string', 'boolean', 'float', 'double', 'char', 'array', 'list',
            'stack', 'queue', 'tree', 'graph', 'hash', 'map', 'set', 'tuple',
            'dictionary', 'vector', 'matrix', 'struct', 'enum', 'pointer', 'reference',
            'foreach', 'switch', 'case', 'break', 'continue', 'goto', 'try', 'catch',
            'finally', 'throw', 'exception', 'typescript', 'cpp', 'csharp', 'ruby',
            'php', 'swift', 'kotlin', 'rust', 'go', 'scala', 'perl', 'lua', 'dart',
            'dom', 'ajax', 'json', 'xml', 'https', 'rest', 'soap', 'uri', 'cookie',
            'session', 'jwt', 'oauth', 'react', 'angular', 'vue', 'node', 'express',
            'webpack', 'babel', 'sql', 'join', 'index', 'primary', 'foreign', 'key',
            'schema', 'mysql', 'postgres', 'mongodb', 'redis', 'sqlite', 'nosql',
            'acid', 'debugging', 'testing', 'unittest', 'integration', 'deployment',
            'refactoring', 'optimization', 'profiling', 'logging', 'version', 'agile',
            'scrum', 'sprint', 'kanban', 'devops', 'cicd', 'pipeline', 'recursion',
            'iteration', 'complexity', 'bigO', 'sorting', 'searching', 'binary', 'hex',
            'bit', 'byte', 'thread', 'process', 'synchronous', 'asynchronous',
            'parallel', 'concurrent', 'mutex', 'semaphore', 'deadlock', 'race',
            'condition', 'atomic', 'volatile', 'microservice', 'container', 'docker',
            'kubernetes', 'cloud', 'aws', 'azure', 'serverless', 'lambda',
            'blockchain', 'machine', 'learning', 'neural', 'network', 'artificial',
            'intelligence', 'tensorflow', 'callback', 'promise', 'async', 'await',
            'closure', 'scope', 'hoisting', 'prototype', 'delegate', 'event',
            'handler', 'listener', 'observer', 'singleton', 'factory', 'builder',
            'adapter', 'decorator', 'facade', 'proxy', 'strategy', 'template',
            'visitor', 'command', 'iterator', 'state', 'mediator', 'chain',
            'responsibility', 'flyweight', 'composite', 'bridge', 'abstract',
            'concrete', 'virtual', 'override', 'overload', 'static', 'final',
            'const', 'immutable', 'mutable', 'private', 'public', 'protected',
            'package', 'namespace', 'include', 'require', 'dependency', 'injection',
            'inversion', 'control', 'bundle', 'build', 'compile', 'link', 'runtime',
            'interpreter', 'compiler', 'transpiler', 'preprocessor', 'syntax',
            'semantic', 'lexical', 'parser', 'token', 'grammar', 'regex',
            'expression', 'statement', 'declaration', 'assignment', 'operator',
            'operand', 'precedence', 'associativity', 'evaluation', 'execution'
        ];

        // Difficulty settings
        this.DIFFICULTY_SETTINGS = {
            easy: {
                baseSpeed: 0.5,
                speedIncrement: 0.15,
                lives: 3,
                wordList: this.EASY_WORDS,
                spawnRate: 3000,
                spawnReduction: 100
            },
            challenge: {
                baseSpeed: 1.2,
                speedIncrement: 0.25,
                lives: 1,
                wordList: this.FULL_WORD_LIST,
                spawnRate: 2000,
                spawnReduction: 150
            }
        };

        // Audio context for sound effects
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }

    initializeState() {
        this.gameState = {
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
            difficulty: 'easy',
            settings: null,
            wordsTyped: 0,
            correctChars: 0,
            totalChars: 0
        };

        this.intervals = {
            gameLoop: null,
            timeUpdate: null,
            wordSpawn: null
        };

        this.currentLeaderboardFilter = 'all';
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', () => this.maintainFocus());
        document.addEventListener('contextmenu', (e) => this.preventContextMenu(e));
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Form submission
        const saveForm = document.getElementById('save-score-form');
        if (saveForm) {
            saveForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveScore();
            });
        }
    }

    // Audio Methods
    playSound(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio playback failed');
        }
    }

    playButtonClick() { this.playSound(800, 0.1, 'square', 0.05); }
    playTypingSound() { this.playSound(400 + Math.random() * 200, 0.05, 'square', 0.03); }
    playDeleteSound() { this.playSound(300, 0.08, 'sawtooth', 0.04); }
    playWordComplete() {
        this.playSound(523, 0.2, 'sine', 0.08);
        setTimeout(() => this.playSound(659, 0.2, 'sine', 0.06), 50);
        setTimeout(() => this.playSound(784, 0.3, 'sine', 0.08), 100);
    }
    playLifeLoss() {
        this.playSound(440, 0.15, 'triangle', 0.12);
        setTimeout(() => this.playSound(349, 0.2, 'triangle', 0.1), 100);
        setTimeout(() => this.playSound(294, 0.25, 'triangle', 0.08), 200);
    }
    playGameOver() {
        this.playSound(440, 0.3, 'triangle', 0.1);
        setTimeout(() => this.playSound(392, 0.3, 'triangle', 0.1), 150);
        setTimeout(() => this.playSound(349, 0.5, 'triangle', 0.12), 300);
    }
    playGameStart() {
        this.playSound(262, 0.15, 'sine', 0.08);
        setTimeout(() => this.playSound(330, 0.15, 'sine', 0.08), 100);
        setTimeout(() => this.playSound(392, 0.2, 'sine', 0.1), 200);
    }
    playPause() { this.playSound(440, 0.3, 'sine', 0.08); }

    // Utility Methods
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadHighScore() {
        const saved = localStorage.getItem('codefall-high-score');
        this.gameState.highScore = saved ? parseInt(saved, 10) : 0;
        document.getElementById('high-score').textContent = this.gameState.highScore;
    }

    saveHighScore() {
        localStorage.setItem('codefall-high-score', this.gameState.highScore.toString());
    }

    createBackgroundParticles() {
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

    // Game Logic Methods
    calculateWordSpeed() {
        const minutes = this.gameState.gameTime / 60;
        const speedIncrease = minutes * this.gameState.settings.speedIncrement;
        const currentSpeed = this.gameState.settings.baseSpeed + speedIncrease;
        const randomVariation = Math.random() * 0.2 + 0.9;
        return currentSpeed * randomVariation;
    }

    generateWord() {
        const randomWord = this.gameState.settings.wordList[
            Math.floor(Math.random() * this.gameState.settings.wordList.length)
        ];
        const screenWidth = window.innerWidth || 800;
        return {
            id: Math.random().toString(36).substr(2, 9),
            word: randomWord,
            x: Math.random() * Math.max(50, screenWidth - 200),
            y: -100,
            speed: this.calculateWordSpeed()
        };
    }

    createFallingWordElement(wordObj) {
        const wordElement = document.createElement('div');
        wordElement.className = 'falling-word';
        wordElement.id = wordObj.id;
        wordElement.style.left = wordObj.x + 'px';
        wordElement.style.top = (wordObj.y + 60) + 'px';
        wordElement.setAttribute('role', 'text');
        wordElement.setAttribute('aria-label', `Word to type: ${wordObj.word}`);
        
        this.updateWordElement(wordElement, wordObj.word, this.gameState.currentInput);
        
        return wordElement;
    }

    updateWordElement(element, word, currentInput) {
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

    triggerConfetti(wordX, wordY, colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#06b6d4']) {
        if (typeof confetti === 'undefined') return;
        
        const screenWidth = window.innerWidth || 800;
        const screenHeight = window.innerHeight || 600;
        
        const originX = Math.max(0.1, Math.min(0.9, wordX / screenWidth));
        const originY = Math.max(0.1, Math.min(0.8, (wordY + 60) / screenHeight));
        
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: originX, y: originY },
            colors,
            gravity: 1,
            scalar: 0.8,
            drift: 0
        });
    }

    updateGameTime() {
        if (!this.gameState.gameRunning || this.gameState.gamePaused) return;
        
        const currentTime = Date.now();
        this.gameState.gameTime = Math.floor(
            (currentTime - this.gameState.startTime - this.gameState.totalPausedTime) / 1000
        );
        document.getElementById('game-time').textContent = this.formatTime(this.gameState.gameTime);
    }

    handleInputChange(value) {
        this.gameState.currentInput = value;
        
        // Update all word elements with new highlighting
        this.gameState.words.forEach(wordObj => {
            const element = document.getElementById(wordObj.id);
            if (element) {
                this.updateWordElement(element, wordObj.word, value);
            }
        });
        
        // Check for matches
        const matchIndex = this.gameState.words.findIndex(wordObj => 
            wordObj.word.toLowerCase() === value.toLowerCase()
        );
        
        if (matchIndex !== -1) {
            this.handleWordMatch(matchIndex, value);
        }
    }

    handleWordMatch(matchIndex, value) {
        this.playWordComplete();
        
        const matchedWord = this.gameState.words[matchIndex];
        
        // Update statistics
        this.gameState.wordsTyped++;
        this.gameState.correctChars += matchedWord.word.length;
        this.gameState.totalChars += value.length;
        
        // Trigger success confetti
        this.triggerConfetti(matchedWord.x, matchedWord.y);
        
        // Remove word
        this.gameState.words.splice(matchIndex, 1);
        const element = document.getElementById(matchedWord.id);
        if (element) {
            element.remove();
        }
        
        // Update score
        this.updateScore(matchedWord);
        
        // Clear input
        this.gameState.currentInput = '';
        
        // Update remaining words
        this.gameState.words.forEach(wordObj => {
            const wordElement = document.getElementById(wordObj.id);
            if (wordElement) {
                this.updateWordElement(wordElement, wordObj.word, '');
            }
        });
        
        this.updateUI();
    }

    updateScore(matchedWord) {
        const basePoints = matchedWord.word.length * 10;
        const speedBonus = Math.floor(matchedWord.speed * 5);
        const difficultyMultiplier = this.gameState.difficulty === 'challenge' ? 1.5 : 1;
        this.gameState.score += Math.floor((basePoints + speedBonus) * difficultyMultiplier);
    }

    clearAllInput() {
        this.playDeleteSound();
        this.gameState.currentInput = '';
        
        this.gameState.words.forEach(wordObj => {
            const element = document.getElementById(wordObj.id);
            if (element) {
                this.updateWordElement(element, wordObj.word, '');
            }
        });
    }

    gameLoop() {
        if (!this.gameState.gameRunning || this.gameState.gamePaused) return;
        
        const screenHeight = window.innerHeight || 600;
        
        this.gameState.words = this.gameState.words.filter(wordObj => {
            const element = document.getElementById(wordObj.id);
            if (!element) return false;
            
            // Update position
            wordObj.y += wordObj.speed;
            element.style.top = (wordObj.y + 60) + 'px';
            
            // Check if word hit the ground
            if (wordObj.y > screenHeight - 80) {
                this.handleWordMissed(wordObj, element);
                return false;
            }
            
            return true;
        });
    }

    handleWordMissed(wordObj, element) {
        // Trigger ground hit confetti
        this.triggerConfetti(wordObj.x, wordObj.y, ['#ef4444', '#f59e0b', '#dc2626', '#ea580c']);
        
        this.gameState.lives--;
        this.playLifeLoss();
        element.remove();
        
        if (this.gameState.lives <= 0) {
            this.endGame();
        } else {
            this.updateUI();
        }
    }

    scheduleNextWord() {
        if (!this.gameState.gameRunning || this.gameState.gamePaused) return;
        
        const minutes = Math.floor(this.gameState.gameTime / 60);
        const spawnRateReduction = minutes * this.gameState.settings.spawnReduction;
        const currentSpawnRate = Math.max(1000, this.gameState.settings.spawnRate - spawnRateReduction);
        
        this.intervals.wordSpawn = setTimeout(() => {
            if (!this.gameState.gameRunning || this.gameState.gamePaused) return;
            
            const newWord = this.generateWord();
            this.gameState.words.push(newWord);
            
            const wordElement = this.createFallingWordElement(newWord);
            document.getElementById('falling-words-area').appendChild(wordElement);
            
            this.scheduleNextWord();
        }, currentSpawnRate + Math.random() * 1000);
    }

    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('high-score').textContent = this.gameState.highScore;
        document.getElementById('final-score').textContent = this.gameState.score;
        document.getElementById('final-time').textContent = this.formatTime(this.gameState.gameTime);
        document.getElementById('final-difficulty').textContent = 
            this.gameState.difficulty === 'easy' ? 'Easy' : 'Challenge';
        document.getElementById('final-words').textContent = this.gameState.wordsTyped;
        
        // Calculate accuracy
        const accuracy = this.gameState.totalChars > 0 
            ? Math.round((this.gameState.correctChars / this.gameState.totalChars) * 100) 
            : 100;
        document.getElementById('final-accuracy').textContent = accuracy + '%';
        
        // Update lives display
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            heart.classList.toggle('empty', index >= this.gameState.lives);
        });

        // Update lives aria-label
        const livesDisplay = document.querySelector('[aria-label*="lives remaining"]');
        if (livesDisplay) {
            livesDisplay.setAttribute('aria-label', `${this.gameState.lives} lives remaining`);
        }
    }

    // Event Handlers
    handleKeyPress(e) {
        const { key } = e;
        
        // Handle pause menu keys
        if (this.gameState.gamePaused) {
            if (key === 'Escape') {
                e.preventDefault();
                this.resumeGame();
            } else if (key.toLowerCase() === 'q') {
                e.preventDefault();
                this.goHome();
            }
            return;
        }
        
        // Handle game keys
        if (!this.gameState.gameRunning) return;
        
        if (key === 'Escape') {
            e.preventDefault();
            this.pauseGame();
        } else if (key === 'Backspace') {
            e.preventDefault();
            if (e.ctrlKey) {
                this.clearAllInput();
            } else {
                this.playDeleteSound();
                this.gameState.currentInput = this.gameState.currentInput.slice(0, -1);
                this.gameState.totalChars++;
                
                // Update word highlighting
                this.gameState.words.forEach(wordObj => {
                    const element = document.getElementById(wordObj.id);
                    if (element) {
                        this.updateWordElement(element, wordObj.word, this.gameState.currentInput);
                    }
                });
            }
        } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
            e.preventDefault();
            this.playTypingSound();
            this.gameState.totalChars++;
            this.handleInputChange(this.gameState.currentInput + key.toLowerCase());
        }
    }

    handleCardKeydown(event, difficulty) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.startGame(difficulty);
            this.playButtonClick();
        }
    }

    maintainFocus() {
        if (this.gameState.gameRunning && !this.gameState.gamePaused) {
            document.getElementById('hidden-input').focus();
        }
    }

    preventContextMenu(e) {
        if (this.gameState.gameRunning && !this.gameState.gamePaused) {
            e.preventDefault();
        }
    }

    handleVisibilityChange() {
        if (this.gameState.gameRunning && !this.gameState.gamePaused) {
            if (document.hidden) {
                this.pauseGame();
            } else {
                setTimeout(() => {
                    if (!this.gameState.gamePaused) {
                        document.getElementById('hidden-input').focus();
                    }
                }, 100);
            }
        }
    }

    // Game State Management
    startGame(difficulty = 'easy') {
        this.playGameStart();
        
        this.gameState = {
            ...this.gameState,
            words: [],
            score: 0,
            gameRunning: true,
            gamePaused: false,
            gameOver: false,
            currentInput: '',
            lives: this.DIFFICULTY_SETTINGS[difficulty].lives,
            startTime: Date.now(),
            pauseStartTime: 0,
            totalPausedTime: 0,
            gameTime: 0,
            difficulty: difficulty,
            settings: this.DIFFICULTY_SETTINGS[difficulty],
            wordsTyped: 0,
            correctChars: 0,
            totalChars: 0
        };
        
        this.updateUI();
        this.showGameElements();
        
        // Update difficulty display
        document.getElementById('current-difficulty').textContent = 
            difficulty === 'easy' ? 'Easy' : 'Challenge';
        
        // Focus hidden input
        setTimeout(() => {
            document.getElementById('hidden-input').focus();
        }, 100);
        
        // Start intervals
        this.intervals.timeUpdate = setInterval(() => this.updateGameTime(), 1000);
        this.intervals.gameLoop = setInterval(() => this.gameLoop(), 16);
        
        // Start spawning words
        setTimeout(() => {
            this.scheduleNextWord();
        }, 2500);
    }

    pauseGame() {
        if (!this.gameState.gameRunning || this.gameState.gameOver) return;
        
        this.playPause();
        this.gameState.gamePaused = true;
        this.gameState.pauseStartTime = Date.now();
        
        // Update pause screen
        document.getElementById('pause-score').textContent = this.gameState.score;
        document.getElementById('pause-time').textContent = this.formatTime(this.gameState.gameTime);
        document.getElementById('pause-lives').textContent = this.gameState.lives;
        document.getElementById('pause-difficulty').textContent = 
            this.gameState.difficulty === 'easy' ? 'Easy' : 'Challenge';
        
        // Show pause screen
        document.getElementById('pause-screen').classList.remove('hidden');
        
        // Clear intervals
        this.clearIntervals();
    }

    resumeGame() {
        if (!this.gameState.gamePaused) return;
        
        this.playButtonClick();
        this.gameState.gamePaused = false;
        
        // Calculate paused time
        this.gameState.totalPausedTime += Date.now() - this.gameState.pauseStartTime;
        
        // Hide pause screen
        document.getElementById('pause-screen').classList.add('hidden');
        
        // Restart intervals
        this.intervals.gameLoop = setInterval(() => this.gameLoop(), 16);
        this.intervals.timeUpdate = setInterval(() => this.updateGameTime(), 1000);
        
        // Resume word spawning
        this.scheduleNextWord();
        
        // Focus hidden input
        setTimeout(() => {
            document.getElementById('hidden-input').focus();
        }, 100);
    }

    endGame() {
        this.playGameOver();
        
        this.gameState.gameRunning = false;
        this.gameState.gameOver = true;
        
        // Check for high score
        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
            this.saveHighScore();
            document.getElementById('new-high-score').classList.remove('hidden');
        } else {
            document.getElementById('new-high-score').classList.add('hidden');
        }
        
        this.clearIntervals();
        
        // Clear falling words
        document.getElementById('falling-words-area').innerHTML = '';
        
        // Reset save form
        this.resetSaveForm();
        
        // Show game over screen
        this.showGameOverScreen();
        
        // Trigger confetti
        setTimeout(() => {
            this.triggerGameOverConfetti();
        }, 500);
        
        this.updateUI();
    }

    triggerGameOverConfetti() {
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

    goHome() {
        this.playButtonClick();
        
        this.gameState.gameRunning = false;
        this.gameState.gamePaused = false;
        this.gameState.gameOver = false;
        this.gameState.currentInput = '';
        
        this.clearIntervals();
        
        // Clear falling words
        document.getElementById('falling-words-area').innerHTML = '';
        
        // Show welcome screen
        this.showWelcomeScreen();
    }

    clearIntervals() {
        Object.keys(this.intervals).forEach(key => {
            if (this.intervals[key]) {
                clearInterval(this.intervals[key]);
                clearTimeout(this.intervals[key]);
                this.intervals[key] = null;
            }
        });
    }

    // Screen Management
    showWelcomeScreen() {
        this.hideAllScreens();
        document.getElementById('welcome-screen').classList.remove('hidden');
    }

    showDifficultySelection() {
        this.hideAllScreens();
        document.getElementById('difficulty-screen').classList.remove('hidden');
    }

    showGameElements() {
        this.hideAllScreens();
        ['ground-line', 'lives-display', 'time-display', 'difficulty-display'].forEach(id => {
            document.getElementById(id).classList.remove('hidden');
        });
    }

    showGameOverScreen() {
        this.hideAllScreens();
        document.getElementById('game-over-screen').classList.remove('hidden');
        ['ground-line', 'lives-display', 'time-display', 'difficulty-display'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    showLeaderboard() {
        this.hideAllScreens();
        document.getElementById('leaderboard-screen').classList.remove('hidden');
        
        // Reset filter
        this.currentLeaderboardFilter = 'all';
        this.updateFilterButtons();
        this.loadLeaderboard();
    }

    hideAllScreens() {
        ['welcome-screen', 'difficulty-screen', 'game-over-screen', 'leaderboard-screen', 'pause-screen'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    // API and Save Functions
    async saveScore() {
        const playerName = document.getElementById('player-name').value.trim();
        
        if (!playerName) {
            this.showMessage('Please enter your name', 'error');
            return;
        }

        if (playerName.length > 10) {
            this.showMessage('Name is too long (max 50 characters)', 'error');
            return;
        }

        this.hideMessages();
        this.showMessage('Saving score...', 'success');

        try {
            const accuracy = this.gameState.totalChars > 0 
                ? Math.round((this.gameState.correctChars / this.gameState.totalChars) * 100) 
                : 100;
            
            const response = await fetch(`${window.location.origin}/api/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName,
                    score: this.gameState.score,
                    timeSurvived: this.formatTime(this.gameState.gameTime),
                    timeInSeconds: this.gameState.gameTime,
                    difficulty: this.gameState.difficulty,
                    wordsTyped: this.gameState.wordsTyped,
                    accuracy
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showShareSection(data.shareUrl);
            } else {
                throw new Error(data.error || 'Failed to save score');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            this.showMessage('Failed to save score. Please try again.', 'error');
        }
    }

    async loadLeaderboard(difficulty = 'all') {
        try {
            const url = difficulty === 'all' 
                ? `${window.location.origin}/api/leaderboard`
                : `${window.location.origin}/api/leaderboard?difficulty=${difficulty}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (response.ok) {
                this.displayLeaderboard(data.scores);
            } else {
                throw new Error(data.error || 'Failed to load leaderboard');
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            document.getElementById('leaderboard-list').innerHTML = 
                '<div class="message error" style="text-align: center; padding: 2rem;">Failed to load leaderboard</div>';
        }
    }

    displayLeaderboard(scores) {
        const container = document.getElementById('leaderboard-list');
        
        if (scores.length === 0) {
            container.innerHTML = '<div class="message" style="text-align: center; padding: 2rem;">No scores yet. Be the first!</div>';
            return;
        }

        container.innerHTML = scores.map((score, index) => {
            const rank = index + 1;
            const rankClass = rank === 1 ? 'first' : rank <= 3 ? 'top3' : '';
            
            return `
                <div class="leaderboard-item" role="listitem" data-game-id="${score.gameId}" style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-md); margin-bottom: var(--spacing-sm); background: rgba(51, 65, 85, 0.5); border-radius: var(--border-radius-sm); transition: var(--transition-base);">
                    <div style="font-weight: bold; color: ${rank === 1 ? '#fbbf24' : rank <= 3 ? '#22c55e' : '#f59e0b'}; min-width: 3rem;">#${rank}</div>
                    <div style="flex: 1; display: flex; justify-content: space-between; align-items: center; margin-left: var(--spacing-md);">
                        <div style="font-weight: bold; color: var(--text-primary);">${this.escapeHtml(score.playerName)}</div>
                        <div style="display: flex; gap: var(--spacing-md); font-size: var(--font-size-sm); color: var(--text-muted);">
                            <span style="color: var(--color-primary); font-weight: bold;">${score.score} pts</span>
                            <span>${score.timeSurvived}</span>
                            <span style="color: ${score.difficulty === 'easy' ? '#22c55e' : '#ef4444'}">
                                ${score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                            </span>
                            ${score.accuracy ? `<span>${score.accuracy}% acc</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterLeaderboard(difficulty) {
        this.currentLeaderboardFilter = difficulty;
        this.updateFilterButtons();
        
        document.getElementById('leaderboard-list').innerHTML = 
            '<div class="message" style="text-align: center; padding: 2rem;">Loading...</div>';
        this.loadLeaderboard(difficulty);
    }

    updateFilterButtons() {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            if (btn.getAttribute('data-filter') === this.currentLeaderboardFilter) {
                btn.style.background = 'var(--color-primary)';
                btn.style.borderColor = 'var(--color-primary)';
                btn.style.color = 'var(--text-primary)';
            } else {
                btn.style.background = 'rgba(75, 85, 99, 0.3)';
                btn.style.borderColor = '#4b5563';
                btn.style.color = 'var(--text-secondary)';
            }
        });
    }

    // UI Helper Methods
    showMessage(message, type) {
        const errorElement = document.getElementById('save-error');
        const successElement = document.getElementById('save-success');
        
        if (type === 'error') {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            successElement.classList.add('hidden');
        } else {
            successElement.textContent = message;
            successElement.classList.remove('hidden');
            errorElement.classList.add('hidden');
        }
    }

    hideMessages() {
        document.getElementById('save-error').classList.add('hidden');
        document.getElementById('save-success').classList.add('hidden');
    }

    // Fixed showShareSection function - replaces the original one
    showShareSection(shareUrl) {
        const saveForm = document.getElementById('save-score-form');
        const shareSection = document.getElementById('share-section');
        const shareUrlElement = document.getElementById('share-url');
        
        // Update share URL
        shareUrlElement.textContent = shareUrl;
        
        // Show share section
        shareSection.classList.remove('hidden');
        
        // Hide only the form elements, not the entire panel
        const formElements = saveForm.querySelectorAll('.form-group, button[type="submit"], #save-feedback');
        formElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Update the panel title to indicate success
        const panelTitle = saveForm.querySelector('h3');
        if (panelTitle) {
            panelTitle.textContent = 'Score Saved Successfully!';
            panelTitle.style.color = 'var(--color-success)';
            panelTitle.style.textShadow = '0 0 10px var(--color-success)';
        }
    }

    // Also update the resetSaveForm function to properly reset everything
    resetSaveForm() {
        const saveForm = document.getElementById('save-score-form');
        const shareSection = document.getElementById('share-section');
        
        // Show the save form panel
        saveForm.style.display = 'block';
        
        // Hide share section
        shareSection.classList.add('hidden');
        
        // Show all form elements again
        const formElements = saveForm.querySelectorAll('.form-group, button[type="submit"], #save-feedback');
        formElements.forEach(element => {
            element.style.display = '';
        });
        
        // Reset the panel title
        const panelTitle = saveForm.querySelector('h3');
        if (panelTitle) {
            panelTitle.textContent = 'Save Your Score';
            panelTitle.style.color = '';
            panelTitle.style.textShadow = '';
        }
        
        // Clear input and messages
        document.getElementById('player-name').value = '';
        this.hideMessages();
    }

    copyShareUrl() {
        const shareUrl = document.getElementById('share-url').textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showMessage('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopy(shareUrl);
            });
        } else {
            this.fallbackCopy(shareUrl);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('Link copied to clipboard!', 'success');
        } catch (err) {
            this.showMessage('Failed to copy link', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    shareToTwitter() {
        const shareUrl = document.getElementById('share-url').textContent;
        const text = `I just scored ${this.gameState.score} points in CodeFall! Can you beat my score?`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
}

// Global functions for onclick handlers (maintained for compatibility)
let game;

function initGame() {
    game = new CodeFallGame();
}

function showDifficultySelection() {
    game.showDifficultySelection();
}

function showLeaderboard() {
    game.showLeaderboard();
}

function startGame(difficulty) {
    game.startGame(difficulty);
}

function resumeGame() {
    game.resumeGame();
}

function goHome() {
    game.goHome();
}

function playButtonClick() {
    game.playButtonClick();
}

function filterLeaderboard(difficulty) {
    game.filterLeaderboard(difficulty);
}

function copyShareUrl() {
    game.copyShareUrl();
}

function shareToTwitter() {
    game.shareToTwitter();
}

function handleCardKeydown(event, difficulty) {
    game.handleCardKeydown(event, difficulty);
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Check for highlighted game on load
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightGameId = urlParams.get('highlight');
    if (highlightGameId && window.sharedGameData) {
        game.showLeaderboard();
        setTimeout(() => {
            const gameElement = document.querySelector(`[data-game-id="${highlightGameId}"]`);
            if (gameElement) {
                gameElement.style.background = 'rgba(59, 130, 246, 0.3)';
                gameElement.style.border = '2px solid var(--color-primary)';
                gameElement.style.animation = 'highlight-pulse 2s ease-in-out infinite alternate';
                gameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1000);
    }
});