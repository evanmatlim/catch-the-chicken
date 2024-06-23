
// Document elements
let startMenu = document.getElementById("start-menu");
let startButton = document.getElementById("start-button");
let restartMenu = document.getElementById("lose-menu");
let restartButton = document.getElementById("lose-button");
let winMenu = document.getElementById("win-menu");
let winButton = document.getElementById("win-button");
let winMessage = document.getElementById("win-message");
let overlayContainer = document.getElementById("overlay-container");
let opacityFilter = document.getElementById("opacity-filter");
let countdownTimer = document.getElementById("countdown-timer");
let gameTimer = document.getElementById("timer");
let character = document.getElementById("character");
let gameSpace = document.getElementById("game-space");
let chicken = document.getElementById("chicken");

// Document values
let characterWidth = character.offsetWidth;
let characterHeight = character.offsetHeight;
let gameSpaceWidth = gameSpace.offsetWidth;
let gameSpaceHeight = gameSpace.offsetHeight;

// Internal game variables
let gameIsRunning = false;
const TIME_LIMIT = 15; // change this for different time settings
let time;
let timerID;
let stillHovering = false;
let characterX, characterY;

// Misc. setup
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
startButton.addEventListener('click', startGame, false);
restartButton.addEventListener('click', startGame, false);
winButton.addEventListener('click', startGame, false);
resetCharacterPosition();


async function startGame() {
    startMenu.style.display = "None";
    restartMenu.style.display = "None";
    winMenu.style.display = "None";
    chicken.style.display = "block";
    overlayContainer.style.cursor = "grab";
    resetCharacterPosition();
    resetGameTimer();
    await startCountdown();
    overlayContainer.style.display = "None";
    overlayContainer.style.cursor = "default";
    gameIsRunning = true;

    timerID = setInterval(moveGameTimer, 1000);
    character.addEventListener('mouseover', moveCharacter, false);
    chicken.addEventListener('mousedown', displayWin, false);
    // character.addEventListener('mousedown', pauseTimer, false); // testing pause
}

//testing pause
function pauseTimer() {
    gameIsRunning = !gameIsRunning;
}

async function resetCharacterPosition() {
    gameSpaceWidth = gameSpace.offsetWidth;
    gameSpaceHeight = gameSpace.offsetHeight;
    character.style.transitionDuration = "0s";
    characterX = (gameSpaceWidth - characterWidth)/2 + "px";
    characterY = (gameSpaceHeight - characterHeight)/2 + "px";
    character.style.marginLeft = characterX;
    character.style.marginTop = characterY;
    await pause(200);
    character.style.transitionDuration = "0.2s";
}

let moving = false;
async function moveCharacter() {
    if (gameIsRunning && !moving) {
        moving = true;
        gameSpaceWidth = gameSpace.offsetWidth;
        gameSpaceHeight = gameSpace.offsetHeight;

        //change position
        characterX = getNewPosition(true);
        characterY = getNewPosition(false);
        character.style.marginLeft = characterX + "px";
        character.style.marginTop = characterY + "px";
        // gameSpace.style.cursor = "grabbing";
        await pause(200);
        // gameSpace.style.cursor = "grab";
        moving = false;
    }
}

function getNewPosition(isX) {
    if (isX) {
        let newX = getRandomInt(gameSpaceWidth - characterWidth);
        while (Math.abs(newX - characterX) < characterWidth || Math.abs(newX - characterX) > 1.5 * characterWidth) {
        // while (Math.abs(newX - characterX) < characterWidth) {
            newX = getRandomInt(gameSpaceWidth - characterWidth);
        }
        return newX;
    } else {
        let newY = getRandomInt(gameSpaceHeight - characterHeight);
        // while (Math.abs(newY - characterY) < characterHeight || Math.abs(newY - characterY) > 3 * characterHeight) {
        // while (Math.abs(newY - characterY) < characterHeight) {
        //     newY = getRandomInt(gameSpaceHeight - characterHeight);
        // }
        return newY;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomizeColor() {
    character.style.backgroundColor = "rgb(" + getRandomInt(256) + "," + getRandomInt(256) + "," + getRandomInt(256) + ")";
}

async function startCountdown() {
    countdownTimer.innerHTML = "3"
    await pause(1000);
    countdownTimer.innerHTML = "2";
    await pause(1000);
    countdownTimer.innerHTML = "1";
    await pause(1000);
    countdownTimer.innerHTML = "Go!";
    await pause(1000);
    countdownTimer.innerHTML = "";
}

function resetGameTimer() {
    clearTimeout(timerID);
    time = TIME_LIMIT;
    if (time > 59) gameTimer.innerHTML = Math.floor(time/60) + ":" + time % 60;
    else if (time > 9) gameTimer.innerHTML = "0:" + time;
    else gameTimer.innerHTML = "0:0" + time;
    gameTimer.style.color = "var(--blackText)";
}

function moveGameTimer() {
    if (gameIsRunning) {
        time -= 1;
        if (time == 10) gameTimer.style.color = "Red";
        if (time > 59) gameTimer.innerHTML = Math.floor(time/60) + ":" + time % 60;
        else if (time > 9) gameTimer.innerHTML = "0:" + time;
        else gameTimer.innerHTML = "0:0" + time;
    }
    if (time == 0) {
        clearTimeout(timerID);
        gameIsRunning = false;
        displayRestart();
    }
}

function displayRestart() {
    overlayContainer.style.display = "flex";
    restartMenu.style.display = "flex";
}

function displayWin() {
    gameIsRunning = false;
    overlayContainer.style.display = "flex";
    winMenu.style.display = "flex";
    if (TIME_LIMIT - time + 1 == 1) winMessage.innerHTML = "Incredible!<br>You grabbed the chicken<br>in "+(TIME_LIMIT - time + 1)+" second"; 
    else winMessage.innerHTML = "Nice job!<br>You grabbed the chicken<br>in "+(TIME_LIMIT - time + 1)+" seconds"; 
}