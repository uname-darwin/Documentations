//Restrict to specific values:
// Only these 4 strings are allowed
type Direction = "north" | "south" | "east" | "west";

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

move("north");      // OK
move("south");      // OK
// move("up");      // Error - "up" is not allowed

// With numbers
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

let roll: DiceRoll = 4;  // OK
// let roll2: DiceRoll = 7;  // Error
