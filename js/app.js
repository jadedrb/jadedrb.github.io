// Creates arena for grid method
function addDivs(number) {
  let area = document.getElementById('area')
  for(let i = 1; i <= number; i++) {
    let newDiv = document.createElement('div')
    newDiv.id = `box-${i}`
    // This crazy if statement determines the white borders
    if(i <= 180 || i >= (number - 179) || i % 180 == 0 || (i - 1) % 180 == 0){
      newDiv.style.background = 'white'
    }
    area.append(newDiv)
  }
}

addDivs(110 * 180);
let numberOfDivs = 110 * 180
let gridUp;
let gridDown;
let gridLeft;
let gridRight;


// window.addEventListener('keydown', function (e) {
//     console.log(e.keyCode)
// });

// Sets initial movement direction and gridDirection values
const setDirection = (method) => {
  let random = Math.floor(Math.random() * 4)
  let result;
  if (method == 'grid') {
    gridUp = -180
    gridDown = 180
    gridLeft = -1
    gridRight = 1
  } else {
    gridUp = 'up'
    gridDown = 'down'
    gridLeft = 'left'
    gridRight = 'right'
  }
  // if (random == 0) {
  //   result = gridUp
  // } else if (random == 1){
  //   result = gridDown
  // } else if (random == 0){
  //   result = gridLeft
  // } else {
  //   result = gridRight
  // }
  // return result;
}

// red player / player one object
class Player {
  constructor(box, color) {
    this.boxNum = box;
    this.boxArr = [];
    this.boxColor = color;
    this.boxDirec = undefined;
    this.points = 0;
    this.wins = 0;
    this.status = undefined;
    this.pixelCoor = { // x is left and right, y is up and down
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 500)
    };
  }
}

let redPlayer;
let bluePlayer;
let greenPlayer;
let orangePlayer;
let playerArr;

let numberOfPlayers;
let firstTo;
let lastRoundWinner;
let gameSpeed;
let rounds = 1;
// let redPlayer = {
//   boxNum: 200,
//   boxArr: [],
//   boxColor: 'red',
//   boxDirec: undefined,
//   points: 0,
//   status: true,
//   pixelCoor: { // x is left and right, y is up and down
//     x: Math.floor(Math.random() * 1000),
//     y: Math.floor(Math.random() * 500)
//   }
// }
//
// // blue player / player two object
// let bluePlayer = {
//   boxNum: 190,
//   boxArr: [],
//   boxColor: 'blue',
//   boxDirec: undefined,
//   points: 0,
//   status: true,
//   pixelCoor: {
//     x: Math.floor(Math.random() * 1000),
//     y: Math.floor(Math.random() * 500)
//   }
// }

const setAndStart = () => {

  redPlayer = new Player(200, 'red')
  bluePlayer = new Player(340, 'blue')
  greenPlayer = new Player(19500, 'green')
  orangePlayer = new Player(19380, 'orange')
  playerArr = [redPlayer, bluePlayer, greenPlayer, orangePlayer]

  gameSpeed = Number(document.getElementById('game-speed').value)
  let players = document.getElementById('player-count').value
  let arenaSize = document.getElementById('arena-size').value
  document.getElementById('menu').style.display = 'none'
  console.log(players)
  console.log(arenaSize)
  firstTo = document.getElementById('first-to').value
  howManyPlayers(players)
  movePlayers('grid')
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
          console.log('hey all 4')
        }
      }
    }
  }
}

// Key presses to change direction
document.onkeydown = function(key) {
  console.log(key.keyCode)

  switch (key.keyCode) {
    case 87: // Key: W, -100 represents up
      redPlayer.boxDirec = gridUp
      break;
    case 83: // Key: S, 100 represents down
      redPlayer.boxDirec = gridDown
      break;
    case 65: // Key: A, -1 represents left
      redPlayer.boxDirec = gridLeft
      break;
    case 68: // Key: D, 1 represents right
      redPlayer.boxDirec = gridRight
      break;
    case 38: // Key: Up
      bluePlayer.boxDirec = gridUp
      break;
    case 40: // Key: Down
      bluePlayer.boxDirec = gridDown
      break;
    case 37: // Key: Left
      bluePlayer.boxDirec = gridLeft
      break;
    case 39: // Key: Right
      bluePlayer.boxDirec = gridRight
      break;

    case 89: // Key: Y, -100 represents up
      greenPlayer.boxDirec = gridUp
      break;
    case 72: // Key: H, 100 represents down
      greenPlayer.boxDirec = gridDown
      break;
    case 71: // Key: G, -1 represents left
      greenPlayer.boxDirec = gridLeft
      break;
    case 74: // Key: J, 1 represents right
      greenPlayer.boxDirec = gridRight
      break;
    case 80: // Key: P
      orangePlayer.boxDirec = gridUp
      break;
    case 186: // Key: :
      orangePlayer.boxDirec = gridDown
      break;
    case 76: // Key: L
      orangePlayer.boxDirec = gridLeft
      break;
    case 222: // Key: "
      orangePlayer.boxDirec = gridRight
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
      redPlayer.boxDirec = gridDown;
      bluePlayer.boxDirec = gridDown;
      greenPlayer.boxDirec = gridUp;
      orangePlayer.boxDirec = gridUp;
      redPlayer.boxNum = 200
      bluePlayer.boxNum = 340
      greenPlayer.boxNum = 19500
      orangePlayer.boxNum = 19380
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
  console.log(`box-${player.boxNum + player.boxDirec}`)
  if(checkCollisionGrid(player, moveTo)) {
    moveTo.style.background = player.boxColor;
    player.boxNum += player.boxDirec
  } else {
    numberOfPlayers == 1 ? exitAnotherPause = true : undefined
  }
}

const checkCollisionGrid = (player, checkDiv) => {
  let hit = checkDiv.style.background
  if (hit == 'red' || hit == 'blue' || hit == 'green' || hit == 'orange' || hit == 'white') {
    if (player.boxColor != hit && hit != 'white') {
      switch (hit) {
        case 'red':
          redPlayer.points++
          break;
        case 'blue':
          bluePlayer.points++
          break;
        case 'green':
          greenPlayer.points++
          break;
        case 'orange':
          orangePlayer.points++
          break;
        default:
          console.log('error')
          break;
      }
    }

    if (numberOfPlayers > 1) {
      numberOfPlayers--
      player.status = false;
      removePlayer(player)
    }
    return false;
  }
  return true;
  console.log(checkDiv.style.background)
  // if (checkDiv && checkDiv.style.background == ) {
  //
  // }
}

const removePlayer = (player) => {
  for (let i = 0; player.boxArr.length > 0; ) {
    if (player.boxArr[0].style.background == player.boxColor) {
      player.boxArr[0].style.background = 'black';
    }
    player.boxArr.shift()
  }
}

let exitAnotherPause = false;
let gameStarted = false;

const anotherPause = (style) => {
  if (!exitAnotherPause) {
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
        words = 'Red Wins!'
      } else if (player.boxColor == 'blue') {
        rgbColor = [0,0,255]
        words = 'Blue Wins!'
      } else if (player.boxColor == 'green') {
        rgbColor = [8,205,8]
        words = 'Green Wins!'
      } else {
        rgbColor = [255,170,0]
        words = 'Orange Wins!'
      }

      setTimeout(()=> fadeThis(winnerAnim, words, [255,255,255], rgbColor, nextRound), 2000);
    }
    if (player.wins >= firstTo) {
      /// Win player wins game and you want to reset
    }
  }
}

function fadeThis(element, words, startColor, finishColor, nextFunc, time = 1000) {
    element.innerText = words;
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
  let displayRound = document.getElementById('winner-anim')
  removePlayer(lastRoundWinner)
  displayRound.innerText = ''
  rounds++
  fadeThis(displayRound, `Round ${rounds}`, [0,0,0], [255,255,255], getReadyToMovePlayers, 5000)
}

const getReadyToMovePlayers = () => {
  let displayRound = document.getElementById('winner-anim')
  displayRound.innerText = ''
  gameStarted = false;
  howManyPlayers(playerArr.length)
  movePlayers('grid')
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
