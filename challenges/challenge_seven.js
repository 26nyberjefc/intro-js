const prompt = require('prompt-sync')();
let hasKey = prompt("Do you have a key? (yes/no) ") === "yes";
let strength = parseInt(prompt("Enter your strength: "));
let isBroken = prompt("Is the lock broken? (yes/no) ") === "yes";
if (hasKey && strength >= 5 && isBroken != true) {
   console.log("You opened the door!");
} else {
   console.log("The door won't budge.");
}
