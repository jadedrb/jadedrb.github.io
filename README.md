# snakes in space
A snakes game... but in space! With multiplayer (sort of), power-ups, and different game modes.

## 

<img src="https://user-images.githubusercontent.com/60476965/107167422-d8df9e80-6986-11eb-8bed-6e47614f1608.png" width="90%"></img> 

## Description

If you've never played snakes: you start off with a snake of a certain length
and you move around the arena eating food (purple squares) in order to grow longer all while trying to 
avoid running into your tail. The longer your snake gets, the harder it is to survive. 

In this version there are variations of game mode. Finite mode: your tail grows after eating food.
Infinite mode: your tail grows non-stop without the need of eating food. Special abilities mode: you
have an inventory and special abilities to keep you alive longer (for multiplayer purposes).

That's the gist. Now get in there and slither through zero-g space!

## Mutliplayer

Oh yeah, there's multiplayer. Most snake games are one player trying to beat their own high score - which is still 
possible and an honored and respected setting in Snakes in Space - but this is four player compatible. 
You can theoretically all play on the same keyboard, but it would be best to split players 1 (red) and 4 (orange)
on one keyboard and players 2 (blue) and 3 (green) on a second external plugged-in keyboard.

## Technical Stuff

The grid is dynamically generated with a loop that creates tiny div spaces and is structured with css grid 
templates. Each player is represented with a player object that holds their stats, direction, and current 
position on the grid. 

To visualize the grid, think of a 100 by 100 grid. After 100 tiny divs are generated in one row, they wrap
around to the next row. Directly below div 1 would be div 101. Below div 101 would be 202. In other words,
telling a player to go up or down would mean adding or subtracting 100 to their current location. Whereas 
moving right would be +1 and left -1.

Collision detection was done through the use of background colors. For example, if the players current div 
location has a background color that matches the color of the border wall or an opposing player it would 
trigger a death function.

## Built With

* HTML, CSS, and a healthy dose of JavaScript

## Author

* **Jade Del Rosario-Bell** (https://github.com/jadedrb/)


## Deployed Link 

https://jadedrb.github.io/snakes-in-space/