// Creates arena for grid method
function addDivs(number) {
  let area = document.getElementById('area')
  for(let i = 1; i <= number; i++) {
    let newDiv = document.createElement('div')
    newDiv.id = `box-${i}`
    newDiv.className = 'grid-piece'
    // This crazy if statement determines the white borders
    if (mapSize == 'large') {
      if(i <= 180 || i >= (number - 179) || i % 180 == 0 || (i - 1) % 180 == 0){
        newDiv.style.background = 'white'
      }
    } else if (mapSize == 'medium') {
      if(i <= 130 || i >= (number - 129) || i % 130 == 0 || (i - 1) % 130 == 0){
        newDiv.style.background = 'white'
      }
    } else {
      if(i <= 100 || i >= (number - 99) || i % 100 == 0 || (i - 1) % 100 == 0){
        newDiv.style.background = 'white'
      }
    }
    area.append(newDiv)
  }
}

let numberOfDivs;
let gridUp;
let gridDown;
let gridLeft;
let gridRight;

// Sets initial movement direction and gridDirection values
const setDirection = (method) => {
  let random = Math.floor(Math.random() * 4)
  let result;
  if (method == 'grid') {
    gridLeft = -1
    gridRight = 1
    if (mapSize == 'large') {
      redPlayer.boxDirec = gridDown;
      bluePlayer.boxDirec = gridDown;
      greenPlayer.boxDirec = gridUp;
      orangePlayer.boxDirec = gridUp;
      redPlayer.boxNum = 200
      bluePlayer.boxNum = 340
      greenPlayer.boxNum = 19500
      orangePlayer.boxNum = 19380
    } else if (mapSize == 'medium') {
      redPlayer.boxDirec = gridDown;
      bluePlayer.boxDirec = gridUp;
      greenPlayer.boxDirec = gridUp;
      orangePlayer.boxDirec = gridDown;
      redPlayer.boxNum = 150
      bluePlayer.boxNum = 13500
      greenPlayer.boxNum = 13440
      orangePlayer.boxNum = 210
    } else {
      redPlayer.boxDirec = gridDown;
      bluePlayer.boxDirec = gridUp;
      greenPlayer.boxDirec = gridUp;
      orangePlayer.boxDirec = gridDown;
      redPlayer.boxNum = 110
      bluePlayer.boxNum = 9890
      greenPlayer.boxNum = 9830
      orangePlayer.boxNum = 160
    }
  } else {
    gridUp = 'up'
    gridDown = 'down'
    gridLeft = 'left'
    gridRight = 'right'
  }
}

// Blueprint for all four players
class Player {
  constructor(box, color, name) {
    this.boxNum = box;
    this.boxArr = [];
    this.boxColor = color;
    this.name = name;
    this.boxDirec = undefined;
    this.buttons = 0;
    this.kills = 0;
    this.points = 0;
    this.growth = 0;
    this.potential = 10;
    this.wins = 0;
    this.status = undefined;
    this.pixelCoor = { // x is left and right, y is up and down
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 500)
    };
  }
}

// Create four players based off class blueprint above
let redPlayer = new Player(200, 'red', 'Red')
let bluePlayer = new Player(340, 'blue', 'Blue')
let greenPlayer = new Player(19500, 'green', 'Green')
let orangePlayer = new Player(19380, 'orange', 'Green')
let playerArr = [redPlayer, bluePlayer, greenPlayer, orangePlayer]

let numberOfPlayers;
let activePlayers;
let firstTo;
let lastRoundWinner;
let gameType;
let gameSpeed;
let rounds;
let death;
let highScore = 0;
let tailScore = 0;
let mapSize;

/// BUG REPORT ///
// Setting to Infinite changes the start position for some reason

// jQuery to change the CSS grid template of area div
$( "#settings" ).on( "click", function() {
  console.log('jquery!')
  let mapSetting = document.getElementById('arena-size').value

  if (mapSetting != mapSize) {
    mapSize = mapSetting
    let areaDiv = document.getElementById('area')
    $('.grid-piece').remove();
    if (mapSize == 'large') {
      console.log('this is large')
      gridDown = 180
      gridUp = -180
      numberOfDivs = 180 * 110
      $('#area').css( "grid-template-columns", "repeat(180, 6px)" );
      $('#area').css( "grid-template-rows", "repeat(110, 6px)" );
      addDivs(110 * 180);
    } else if (mapSize == 'medium') {
      console.log('this is medium')
      gridDown = 130
      gridUp = -130
      numberOfDivs = 105 * 130
      $('#area').css( "grid-template-columns", "repeat(130, 6px)" );
      $('#area').css( "grid-template-rows", "repeat(105, 6px)" );
      addDivs(105 * 130);
    } else {
      console.log('this is small')
      gridDown = 100
      gridUp = -100
      numberOfDivs = 100 * 100
      $('#area').css( "grid-template-columns", "repeat(100, 6px)" );
      $('#area').css( "grid-template-rows", "repeat(100, 6px)" );
      addDivs(100 * 100);
    }
    mapSize = mapSetting
    console.log(areaDiv)
  }
});

const setAndStart = (menu) => {

  if (menu == 0) {
    rounds = 1;

    playerArr.forEach(player => {
      player.kills = 0
      player.wins = 0
      player.growth = 0
      player.buttons = 0
      player.points = 0
      player.potential = 10
    })

    gameSpeed = Number(document.getElementById('game-speed').value)
    let players = Number(document.getElementById('player-count').value)
    let arenaSize = document.getElementById('arena-size').value
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('controls').style.visibility = 'visible'
    firstTo = document.getElementById('first-to').value
    gameType = document.getElementById('tail-length').value
    activePlayers = players
    players > 0 ? document.getElementById('red-para').style.visibility = 'visible' : undefined
    players > 1 ? document.getElementById('blue-para').style.visibility = 'visible' : undefined
    players > 2 ? document.getElementById('green-para').style.visibility = 'visible' : undefined
    players > 3 ? document.getElementById('orange-para').style.visibility = 'visible' : undefined
    howManyPlayers(players)
  } else if (menu == 1){
    document.getElementById('controls').style.visibility = 'hidden'
    document.getElementById('red-para').style.visibility = 'hidden'
    document.getElementById('blue-para').style.visibility = 'hidden'
    document.getElementById('green-para').style.visibility = 'hidden'
    document.getElementById('orange-para').style.visibility = 'hidden'
    redPlayer.name = document.getElementById('red-name').value
    bluePlayer.name = document.getElementById('blue-name').value
    greenPlayer.name = document.getElementById('green-name').value
    orangePlayer.name = document.getElementById('orange-name').value
    movePlayers('grid')
  } else {
    document.getElementById('stats').style.visibility = 'hidden'
    document.getElementById('red-stats').style.visibility = 'hidden'
    document.getElementById('blue-stats').style.visibility = 'hidden'
    document.getElementById('green-stats').style.visibility = 'hidden'
    document.getElementById('orange-stats').style.visibility = 'hidden'
    document.getElementById('menu').style.visibility = 'visible'
  }
}

const howManyPlayers = (num) => {
  numberOfPlayers = num;
  if (num >= 1) {
    redPlayer.status = true;
    if (num > 1) {
      bluePlayer.status = true;
      if (num > 2) {
        greenPlayer.status = true;
        if (num > 3) {
          orangePlayer.status = true;
        }
      }
    }
  }
}

// Key presses to change direction
document.onkeydown = function(key) {

  switch (key.keyCode) {
    case 87: // Key: W, -100 represents up
      redPlayer.boxDirec = gridUp
      redPlayer.buttons++
      break;
    case 83: // Key: S, 100 represents down
      redPlayer.boxDirec = gridDown
      redPlayer.buttons++
      break;
    case 65: // Key: A, -1 represents left
      redPlayer.boxDirec = gridLeft
      redPlayer.buttons++
      break;
    case 68: // Key: D, 1 represents right
      redPlayer.boxDirec = gridRight
      redPlayer.buttons++
      break;
    case 38: // Key: Up
      bluePlayer.boxDirec = gridUp
      bluePlayer.buttons++
      break;
    case 40: // Key: Down
      bluePlayer.boxDirec = gridDown
      bluePlayer.buttons++
      break;
    case 37: // Key: Left
      bluePlayer.boxDirec = gridLeft
      bluePlayer.buttons++
      break;
    case 39: // Key: Right
      bluePlayer.boxDirec = gridRight
      bluePlayer.buttons++
      break;

    case 89: // Key: Y, -100 represents up
      greenPlayer.boxDirec = gridUp
      greenPlayer.buttons++
      break;
    case 72: // Key: H, 100 represents down
      greenPlayer.boxDirec = gridDown
      greenPlayer.buttons++
      break;
    case 71: // Key: G, -1 represents left
      greenPlayer.boxDirec = gridLeft
      greenPlayer.buttons++
      break;
    case 74: // Key: J, 1 represents right
      greenPlayer.boxDirec = gridRight
      greenPlayer.buttons++
      break;
    case 80: // Key: P
      orangePlayer.boxDirec = gridUp
      orangePlayer.buttons++
      break;
    case 186: // Key: :
      orangePlayer.boxDirec = gridDown
      orangePlayer.buttons++
      break;
    case 76: // Key: L
      orangePlayer.boxDirec = gridLeft
      orangePlayer.buttons++
      break;
    case 222: // Key: "
      orangePlayer.boxDirec = gridRight
      orangePlayer.buttons++
      break;
    default:
      console.log('error')
      break;
  };
}

const movePlayers = (style = 'grid') => {
  if (style == 'grid') {
    if (!gameStarted) {
      gameStarted = true; // Do this one time at start of game
      setDirection('grid');
      activePlayers == 1 ? firstTo = 1 : undefined
    }
    redPlayer.status ? moveOne(redPlayer) : undefined // Start moving players
    bluePlayer.status ? moveOne(bluePlayer) : undefined
    greenPlayer.status ? moveOne(greenPlayer) : undefined
    orangePlayer.status ? moveOne(orangePlayer) : undefined
    anotherPause('grid')
    // The else is all pixel method related
  } else {
    if (!gameStarted) {
      gameStarted = true;
      // document.getElementsByClassName("red-pixel")[0].style.display = 'block';
      // document.getElementsByClassName("blue-pixel")[0].style.display = 'block';
      bluePlayer.boxDirec = setRandomDirection(bluePlayer, 'pixel')
      redPlayer.boxDirec = setRandomDirection(redPlayer, 'pixel')
      console.log('testpixel')
    }
    redPlayer.status ? movePixel(redPlayer) : undefined
    bluePlayer.status ? movePixel(bluePlayer) : undefined
    anotherPause('pixel')
  }
}

// Grid movement method
const moveOne = (player) => {
  let currentBox = document.getElementById(`box-${player.boxNum}`)
  let moveTo = document.getElementById(`box-${player.boxNum + player.boxDirec}`)
  player.boxArr.push(moveTo)
  player.growth++
  // console.log(`box-${player.boxNum + player.boxDirec}`)
  if(checkCollisionGrid(player, moveTo)) {
    moveTo.style.background = player.boxColor;
    player.boxNum += player.boxDirec
    if (gameType == 'finite' && player.boxArr.length > player.potential) {
      player.boxArr[0].style.background = 'black'
      player.boxArr.shift()
    }
  } else {
    numberOfPlayers == 1 ? exitAnotherPause = true : undefined
  }
}

const checkCollisionGrid = (player, checkDiv) => {
  let nonLethal = false;
  let hit = checkDiv.style.background
  if (hit == 'red' || hit == 'blue' || hit == 'green' || hit == 'orange' || hit == 'white' || hit == 'purple') {
    if (player.boxColor != hit && hit != 'white') {
      switch (hit) {
        case 'red':
          redPlayer.kills++
          break;
        case 'blue':
          bluePlayer.kills++
          break;
        case 'green':
          greenPlayer.kills++
          break;
        case 'orange':
          orangePlayer.kills++
          break;
        case 'purple':
          nonLethal = true;
          player.potential += 2
          foodOnArea--
          console.log('food')
          return true;
          break;
        default:
          console.log('error')
          break;
      }
    } else if (hit == 'white') {
      death = 'Ran into border wall'
    } else {
      death = 'Ran into own tail'
    }

    if (numberOfPlayers > 1 && !nonLethal) {
      numberOfPlayers--
      player.status = false;
      removePlayer(player)
    }
    return false;
  }
  return true;
}

const removePlayer = (player) => {
  for (let i = 0; player.boxArr.length > 0; ) {
    if (player.boxArr[0].style.background == player.boxColor) {
      player.boxArr[0].style.background = 'black';
    }
    player.boxArr.shift()
  }
}

const removeFood = () => {
  foodOnArea = 0;
  for (let i = 0; foodArr.length > 0; ) {
    if (foodArr[0].style.background == 'purple') {
      foodArr[0].style.background = 'black';
    }
    foodArr.shift()
  }
}

let exitAnotherPause = false;
let gameStarted = false;
let chanceOfFood = 0;
let foodOnArea = 0;
let foodArr = []

const anotherPause = (style) => {
  if (!exitAnotherPause) {
    chanceOfFood++
    chanceOfFood > 150 ? chanceOfFood = 0 : undefined
    let oneInThree = Math.floor(Math.random() * 10)
    if (gameType == 'finite' && chanceOfFood > 100 && oneInThree < 3 && foodOnArea < 5) {
      console.log('this far')
      let random = Math.floor(Math.random() * numberOfDivs)
      let randomDiv = document.getElementById(`box-${random}`)
      if (randomDiv.style.background != 'white' &&
            randomDiv.style.background != 'red' &&
            randomDiv.style.background != 'blue' &&
            randomDiv.style.background != 'green' &&
            randomDiv.style.background != 'orange') {
        chanceOfFood = 0;
        foodOnArea++
        console.log('hey a random div!')
        randomDiv.style.background = 'purple'
        foodArr.push(randomDiv)
      }
    }
    setTimeout(()=> movePlayers(style), gameSpeed);
  } else {
    console.log('okay...')
    exitAnotherPause = false;
    checkWinner();
  }
}

const longerPause = (func, time) => {
  setTimeout(()=> func(), time);
}

const checkWinner = () => {
  for (let player of playerArr) {
    if (player.status == true) {
      console.log('are we...')
      player.wins++

      let rgbColor;
      let words;
      let winnerAnim = document.getElementById('winner-anim')
      lastRoundWinner = player;
      winnerAnim.style.display = 'block'

      if (player.boxColor == 'red') {
        rgbColor = [255,0,0]
        words = player.name
      } else if (player.boxColor == 'blue') {
        rgbColor = [0,0,255]
        words = player.name
      } else if (player.boxColor == 'green') {
        rgbColor = [8,205,8]
        words = player.name
      } else {
        rgbColor = [255,170,0]
        words = player.name
      }

      if (player.wins >= firstTo) {
        if (activePlayers == 1) {
          words = 'Game over.'
        } else {
          words = 'Game over.<br>' + words + ' VICTORY!'
        }
        setTimeout(()=> fadeThis(winnerAnim, words, [255,255,255], rgbColor, endGame), 2000);
        console.log('end?')
      } else {
        if (activePlayers == 1) {
          words = 'Game over.'
        } else {
          words = player.name + ' Wins!'
        }
        setTimeout(()=> fadeThis(winnerAnim, words, [255,255,255], rgbColor, nextRound), 2000);
      }
    }
  }
}

function fadeThis(element, words, startColor, finishColor, nextFunc, time = 1000) {
    element.innerHTML = words;
    let timer = setInterval(() => {
        if (startColor[0] == finishColor[0] && startColor[1] == finishColor[1] && startColor[2] == finishColor[2]) {
            clearInterval(timer);
            element.style.color = `rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`
            return longerPause(nextFunc, 1000)
        }
        element.style.color = `rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`
        if (startColor[0] !== finishColor[0]) { startColor[0] > finishColor[0] ? startColor[0] -= 1 : startColor[0] += 1 }
        if (startColor[1] !== finishColor[1]) { startColor[1] > finishColor[1] ? startColor[1] -= 1 : startColor[1] += 1 }
        if (startColor[2] !== finishColor[2]) { startColor[2] > finishColor[2] ? startColor[2] -= 1 : startColor[2] += 1 }
    }, .5);
}

const nextRound = () => {
  gameType == 'finite' ? playerArr.forEach(player => player.points += player.potential) : undefined
  let displayRound = document.getElementById('winner-anim')
  activePlayers == 1 ? removeFood() : undefined
  removePlayer(lastRoundWinner)
  displayRound.innerHTML = ''
  rounds++
  fadeThis(displayRound, `Round ${rounds}`, [0,0,0], [255,255,255], getReadyToMovePlayers, 5000)
}

const getReadyToMovePlayers = () => {
  let displayRound = document.getElementById('winner-anim')
  displayRound.innerHTML = ''
  gameStarted = false;
  howManyPlayers(activePlayers)
  movePlayers('grid')
}

const endGame = () => {
  let displayRound = document.getElementById('winner-anim')
  document.getElementById('stats').style.visibility = 'visible'
  displayRound.innerHTML = ''
  gameType == 'finite' ? playerArr.forEach(player => player.points += player.potential) : undefined
  gameType == 'finite' ? removeFood() : undefined
  removePlayer(lastRoundWinner)
  gameStarted = false;

  let redStats = document.getElementById('red-stats')
  let blueStats = document.getElementById('blue-stats')
  let greenStats = document.getElementById('green-stats')
  let orangeStats = document.getElementById('orange-stats')

  if (activePlayers > 0) {
    buildStats(redStats, redPlayer)
  }
  if (activePlayers > 1) {
    buildStats(blueStats, bluePlayer)
  }
  if (activePlayers > 2) {
    buildStats(greenStats, greenPlayer)
  }
  if (activePlayers > 3) {
    buildStats(orangeStats, orangePlayer)
  }
}

const buildStats = (playerDiv, player) => {

  let record;

  if (gameType != 'finite' && activePlayers == 1) {
    record = player.growth > highScore ? 'NEW High Score: ' + player.growth : 'High Score: ' + highScore
    player.growth > highScore ? highScore = player.growth : undefined
  } else if (gameType == 'finite' && activePlayers == 1){
    record = player.points > tailScore ? 'NEW High Score: ' + player.points : 'High Score: ' + tailScore
    player.points > tailScore ? tailScore = player.points : undefined
  }
  let multiPlayerWins = `Wins: ${player.wins}`
  let multiPlayerKills = `Kills: ${player.kills}`
  let singlePlayerButtons = `Buttons pressed: ${player.buttons}`
  let singlePlayerDeath = `Death: ${death}`
  playerDiv.style.visibility = 'visible'
  playerDiv.innerHTML = `<h3>${player.name}</h3>
                         <p>
                         ${activePlayers > 1 ? multiPlayerWins : singlePlayerButtons}<br>
                         ${activePlayers > 1 ? multiPlayerKills : singlePlayerDeath}<br>
                         ${gameType == 'finite' ? 'Tail' : 'Growth'}: ${gameType == 'finite' ? player.points : player.growth}<br>
                         ${activePlayers > 1 ? '' : record}<br>
                         </p>`
}


////
////
////


// Pixel movement method
const movePixel = (player) => {
  let area = document.getElementById('area')
  let newDiv = document.createElement('div')
  player.boxColor == 'red' ? newDiv.className = 'red-pixel' : newDiv.className = 'blue-pixel'

  switch(player.boxDirec) {
    case 'left':
      player.pixelCoor.x -= 3
      break;
    case 'right':
      player.pixelCoor.x += 3
      break;
    case 'up':
      player.pixelCoor.y -= 3
      break;
    case 'down':
      player.pixelCoor.y += 3
      break;
  }

  newDiv.style.display = 'block'
  newDiv.style.left = player.pixelCoor.x + 'px'
  newDiv.style.top = player.pixelCoor.y + 'px'
  // console.log(newDiv)

  // document.getElementById('carRight').style.left="600px";
  area.append(newDiv)
  checkCollisionPixel(player);
}

const checkCollisionPixel = (player) => {
  let x = player.pixelCoor.x
  let y = player.pixelCoor.y
  // console.log(x + ' ' + y)

  if (x < 0) {
    alert('left border')
  } else if (x > 1070) {
    alert('right border')
  } else if (y < 0) {
    alert('top border')
  } else if (y > 650) {
    alert('bottom border')
  }
}
