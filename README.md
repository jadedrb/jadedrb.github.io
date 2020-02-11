# worms

/// SNAKES IN SPACE /// 

A snakes game... but in space! If you've never played snakes: you start off with a snake of a certain length
and you move around the arena eating food pellets in order to grow longer. The longer your snake gets, the 
harder it is to survive. 

In this version there are variations of game mode. Finite tail mode: your tail grows after earting food.
Infinite tail mode: your tail grows non-stop without the need for eating food. Special abilities mode: you
have an inventory and special abilities to keep you alive longer (for multiplayer purposes).

Oh yeah, there's multiplayer. Most snakes game are one player trying to beat their own high score, still 
possible and an honored and respected setting in Snakes in Space, but this is four player compatible. 
You can theoretically all play on the same keyboard, but it would be best to split players 1 (Red) and 4 (orange)
on one keyboard and players 2 (blue) and 3 (green) on a second external plugged-in keyboard.

Technical stuff:

The grid is dynamically generated with a loop that creates tiny div spaces and is structured with css grid 
templates. Each player is represented with a player object that holds their stats, direction, and current 
position on the grid. 

To visualize the grid, think of a 100 by 100 grid. After 100 tiny divs are generated in one row, they wrap
around to the next row. Directly below div 1 would be div 101. Below div 101 would be 202. In other words,
telling a player to go up or down would mean adding or subtracting 100 to their current location. Moving
right would be +1, left -1.

Collision was detected using background colors. For example, if the players current div location has a background
color that matches the color of the border wall or an opposing player it would trigger a death function.

Repository link: https://github.com/jadedrb/jadedrb.github.io
Direct to game link: jadedrb.github.io