
const prompt = require("prompt-sync")(); // Ask for user inputs
let gameCharacter = prompt("Enter a game character: ");
let gameCharacterTwo = prompt("Enter another game character: ")
let gameCharacterThree = prompt("Enter another another game character: ")
let weapon = prompt("Enter a weapon: ");
let adjectiveOne = prompt("Enter an adjective: ")
let nounOne = prompt("Enter a noun: ")
let nounTwo = prompt("Enter another noun: ")
let verbed = prompt("Enter a past tense verb: ")
let story = "Once upon a time " + gameCharacter + " was on a mission to obtain a " + weapon + " to fight and defeat the evil " + gameCharacterTwo + "."
let storyTwo = "On this journey, " + gameCharacter + " met the " + adjectiveOne + " " + gameCharacterThree + ", who proved to be a great ally."
let storyThree = "Unfortunatly, " + gameCharacterThree + " died after they tripped on a small " + nounOne + " and exploded. In their dying breaths, " + gameCharacterThree + " found the " + weapon + " and gave it to " + gameCharacter + "."
let storyFour = "In their final battle, " + gameCharacterTwo + " " + verbed + " a " + nounTwo + " and gained super powers. Forntunatly, it was no match for " + gameCharacter + " and their " + weapon + "."
console.log(story);
console.log(storyTwo)
console.log(storyThree)
console.log(storyFour)
console.log("The end.")