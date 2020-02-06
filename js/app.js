function addDivs(number) {
  let area = document.getElementById('area')
  for(let i = 1; i <= number; i++) {
    let newDiv = document.createElement('div')
    newDiv.id = `box-${i}`
    area.append(newDiv)
  }
  // console.log(area)
}

addDivs(10000);

// window.addEventListener('keydown', function (e) {
//     console.log(e.keyCode)
// });

let redPlayer = {
  boxNum: 1,
  boxArr: [],
  boxColor: 'red'
}

document.onkeydown = function(key) {
  switch (key.keyCode) {
    case 87:
      console.log('W' + ' should be ' + key.keyCode);
      moveOne(redPlayer, -100);
      break;
    case 83:
      console.log('S' + ' should be ' + key.keyCode);
      moveOne(redPlayer, 100);
      break;
    case 65:
      console.log('A' + ' should be ' + key.keyCode);
      moveOne(redPlayer, -1);
      break;
    case 68:
      console.log('D' + ' should be ' + key.keyCode);
      moveOne(redPlayer, 1);
      break;
    case 38:
      console.log('Up' + ' should be ' + key.keyCode);
      break;
    case 40:
      console.log('Down' + ' should be ' + key.keyCode)
      break;
    case 37:
      console.log('Left' + ' should be ' + key.keyCode)
      break;
    case 39:
      console.log('Right' + ' should be ' + key.keyCode)
      break;
    default:
      console.log('Error!')
  };
}

const moveOne = (player, direction) => {
  let currentBox = document.getElementById(`box-${player.boxNum}`)
  console.log(direction)
  let moveTo = document.getElementById(`box-${player.boxNum + direction}`)
  console.log(moveTo)
  moveTo.style.background = player.boxColor;
  player.boxArr.push(currentBox)
  player.boxNum += direction
}
