function addDivs(number) {
  let area = document.getElementById('area')
  for(let i = 1; i <= number; i++) {
    console.log(area)
    let newDiv = document.createElement('div')
    newDiv.id = `box-${i}`
    console.log(newDiv)
    area.append(newDiv)
    console.log(area)
  }
}

addDivs(10000);
