title = "Simon Says";

description = `
`;

characters = [];

// Going with default size of 100x100 for the sake of simplicity
options = {};

const colorPool = ["black", "red", "green", "blue", "yellow", "purple"];

// Use a set to ensure that the colors shown to the player will all be unique
const randomColors = new Set();
// Use a corresponding array for easy access later
let randomColorArray = [];

let promptColors = [];
let roundScore = 0;

let ticksSinceLastRound = 0;
const memorizationPeriodTicks = 180;
const roundTickLimit = 300;

function randomizeColors() {
  randomColors.clear();
  promptColors = [];
  while (randomColors.size < 4) {
    randomColors.add(colorPool[Math.floor(Math.random() * colorPool.length)]);
  }
  
  randomColorArray = Array.from(randomColors);

  while (promptColors.length < 5) {
    promptColors.push(randomColorArray[Math.floor(Math.random() * randomColorArray.length)]);
  }
}

function startNewRound() {
  ticksSinceLastRound = 0;
  roundScore = 0;
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
    if (i >= roundScore) {
      color(promptColors[i]);
    }
    text(`${promptColors[i]} ${i < promptColors.length - 1 ? "then" : ""}`, 15, 30 + 15 * i);
  }
}

function tallyRoundScore(colorIndex) {
  if (promptColors[roundScore] == randomColorArray[colorIndex]) {
    roundScore++;
  }
  else {
    end("WRONG!");
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
  else if (ticksSinceLastRound < memorizationPeriodTicks) {
    drawColors();
  }
  else {
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

  ++ticksSinceLastRound;
  if (ticksSinceLastRound >= memorizationPeriodTicks + roundTickLimit) {
    end("Gotta go faster!");
  }
}
