title = "Simon Says";

description = `
`;

characters = [];

// Going with default size of 100x100 for the sake of simplicity
// Game is color-based -- sticking with the default theme for consistency
options = {};

const colorPool = ["black", "red", "green", "blue", "yellow", "purple"];

// Use a set to ensure that the colors shown to the player will all be unique
const randomColors = new Set();
// Use a corresponding array for easy access later
let randomColorArray = [];

let promptColors = [];
let missed = false;
let roundScore = 0;

let ticksSinceLastRound = 0;
const memorizationPeriodTicks = 180;
const roundTickLimit = 300;

function randomizeColors() {
  randomColors.clear();
  promptColors = [];
  while (randomColors.size < 4) {
    randomColors.add(colorPool[rndi(0, colorPool.length)]);
  }
  
  randomColorArray = Array.from(randomColors);

  while (promptColors.length < 5) {
    promptColors.push(randomColorArray[rndi(0, randomColorArray.length)]);
  }
}

function startNewRound() {
  ticksSinceLastRound = 0;
  roundScore = 0;
  missed = false;
  randomizeColors();
  drawColors();
}

function drawColors() {
  color(randomColorArray[0]);
  rect(10, 10, 35, 35);

  color(randomColorArray[1]);
  rect(90, 10, -35, 35);

  color(randomColorArray[2]);
  rect(10, 90, 35, -35);

  color(randomColorArray[3]);
  rect(90, 90, -35, -35);
}

function displayPrompt() {
  color('black');
  text("Simon says...", 15, 15);

  for (let i = 0; i < promptColors.length; ++i) {
    color(i >= roundScore ? promptColors[i] : "transparent");
    text(`${promptColors[i]} ${i < promptColors.length - 1 ? "then" : ""}`, 15, 30 + 15 * i);
  }
}

function tallyRoundScore(colorIndex) {
  if (promptColors[roundScore] == randomColorArray[colorIndex]) {
    roundScore++;
  }
  else {
    missed = true;
  }

  if (roundScore >= promptColors.length) {
    addScore(1);
    startNewRound();
  }
}

function update() {
  if (!ticks) {
    // Initial frame here, since ticks == 0 (???)
    startNewRound();
  }
  else if (missed) {
    end("WRONG!");
  }
  else if (ticksSinceLastRound < memorizationPeriodTicks) {
    drawColors();
  }
  else if (ticksSinceLastRound < memorizationPeriodTicks + roundTickLimit) {
    displayPrompt();
    if (input.isJustPressed) {
      if (input.pos.x < 50) {
        if (input.pos.y < 50) {
          console.log("Pressed on upper-left quadrant!");
          console.log(`Corresponding color: ${randomColorArray[0]}`);
          tallyRoundScore(0);
        }
        else {
          console.log("Pressed on lower-left quadrant!");
          console.log(`Corresponding color: ${randomColorArray[2]}`);
          tallyRoundScore(2);
        }
      }
      else {
        if (input.pos.y < 50) {
          console.log("Pressed on upper-right quadrant!");
          console.log(`Corresponding color: ${randomColorArray[1]}`);
          tallyRoundScore(1);
        }
        else {
          console.log("Pressed on lower-right quadrant!");
          console.log(`Corresponding color: ${randomColorArray[3]}`);
          tallyRoundScore(3);
        }
      }
    }
  }
  else {
    end("TOO SLOW!");
  }
  
  ++ticksSinceLastRound;
}
