const terminalContent = document.getElementById('terminal-content');

const terminalData = [
    { type: 'line', keyword: 'const', variable: ' developer', operator: ' = {' },
    { type: 'line', indent: '    ', property: 'name:', string: ' "Александр Стамчук"', comma: ',' },
    { type: 'line', indent: '    ', property: 'skills:', bracket: ' [' },
    { type: 'line', indent: '        ', string: '"Java"', comma: ',', comment: ' // 3 года' },
    { type: 'line', indent: '        ', string: '"Python"', comment: ' // 2 года' },
    { type: 'line', indent: '    ', bracket: ']' },
    { type: 'line', bracket: '};' },
];

let lineIndex = 0;

function typeTerminalLine() {
    if (lineIndex < terminalData.length) {
        const line = terminalData[lineIndex];
        const lineElement = document.createElement('div');
        lineElement.className = 'terminal-line';
        
        let html = '';
        
        if (line.indent) html += `<span class="output">${line.indent}</span>`;
        if (line.keyword) html += `<span class="keyword">${line.keyword}</span>`;
        if (line.variable) html += `<span class="variable">${line.variable}</span>`;
        if (line.operator) html += `<span class="operator">${line.operator}</span>`;
        if (line.property) html += `<span class="property">${line.property}</span>`;
        if (line.string) html += `<span class="string">${line.string}</span>`;
        if (line.comma) html += `<span class="comma">${line.comma}</span>`;
        if (line.bracket) html += `<span class="bracket">${line.bracket}</span>`;
        if (line.comment) html += `<span class="comment">${line.comment}</span>`;
        
        lineElement.innerHTML = html;
        lineElement.style.animationDelay = '0s';
        terminalContent.appendChild(lineElement);
        
        lineIndex++;
        setTimeout(typeTerminalLine, 80);
    }
}

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.querySelector('.matrix-bg').appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const brightness = Math.random();
            if (brightness > 0.95) {
                ctx.fillStyle = '#00ffff';
            } else if (brightness > 0.85) {
                ctx.fillStyle = '#00ff88';
            } else {
                ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, ${50 + Math.random() * 80}, ${0.8 + Math.random() * 0.2})`;
            }
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.addEventListener('load', () => {
    createMatrixRain();
    setTimeout(typeTerminalLine, 500);
});


function animateCPU() {
    const cpuElement = document.getElementById('cpu');
    const ramElement = document.getElementById('ram');
    
    setInterval(() => {
        const cpu = Math.floor(Math.random() * 30) + 20;
        const ram = Math.floor(Math.random() * 40) + 30;
        cpuElement.textContent = cpu;
        ramElement.textContent = ram;
    }, 2000);
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = 1 + Math.random() * 3;
        const colors = ['#00ff88', '#00ffff', '#ff00ff', '#ffff00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.6 + 0.3;
        particlesContainer.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(20px, -20px);
            }
            50% {
                transform: translate(-20px, 20px);
            }
            75% {
                transform: translate(20px, 20px);
            }
        }
    `;
    document.head.appendChild(style);
}

let gameActive = false;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let playerCanMove = true;

function initTerminalInput() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const terminalContentDiv = document.getElementById('terminal-content');
    
    terminalInput.focus();
    
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            
            if (command) {
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.innerHTML = `<span class="prompt-symbol">root@stamchuk:~$</span> <span class="user-command">${command}</span>`;
                terminalContentDiv.appendChild(commandLine);
                
                let response;
                if (gameActive) {
                    response = handleGameMove(command);
                } else {
                    response = processCommand(command);
                }
                
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.innerHTML = response;
                terminalContentDiv.appendChild(responseLine);
                
                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }
    });
}

function processCommand(cmd) {
    const command = cmd.toLowerCase();
    
    if (command === 'help' || command === 'помощь') {
        return `<span class="success">Доступные команды:</span><br>
                <span class="output">  help - показать эту справку</span><br>
                <span class="output">  about - информация обо мне</span><br>
                <span class="output">  skills - мои навыки</span><br>
                <span class="output">  telegram - мои ссылки Telegram</span><br>
                <span class="output">  game - играть в крестики-нолики</span><br>
                <span class="output">  clear - очистить консоль</span>`;
    }
    
    if (command === 'about') {
        return `<span class="keyword">const</span> <span class="variable">developer</span> <span class="operator">=</span> <span class="bracket">{</span><br>
                <span class="output">    </span><span class="property">name:</span> <span class="string">"Александр Стамчук"</span><span class="comma">,</span><br>
                <span class="output">    </span><span class="property">age:</span> <span class="string">"17 лет"</span><br>
                <span class="bracket">};</span>`;
    }
    
    if (command === 'skills' || command === 'навыки') {
        return `<span class="string">"Java"</span> <span class="comment">// 3 года</span><br>
                <span class="string">"Python"</span> <span class="comment">// 2 года</span>`;
    }
    
    if (command === 'telegram' || command === 'tg') {
        return `<span class="property">telegram:</span> <span class="bracket">{</span><br>
                <span class="output">    </span><span class="property">channel:</span> <span class="string">"https://t.me/SanyaCyber"</span><span class="comma">,</span><br>
                <span class="output">    </span><span class="property">studio:</span> <span class="string">"https://t.me/StamStuido"</span><span class="comma">,</span><br>
                <span class="output">    </span><span class="property">personal:</span> <span class="string">"https://t.me/Stamchuk"</span><br>
                <span class="bracket">}</span>`;
    }
    
    if (command === 'game' || command === 'игра') {
        gameActive = true;
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        return startGame();
    }
    

    
    if (command === 'clear' || command === 'cls') {
        document.getElementById('terminal-content').innerHTML = '';
        gameActive = false;
        return '';
    }
    
    return `<span class="comment">Команда не найдена: ${cmd}</span><br>
            <span class="output">Введите </span><span class="keyword">help</span><span class="output"> для списка команд</span>`;
}

function startGame() {
    const gameHtml = `<span class="success">🎮 Крестики-нолики!</span><br>
            <span class="output">Ты играешь за X, я за O. Кликай на клетку!</span><br><br>
            ${drawClickableBoard()}<br>
            <button class="game-exit-btn" onclick="exitGame()">Выйти из игры</button>`;
    return gameHtml;
}

function drawClickableBoard() {
    let html = '<div class="ttt-board">';
    for (let i = 0; i < 9; i++) {
        const cell = gameBoard[i];
        let cellClass = 'ttt-cell';
        let cellContent = '';
        let onclick = '';
        
        if (cell === 'X') {
            cellClass += ' ttt-x';
            cellContent = 'X';
        } else if (cell === 'O') {
            cellClass += ' ttt-o';
            cellContent = 'O';
        } else {
            cellClass += ' ttt-empty';
            onclick = `onclick="makeMove(${i})"`;
        }
        
        html += `<div class="${cellClass}" ${onclick}>${cellContent}</div>`;
    }
    html += '</div>';
    return html;
}

function makeMove(index) {
    if (!gameActive || !playerCanMove || gameBoard[index] !== '') return;
    
    gameBoard[index] = 'X';
    playerCanMove = false;
    
    if (checkWinner('X')) {
        gameActive = false;
        updateGameBoard();
        showGameMessage('<span class="success">🎉 Ты победил!</span>');
        return;
    }
    
    if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        updateGameBoard();
        showGameMessage('<span class="output">Ничья!</span>');
        return;
    }
    
    updateGameBoard();
    
    setTimeout(() => {
        botMove();
        
        if (checkWinner('O')) {
            gameActive = false;
            updateGameBoard();
            showGameMessage('<span class="comment">Я победил! 😎</span>');
            return;
        }
        
        if (gameBoard.every(cell => cell !== '')) {
            gameActive = false;
            updateGameBoard();
            showGameMessage('<span class="output">Ничья!</span>');
            return;
        }
        
        updateGameBoard();
        playerCanMove = true;
    }, 600);
}

function updateGameBoard() {
    const board = document.querySelector('.ttt-board');
    if (board) {
        board.outerHTML = drawClickableBoard();
    }
}

function showGameMessage(message) {
    const terminalContentDiv = document.getElementById('terminal-content');
    const msgLine = document.createElement('div');
    msgLine.className = 'terminal-line';
    msgLine.innerHTML = message + '<br><button class="game-restart-btn" onclick="restartGame()">Играть снова</button>';
    terminalContentDiv.appendChild(msgLine);
    
    const terminalBody = document.getElementById('terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function restartGame() {
    gameActive = true;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    playerCanMove = true;
    
    const oldBoards = document.querySelectorAll('.ttt-board');
    oldBoards.forEach(board => {
        const parent = board.closest('.terminal-line');
        if (parent) parent.remove();
    });
    
    const oldButtons = document.querySelectorAll('.game-exit-btn, .game-restart-btn');
    oldButtons.forEach(btn => {
        const parent = btn.closest('.terminal-line');
        if (parent) parent.remove();
    });
    
    const terminalContentDiv = document.getElementById('terminal-content');
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';
    responseLine.innerHTML = startGame();
    terminalContentDiv.appendChild(responseLine);
    
    const terminalBody = document.getElementById('terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function exitGame() {
    gameActive = false;
    
    const oldBoards = document.querySelectorAll('.ttt-board');
    oldBoards.forEach(board => {
        const parent = board.closest('.terminal-line');
        if (parent) parent.remove();
    });
    
    const oldButtons = document.querySelectorAll('.game-exit-btn, .game-restart-btn');
    oldButtons.forEach(btn => {
        const parent = btn.closest('.terminal-line');
        if (parent) parent.remove();
    });
    
    const terminalContentDiv = document.getElementById('terminal-content');
    const msgLine = document.createElement('div');
    msgLine.className = 'terminal-line';
    msgLine.innerHTML = '<span class="output">Игра завершена!</span>';
    terminalContentDiv.appendChild(msgLine);
    
    const terminalBody = document.getElementById('terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function handleGameMove(input) {
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'выход') {
        gameActive = false;
        return `<span class="output">Игра завершена!</span>`;
    }
    return `<span class="comment">// Кликай на клетки мышкой!</span>`;
}

function botMove() {
    const winMove = findWinningMove('O');
    if (winMove !== -1) {
        gameBoard[winMove] = 'O';
        return;
    }
    
    const blockMove = findWinningMove('X');
    if (blockMove !== -1) {
        gameBoard[blockMove] = 'O';
        return;
    }
    
    if (gameBoard[4] === '') {
        gameBoard[4] = 'O';
        return;
    }
    
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameBoard[i] === '');
    if (availableCorners.length > 0) {
        gameBoard[availableCorners[Math.floor(Math.random() * availableCorners.length)]] = 'O';
        return;
    }
    
    const availableMoves = gameBoard.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
    if (availableMoves.length > 0) {
        gameBoard[availableMoves[Math.floor(Math.random() * availableMoves.length)]] = 'O';
    }
}

function findWinningMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const cells = [gameBoard[a], gameBoard[b], gameBoard[c]];
        const playerCount = cells.filter(cell => cell === player).length;
        const emptyCount = cells.filter(cell => cell === '').length;
        
        if (playerCount === 2 && emptyCount === 1) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    
    return -1;
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === player);
    });
}

function startHackSimulation() {
    const terminalContentDiv = document.getElementById('terminal-content');
    const terminalInput = document.getElementById('terminal-input');
    terminalInput.disabled = true;
    
    const hackSteps = [
        { text: '<span class="success">🔓 Инициализация системы взлома...</span>', delay: 500 },
        { text: '<span class="output">Подключение к удаленному серверу...</span>', delay: 800 },
        { text: '<span class="keyword">Connecting to 192.168.1.1:8080...</span>', delay: 600 },
        { text: '<span class="success">✓ Соединение установлено</span>', delay: 700 },
        { text: '<span class="output">Сканирование портов...</span>', delay: 500 },
        { text: '<span class="keyword">PORT 22: OPEN | PORT 80: OPEN | PORT 443: OPEN</span>', delay: 900 },
        { text: '<span class="output">Поиск уязвимостей...</span>', delay: 600 },
        { text: '<span class="comment">// Найдено: SQL Injection, XSS, CSRF</span>', delay: 800 },
        { text: '<span class="output">Обход аутентификации...</span>', delay: 700 },
        { text: '<span class="string">admin:admin</span> <span class="comment">// Попытка 1...</span>', delay: 400 },
        { text: '<span class="string">root:toor</span> <span class="comment">// Попытка 2...</span>', delay: 400 },
        { text: '<span class="string">admin:password123</span> <span class="comment">// Попытка 3...</span>', delay: 400 },
        { text: '<span class="success">✓ Доступ получен!</span>', delay: 1000 },
        { text: '<span class="output">Загрузка данных...</span>', delay: 500 },
        { text: '<span class="keyword">████████████████████] 100%</span>', delay: 800 },
        { text: '<span class="output">Извлечение файлов...</span>', delay: 600 },
        { text: '<span class="string">database.sql</span> <span class="success">✓</span>', delay: 300 },
        { text: '<span class="string">users.json</span> <span class="success">✓</span>', delay: 300 },
        { text: '<span class="string">config.php</span> <span class="success">✓</span>', delay: 300 },
        { text: '<span class="output">Очистка следов...</span>', delay: 700 },
        { text: '<span class="success">✓ Логи удалены</span>', delay: 500 },
        { text: '<span class="success">✓ История очищена</span>', delay: 500 },
        { text: '<span class="output">Отключение от сервера...</span>', delay: 600 },
        { text: '<span class="success">════════════════════════════════════</span>', delay: 300 },
        { text: '<span class="success">🎉 ВЗЛОМ ЗАВЕРШЕН УСПЕШНО!</span>', delay: 500 },
        { text: '<span class="success">════════════════════════════════════</span>', delay: 300 }
    ];
    
    let currentStep = 0;
    
    function displayNextStep() {
        if (currentStep < hackSteps.length) {
            const step = hackSteps[currentStep];
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = step.text;
            terminalContentDiv.appendChild(line);
            
            const terminalBody = document.getElementById('terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            currentStep++;
            setTimeout(displayNextStep, step.delay);
        } else {
            terminalInput.disabled = false;
            terminalInput.focus();
        }
    }
    
    displayNextStep();
}

function createFloatingCode() {
    const codeSnippets = [
        'if (success) {',
        'return true;',
        'console.log();',
        'function hack() {',
        'const x = 42;',
        '} catch (e) {',
        'async await',
        'import { }',
        '=> { }',
        'while (true)',
        '{ code }',
        '[ data ]',
        '0x00FF88',
        'sudo rm -rf',
        'git push',
    ];
    
    const colors = ['#00ff88', '#00ffff', '#ff00ff', '#ffff00'];
    
    setInterval(() => {
        const snippet = document.createElement('div');
        snippet.className = 'floating-code';
        snippet.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        snippet.style.left = Math.random() * 100 + '%';
        snippet.style.animationDuration = (6 + Math.random() * 6) + 's';
        snippet.style.fontSize = (0.75 + Math.random() * 0.5) + 'rem';
        snippet.style.color = colors[Math.floor(Math.random() * colors.length)];
        snippet.style.textShadow = `0 0 10px ${snippet.style.color}`;
        document.body.appendChild(snippet);
        
        setTimeout(() => snippet.remove(), 12000);
    }, 3000);
}



window.addEventListener('load', () => {
    createMatrixRain();
    createParticles();
    createFloatingCode();
    animateCPU();
    setTimeout(() => {
        typeTerminalLine();
        setTimeout(() => {
            initTerminalInput();
        }, terminalData.length * 80 + 1000);
    }, 500);
});
