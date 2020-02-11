// Creates arena for grid method
function addDivs(number) {
  let area = document.getElementById('area')
  for(let i = 1; i <= number; i++) {
    let newDiv = document.createElement('div')
    newDiv.id = `box-${i}`
    newDiv.className = 'grid-piece'
    // These crazy if statements determine the white borders
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
  constructor(box, color, name, winDomId) {
    this.inventory = [null, null, null, null, null, null, null, null];
    this.invNum = 0;
    this.boxNum = box;
    this.boxArr = [];
    this.boxColor = color;
    this.name = name;
    this.boxDirec = undefined;
    this.buttons = 0;
    this.kills = 0;
    this.points = 0;
    this.growth = 0;
    this.element = winDomId;
    this.potential = 10;
    this.wins = 0;
    this.death = '';
    this.status = undefined;
    this.pixelCoor = { // x is left and right, y is up and down
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 500)
    };
  }
}

// Create four players based off class blueprint above
let redPlayer = new Player(200, 'red', 'Red', document.getElementById('r-w'))
let bluePlayer = new Player(340, 'blue', 'Blue', document.getElementById('b-w'))
let greenPlayer = new Player(19500, 'green', 'Green', document.getElementById('g-w'))
let orangePlayer = new Player(19380, 'orange', 'Green', document.getElementById('o-w'))
let playerArr = [redPlayer, bluePlayer, greenPlayer, orangePlayer]

// Global variables for settings and stats
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
let mapSetting;
let enableSpecials = false;

// jQuery to change the CSS grid template of area div
function changeMapSize() {
  console.log('jquery!')
  // let mapSetting = document.getElementById('arena-size').value

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
}

let categories = []

const clearBackgroundColor = (idArr, category = undefined) => {
  for (let div of idArr) {
    document.getElementById(div).style.background = 'black'
  }

  if (category != undefined && categories.every(cat => cat != category)) {
    categories.push(category)
  }
}

const haveTheyClickedAllButtons = () => {
  if (categories.length == 6) {
    changeMapSize();
    setAndStart(0);
  }
}
// These are arrays full of id names for different categories. Useful for clearBackgroundColor function
let numPlay = ['num-play-one','num-play-two','num-play-three','num-play-four']
let gameL = ['best-one', 'best-three', 'best-five', 'best-seven']
let areaS = ['small-size', 'med-size', 'large-size']
let gameS = ['slow', 'normal', 'fast']
let tailL = ['finite', 'infinite']
let specAb = ['ab-off', 'ab-on']

// This is for the settings window at start of game
const setThis = (button) => {
  switch (button) {
    case 1:
      clearBackgroundColor(numPlay, 1)
      document.getElementById('num-play-one').style.background = 'purple'
      activePlayers = 1
      haveTheyClickedAllButtons()
      break;
    case 2: // gameSpeed, firstTo, enableSpecials
      clearBackgroundColor(numPlay, 1)
      document.getElementById('num-play-two').style.background = 'purple'
      activePlayers = 2
      haveTheyClickedAllButtons()
      break;
    case 3:
      clearBackgroundColor(numPlay, 1)
      document.getElementById('num-play-three').style.background = 'purple'
      activePlayers = 3
      haveTheyClickedAllButtons()
      break;
    case 4:
      clearBackgroundColor(numPlay, 1)
      document.getElementById('num-play-four').style.background = 'purple'
      activePlayers = 4
      haveTheyClickedAllButtons()
      break;
    case 5:
      clearBackgroundColor(gameL, 2)
      document.getElementById('best-one').style.background = 'purple'
      firstTo = 1
      haveTheyClickedAllButtons()
      break;
    case 6:
      clearBackgroundColor(gameL, 2)
      document.getElementById('best-three').style.background = 'purple'
      firstTo = 2
      haveTheyClickedAllButtons()
      break;
    case 7:
      clearBackgroundColor(gameL, 2)
      document.getElementById('best-five').style.background = 'purple'
      firstTo = 3
      haveTheyClickedAllButtons()
      break;
    case 8:
      clearBackgroundColor(gameL, 2)
      document.getElementById('best-seven').style.background = 'purple'
      firstTo = 4
      haveTheyClickedAllButtons()
      break;
    case 9:
      clearBackgroundColor(areaS, 3)
      document.getElementById('small-size').style.background = 'purple'
      mapSetting = 'small'
      haveTheyClickedAllButtons()
      break;
    case 10:
      clearBackgroundColor(areaS, 3)
      document.getElementById('med-size').style.background = 'purple'
      mapSetting = 'medium'
      haveTheyClickedAllButtons()
      break;
    case 11:
      clearBackgroundColor(areaS, 3)
      document.getElementById('large-size').style.background = 'purple'
      mapSetting = 'large'
      haveTheyClickedAllButtons()
      break;
    case 12:
      clearBackgroundColor(gameS, 4)
      document.getElementById('slow').style.background = 'purple'
      gameSpeed = 100
      haveTheyClickedAllButtons()
      break;
    case 13:
      clearBackgroundColor(gameS, 4)
      document.getElementById('normal').style.background = 'purple'
      gameSpeed = 40
      haveTheyClickedAllButtons()
      break;
    case 14:
      clearBackgroundColor(gameS, 4)
      document.getElementById('fast').style.background = 'purple'
      gameSpeed = 10
      haveTheyClickedAllButtons()
      break;
    case 15:
      clearBackgroundColor(tailL, 5)
      document.getElementById('finite').style.background = 'purple'
      gameType = 'finite'
      haveTheyClickedAllButtons()
      break;
    case 16:
      clearBackgroundColor(tailL, 5)
      document.getElementById('infinite').style.background = 'purple'
      gameType = 'infinite'
      haveTheyClickedAllButtons()
      break;
    case 17:
      console.log('??')
      clearBackgroundColor(specAb, 6)
      document.getElementById('ab-off').style.background = 'purple'
      enableSpecials = false
      haveTheyClickedAllButtons()
      break;
    case 18:
      console.log('???')
      clearBackgroundColor(specAb, 6)
      document.getElementById('ab-on').style.background = 'purple'
      enableSpecials = true
      haveTheyClickedAllButtons()
      break;
    default:
  }
}

// Could maybe accomplish the same thing with this
// $(()=>{
//   $('button').on('click', (event)=>{
//
//     event.preventDefault();
//     let borough = this.event.target.id

const setAndStart = (menu) => {

  if (menu == 0) {
    rounds = 1;
    // Reset each players stats
    playerArr.forEach(player => {
      player.kills = 0
      player.wins = 0
      player.growth = 0
      player.buttons = 0
      player.points = 0
      player.element.innerText = '0'
      player.potential = 10
    })
    // This changes the menu from settings to controls (and saves your setting values)
    // gameSpeed = Number(document.getElementById('game-speed').value)
    // let players = Number(document.getElementById('player-count').value)
    // let arenaSize = document.getElementById('arena-size').value
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('controls').style.visibility = 'visible'
    // firstTo = document.getElementById('best-of').value
    // gameType = document.getElementById('tail-length').value
    // enableSpecials = (document.getElementById('specials').value === 'true')
    // activePlayers = players
    categories = []
    clearBackgroundColor(numPlay, undefined)
    clearBackgroundColor(gameL, undefined)
    clearBackgroundColor(areaS, undefined)
    clearBackgroundColor(specAb, undefined)
    clearBackgroundColor(tailL, undefined)
    clearBackgroundColor(gameS, undefined)
    activePlayers > 0 ? document.getElementById('red-para').style.visibility = 'visible' : undefined
    activePlayers > 1 ? document.getElementById('blue-para').style.visibility = 'visible' : undefined
    activePlayers > 2 ? document.getElementById('green-para').style.visibility = 'visible' : undefined
    activePlayers > 3 ? document.getElementById('orange-para').style.visibility = 'visible' : undefined
    showInventory()
    howManyPlayers(activePlayers)
  } else if (menu == 1){
    // This hides controls menu and starts the game
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
    // This brings up the start of game menu with settings
    document.getElementById('stats').style.visibility = 'hidden'
    document.getElementById('red-stats').style.visibility = 'hidden'
    document.getElementById('blue-stats').style.visibility = 'hidden'
    document.getElementById('green-stats').style.visibility = 'hidden'
    document.getElementById('orange-stats').style.visibility = 'hidden'
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('death-history').innerHTML = ''
    $('.grid-piece').remove();
    $('#area').css( "grid-template-columns", "repeat(180, 6px)" );
    $('#area').css( "grid-template-rows", "repeat(110, 6px)" );
    mapSize = null
  }
}
// This determines which players are participating
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
// This shows the appropriate players wins counter and/or inventory
const showInventory = () => {
  let inv = document.getElementsByClassName('inv')
  let slot = document.getElementsByClassName('slot')
  if (activePlayers == 1) {
    inv[0].style.display = 'flex'
    inv[1].style.display = 'none'
    inv[2].style.display = 'none'
    inv[3].style.display = 'none'
  } else if (activePlayers == 2) {
    inv[0].style.display = 'flex'
    inv[1].style.display = 'flex'
    inv[2].style.display = 'none'
    inv[3].style.display = 'none'
  } else if (activePlayers == 3) {
    inv[0].style.display = 'flex'
    inv[1].style.display = 'flex'
    inv[2].style.display = 'flex'
    inv[3].style.display = 'none'
  } else {
    inv[0].style.display = 'flex'
    inv[1].style.display = 'flex'
    inv[2].style.display = 'flex'
    inv[3].style.display = 'flex'
  }
  if (enableSpecials) { populateInv(activePlayers) }
  // This loop shows inventory slots if applicable
  console.log(enableSpecials)
  for (let i = 0; i < slot.length; i++) {
    enableSpecials ? slot[i].style.display = 'flex' : slot[i].style.display = 'none'
  }
}

let bombArr = []

// This is the bomb ability. It uses the players current box to calculate the blast radius
const bomb = (el, bomber) => {
  let wallAhead = false; // As soon as a wall is detected, the explosion stops
  let wallBehind = false; // rendering in that direction
  let wallAbove = false;
  let wallBelow = false;
  let testForWalls;
  let gridPiece;

  // This for loop handles x axis in both directions
  for (let i = 1; i < 7; i++) {

    testForWalls = document.getElementById(`box-${el+i}`).style.background
    gridPiece = document.getElementById(`box-${el+i}`)
    if (testForWalls != 'white') {
      gridPiece.style.background = 'yellow'
      bombArr.push(gridPiece)
      fireyDeath(bomber, Number(gridPiece.id.split('-')[1])); // Gives the box number of recently effected div
    } else {
      wallAhead = true;
      console.log('wall ahead')
    }

    testForWalls = document.getElementById(`box-${el-i}`).style.background
    gridPiece = document.getElementById(`box-${el-i}`)
    if(testForWalls != 'white') {
      gridPiece.style.background = 'yellow'
      bombArr.push(gridPiece)
      fireyDeath(bomber, Number(gridPiece.id.split('-')[1]));
    } else {
      wallBehind = true;
      console.log('wall behind')
    }

// This nested for loop handles y axis (everything above and below the current x axis value)
    for (let j = 1; j < 7; j++) {

      if (!wallAbove) {
        testForWalls = document.getElementById(`box-${el+(gridUp*j)}`).style.background
        if (testForWalls == 'white') {
          wallAbove = true;
          console.log('wall above')
        }
      }
      if (!wallBelow) {
        testForWalls = document.getElementById(`box-${el+(gridDown*j)}`).style.background
        if (testForWalls == 'white') {
          wallBelow = true;
          console.log('wall below')
        }
      }
      if (!wallAhead) {
        if(!wallAbove) {
          gridPiece = document.getElementById(`box-${el+i-1+(gridUp*j)}`)
          gridPiece.style.background = 'yellow'
          bombArr.push(gridPiece)
          fireyDeath(bomber, Number(gridPiece.id.split('-')[1]));
        }
        if(!wallBelow) {
          gridPiece = document.getElementById(`box-${el+i-1+(gridDown*j)}`)
          gridPiece.style.background = 'yellow'
          bombArr.push(gridPiece)
          fireyDeath(bomber, Number(gridPiece.id.split('-')[1]));
        }
      }
      if (!wallBehind) {
        if(!wallAbove) {
          gridPiece = document.getElementById(`box-${el-i+1+(gridUp*j)}`)
          gridPiece.style.background = 'yellow'
          bombArr.push(gridPiece)
          fireyDeath(bomber, Number(gridPiece.id.split('-')[1]));
        }
        if(!wallBelow) {
          gridPiece = document.getElementById(`box-${el-i+1+(gridDown*j)}`)
          gridPiece.style.background = 'yellow'
          bombArr.push(gridPiece)
          fireyDeath(bomber, Number(gridPiece.id.split('-')[1]));
        }
      }
    }
  }
}

let bombLit = false;

// Adds a bit of animation/color to the bomb ability
const bombColor = () => {
  bombLit = true;
  let stage = bombArr[0].style.background
  for (let box of bombArr) {
    if (box.style.background == 'yellow') {
      box.style.background = 'burlywood';
    } else {
      box.style.background = 'grey';
    }
  }
  console.log('loop ended ' + stage)
  if (stage == 'yellow' || stage == 'burlywood') {
    console.log('um')
    longerPause(bombColor, 100)
  } else {
    console.log('ok')
    longerPause(bombWipe, 100)
  }
}

// Turns all bomb effected divs back to their original color
const bombWipe = () => {
  while (bombArr.length > 0) {
    bombArr[0].style.background = 'black';
    bombArr.shift()
  }
  bombLit = false;
  console.log('wipe')
}

// Kills all players in bomb effected area divs
const fireyDeath = (bomber, div) => {
  let grantKill = 0
  let grantPlayer;
  console.log(bomber)
  for (let player of playerArr) {
    if (player.boxColor == bomber) { grantPlayer = player }
    if (player.boxColor != bomber && player.boxNum == div && player.status == true) {
      player.boxNum = 0
      console.log('You killed ' + player.boxColor)
      grantKill = 1
      numberOfPlayers--
      player.status = false;
      player.death = `${player.name} got blown up by a bomb`
      logDeath(player.death)
      removePlayer(player)
      if (numberOfPlayers == 1) { exitAnotherPause = true }
    }
  }
  grantPlayer.kills += grantKill
}

// This is the switcheroo ability. It swaps the player's current box and direction values for an opponents values
const switcheroo = (player, color) => {
  let random;
  let targets = []
  for (let i = 0; i < playerArr.length; i++) {
    if (playerArr[i].boxColor != color && playerArr[i].status == true) {
      targets.push(playerArr[i])
    } else if (playerArr[i].boxColor == color) {
      player = playerArr[i]
    }
  }
  random = Math.floor(Math.random() * targets.length)
  let playerInstanceOne = { box: player.boxNum, direction: player.boxDirec }
  let playerInstanceTwo = { box: targets[random].boxNum, direction: targets[random].boxDirec }
  targets[random].boxNum = playerInstanceOne.box
  targets[random].boxDirec = playerInstanceOne.direction
  player.boxNum = playerInstanceTwo.box
  player.boxDirec = playerInstanceTwo.direction
}

// Key presses to change direction, use abilities, and navigate inventory
document.onkeydown = function(key) {
  console.log(key.keyCode)
  switch (key.keyCode) {
    case 87: // Key: W, -100 represents up
      if (redPlayer.boxDirec != gridDown) {
        redPlayer.boxDirec = gridUp
        redPlayer.buttons++
      }
      break;
    case 83: // Key: S, 100 represents down
      if (redPlayer.boxDirec != gridUp) {
        redPlayer.boxDirec = gridDown
        redPlayer.buttons++
      }
      break;
    case 65: // Key: A, -1 represents left
      if (redPlayer.boxDirec != gridRight) {
        redPlayer.boxDirec = gridLeft
        redPlayer.buttons++
      }
      break;
    case 68: // Key: D, 1 represents right
      if (redPlayer.boxDirec != gridLeft) {
        redPlayer.boxDirec = gridRight
        redPlayer.buttons++
      }
      break;
    case 38: // Key: Up
      if (bluePlayer.boxDirec != gridDown) {
        bluePlayer.boxDirec = gridUp
        bluePlayer.buttons++
      }
      break;
    case 40: // Key: Down
      if (bluePlayer.boxDirec != gridUp) {
        bluePlayer.boxDirec = gridDown
        bluePlayer.buttons++
      }
      break;
    case 37: // Key: Left
      if (bluePlayer.boxDirec != gridRight) {
        bluePlayer.boxDirec = gridLeft
        bluePlayer.buttons++
      }
      break;
    case 39: // Key: Right
      if (bluePlayer.boxDirec != gridLeft) {
        bluePlayer.boxDirec = gridRight
        bluePlayer.buttons++
      }
      break;

    case 89: // Key: Y, -100 represents up
      if (greenPlayer.boxDirec != gridDown) {
        greenPlayer.boxDirec = gridUp
        greenPlayer.buttons++
      }
      break;
    case 72: // Key: H, 100 represents down
      if (greenPlayer.boxDirec != gridUp) {
        greenPlayer.boxDirec = gridDown
        greenPlayer.buttons++
      }
      break;
    case 71: // Key: G, -1 represents left
      if (greenPlayer.boxDirec != gridRight) {
        greenPlayer.boxDirec = gridLeft
        greenPlayer.buttons++
      }
      break;
    case 74: // Key: J, 1 represents right
      if (greenPlayer.boxDirec != gridLeft) {
        greenPlayer.boxDirec = gridRight
        greenPlayer.buttons++
      }
      break;
    case 80: // Key: P
      if (orangePlayer.boxDirec != gridDown) {
        orangePlayer.boxDirec = gridUp
        orangePlayer.buttons++
      }
      break;
    case 186: // Key: :
      if (orangePlayer.boxDirec != gridUp) {
        orangePlayer.boxDirec = gridDown
        orangePlayer.buttons++
      }
      break;
    case 76: // Key: L
      if (orangePlayer.boxDirec != gridRight) {
        orangePlayer.boxDirec = gridLeft
        orangePlayer.buttons++
      }
      break;
    case 222: // Key: "
      if (orangePlayer.boxDirec != gridLeft) {
        orangePlayer.boxDirec = gridRight
        orangePlayer.buttons++
      }
      break;
    case 69: // Key: E (red player fire special)
      if (gameStarted && enableSpecials && !inMenus &&
        redPlayer.status == true &&
        redPlayer.inventory[redPlayer.invNum] != null) {
          useAbility(redPlayer, redPlayer.inventory[redPlayer.invNum], redPlayer.invNum)
        }
      break;
    case 81: // Key: Q (red player navigate inventory)
      if (gameStarted && enableSpecials && !inMenus &&
        redPlayer.status == true) {
          navigate(redPlayer)
        }
      break;
    case 85: // Key: U (green player fire special)
      if (gameStarted && enableSpecials && !inMenus &&
        greenPlayer.status == true &&
        greenPlayer.inventory[greenPlayer.invNum] != null) {
          useAbility(greenPlayer, greenPlayer.inventory[greenPlayer.invNum], greenPlayer.invNum)
        }
      break;
    case 84: // Key: T (green player navigate invetory)
      if (gameStarted && enableSpecials && !inMenus &&
        greenPlayer.status == true) {
          navigate(greenPlayer)
        }
      break;
    case 219: // Key: { (orange player fire special)
      if (gameStarted && enableSpecials && !inMenus &&
        orangePlayer.status == true &&
        orangePlayer.inventory[orangePlayer.invNum] != null) {
          useAbility(orangePlayer, orangePlayer.inventory[orangePlayer.invNum], orangePlayer.invNum)
        }
      break;
    case 79: // Key: O (orange player navigate invetory)
      if (gameStarted && enableSpecials && !inMenus &&
        orangePlayer.status == true) {
          navigate(orangePlayer)
        }
      break;
    case 16: // Key: Shift (blue player fire special)
      if (gameStarted && enableSpecials && !inMenus &&
        bluePlayer.status == true &&
        bluePlayer.inventory[bluePlayer.invNum] != null) {
          useAbility(bluePlayer, bluePlayer.inventory[bluePlayer.invNum], bluePlayer.invNum)
        }
      break;
    case 18: // Key: alt (blue player navigate invetory)
      if (gameStarted && enableSpecials && !inMenus &&
        bluePlayer.status == true) {
          navigate(bluePlayer)
        }
      break;
    default:
      console.log('error')
      break;
  };
}

// Runs the ability in a slot then clears that slot
const useAbility = (player, ability, clear) => {
  document.getElementsByClassName(`${player.boxColor}-slot`)[clear].innerText = ''
  player.inventory[clear] = null
  ability(player.boxNum, player.boxColor)
}

// Fills DOM inventory and player inventory array
const populateInv = (players) => {
  console.log('..')
  let slotsArr = [document.getElementsByClassName('red-slot'),
                  document.getElementsByClassName('blue-slot'),
                  document.getElementsByClassName('green-slot'),
                  document.getElementsByClassName('orange-slot')]
  for (let i = players - 1; i >= 0; i--) {
    console.log('.l.')
    for (let j = 0; j < slotsArr[i].length; j++) {
      let random = Math.floor(Math.random() * 10)
      if (random < 8) {
        slotsArr[i][j].innerText = 'B'
        playerArr[i].inventory[j] = bomb
        console.log('got there')
      } else if (random >= 8) {
        slotsArr[i][j].innerText = 'S'
        playerArr[i].inventory[j] = switcheroo
        console.log('got there')
      }
    }
  }
}

// Highlights the next inventory item to the right
const navigate = (player) => {
  let inv = document.getElementsByClassName(`${player.boxColor}-slot`)
  player.invNum > 6 ? player.invNum = 0 : player.invNum++
  inv[player.invNum].style.border = '3px solid brown';
  player.invNum == 0 ? inv[7].style.border = '1px solid aquamarine' : inv[player.invNum - 1].style.border = '1px solid aquamarine'
}

// This starts and continues player movement throughout game
const movePlayers = (style = 'grid') => {
  if (style == 'grid') {
    if (!gameStarted) {
      gameStarted = true; // Do this one time at start of game
      setDirection('grid');
      activePlayers == 1 ? firstTo = 1 : undefined
    }
    if (inMenus) {
      inMenus = false
      document.getElementById('death-history').innerHTML = ''
    }
    redPlayer.status ? moveOne(redPlayer) : undefined // Start moving players
    bluePlayer.status ? moveOne(bluePlayer) : undefined
    greenPlayer.status ? moveOne(greenPlayer) : undefined
    orangePlayer.status ? moveOne(orangePlayer) : undefined
    if (bombArr.length > 0 && !bombLit) {
      console.log('run')
      bombLit = true;
      longerPause(bombColor, 200)
      console.log('ning')
    }
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

// Checks if a moving player has just touched an enemy trail
const checkCollisionGrid = (player, checkDiv) => {
  let nonLethal = false;
  let hit = checkDiv.style.background
  if (hit == 'red' || hit == 'blue' || hit == 'green' || hit == 'orange' || hit == 'white' || hit == 'purple') {
    if (player.boxColor != hit && hit != 'white') {
      switch (hit) {
        case 'red':
          player.death = `${player.name} ran into ${redPlayer.name}'s tail`
          redPlayer.kills++
          break;
        case 'blue':
          player.death = `${player.name} ran into ${bluePlayer.name}'s tail`
          bluePlayer.kills++
          break;
        case 'green':
          player.death = `${player.name} ran into ${greenPlayer.name}'s tail`
          greenPlayer.kills++
          break;
        case 'orange':
          player.death = `${player.name} ran into ${greenPlayer.name}'s tail`
          orangePlayer.kills++
          break;
        case 'purple':
          nonLethal = true;
          player.potential += 1
          foodOnArea--
          console.log('food')
          return true;
          break;
        default:
          console.log('error')
          break;
      }
      logDeath(player.death)
    } else if (hit == 'white') {
      death = 'Ran into border wall'
      player.death = `${player.name} ran into a border`
      logDeath(player.death)
    } else {
      death = 'Ran into own tail'
      player.death = `${player.name} ran into their own tail`
      logDeath(player.death)
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

// Removes a player trail after death
const removePlayer = (player) => {
  for (let i = 0; player.boxArr.length > 0; ) {
    if (player.boxArr[0].style.background == player.boxColor) {
      player.boxArr[0].style.background = 'black';
    }
    player.boxArr.shift()
  }
}

// Removes uneaten food from area after game round
const removeFood = () => {
  foodOnArea = 0;
  for (let i = 0; foodArr.length > 0; ) {
    if (foodArr[0].style.background == 'purple') {
      foodArr[0].style.background = 'black';
    }
    foodArr.shift()
  }
}

let inMenus = false;
let exitAnotherPause = false;
let gameStarted = false;
let chanceOfFood = 0;
let foodOnArea = 0;
let foodArr = []

// Handles game speed and triggers a win function
const anotherPause = (style) => {
  if (!exitAnotherPause) {
    chanceOfFood++
    chanceOfFood > 150 ? chanceOfFood = 0 : undefined
    let oneInThree = Math.floor(Math.random() * 10)
    if (gameType == 'finite' && chanceOfFood > 100 && oneInThree < 3 && foodOnArea < 20) {
      console.log('this far')
      createFood();
    }
    setTimeout(()=> movePlayers(style), gameSpeed);
  } else {
    console.log('okay...')
    exitAnotherPause = false;
    inMenus = true;
    checkWinner();
  }
}

// Handles food distribution and creates a 4x4 food pellet
const createFood = () => {
  let random = Math.floor(Math.random() * numberOfDivs)
  let randomDiv = document.getElementById(`box-${random}`)
  for (let i = 0; i < 4; i++) {
    if (i == 1) { randomDiv = document.getElementById(`box-${random - 1}`) }
    if (i == 2) { randomDiv = document.getElementById(`box-${random - gridDown}`) }
    if (i == 3) { randomDiv = document.getElementById(`box-${random - 1 - gridDown}`) }
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
}

// Runs a function after a specified time
const longerPause = (func, time) => {
  setTimeout(()=> func(), time);
}

// Determines winner and displays winning animations
const checkWinner = () => {
  for (let player of playerArr) {
    if (player.status == true) {
      console.log('are we...')
      player.wins++
      player.element.innerText = player.wins

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

// Takes an element, a starting rgb color, and a target rgb color for animation
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

// Triggers a next round animation
const nextRound = () => {
  gameType == 'finite' ? playerArr.forEach(player => player.points += player.potential) : undefined
  let displayRound = document.getElementById('winner-anim')
  activePlayers == 1 ? removeFood() : undefined
  removePlayer(lastRoundWinner)
  if (enableSpecials) { showInventory() }
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

// Show end of game stats
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

// Shows end of game stats based off game mode and number of players
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

// Logs currently saved death message to the DOM
const logDeath = (msg) => {
  let doc = document.getElementById('death-history')
  doc.innerHTML += `${msg}.&nbsp;`
}

////
//// BELOW ITEMS ARE EXPERIMENTAL OR DISCONTINUED
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
