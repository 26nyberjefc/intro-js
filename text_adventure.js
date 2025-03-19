// import prompt function
const prompt = require('prompt-sync')();

// Game state variables
let playerName = "";
let rabbitFound = false;
let inventory = [];
let location = "house"; // Starting location
let gameOver = false;

function startGame() {
    playerName = prompt("Welcome to the Lost Rabbit Adventure! What's your name? ");
    console.log(`Hello, ${playerName}! Your pet rabbit, Flopsy, has gone missing! It's time to find them.`);
    gameLoop();
}

function gameLoop() {
    while (!gameOver) {
        console.log("\n--- Game Status ---");
        console.log(`Location: ${location}`);
        console.log(`Inventory: ${inventory.join(", ")}`);
        console.log(`Rabbit Found: ${rabbitFound ? "Yes" : "No"}`);

        if (location === "house") {
            housePath();
        } else if (location === "garden") {
            gardenPath();
        } else if (location === "garage") {
            garagePath();
        } else if (location === "outside") {
            outsidePath();
        } else {
            console.log("You seem lost... Please make a decision. ");
            gameOver = true; // End game if no valid location is found
        }
    }
    console.log("\nGame Over! Thanks for playing.");
}

function housePath() {
    console.log("\nYou are in your house. It's cozy, but the rabbit is nowhere to be found.");
    let action = prompt("Do you want to search the house, or look in the garage or in the garden? ");

    if (action.toLowerCase() === "search") {
        console.log("You search the house... but you can't find Flopsy anywhere.");
        inventory.push("Magnifying Glass");
        console.log("You found a magnifying glass! Maybe this will help...");
    } else if (action.toLowerCase() === "garden") {
        console.log("You decide to head to the garden to look for Flopsy.");
        location = "garden"; // Move to garden
    } else if (action.toLowerCase() === "garage") {
        console.log("You decide to head into the garage to look for Flopsy.");
        location = "garage"; // Move to garage
    } else {
        console.log("Invalid action! Please choose 'search', 'garage', or 'garden'.");
    }
}

function garagePath() {
    console.log("\nYou are now inside the garage. It smells horrible and it's crowded with all of your stuff.");
    let action = prompt("Do you want to search the garage, open the garage, or go to the house? ");

    if (action.toLowerCase() === "search") {
        console.log("You navigate around the garage and look around... You spot something inside a box!");
        
        let gambling = true;
        while (gambling) { 
            let mysteryBox = Math.random();
            if (mysteryBox < 0.75) {
                inventory.push("Shiny Coin");
                console.log("You found a Shiny Coin!");
            } else {
                console.log("You found a broken lighter! It ignites and sets you and the whole house ablaze!");
                gameOver = true;
                gambling = false;
            }

            if (gambling) {
                let keepLooking = prompt("There's something else inside! Would you like to keep looking? ");
                if (keepLooking.toLowerCase() === "no") {
                    gambling = false;
                }
            }
        }
    } else if (action.toLowerCase() === "house") {
        console.log("You decide to head back into your house.");
        location = "house"; // Move to house
    } else if (action.toLowerCase() === "open") {
        console.log("You open the garage door and go outside.");
        location = "outside"; // Move outside
    } else {
        console.log("Invalid action! Please choose 'search', 'house', or 'open'.");
    }
}
function outsidePath() {
    console.log("\nYou open the garage and you are now outside. The neighborhood is busy as usual, but there's no sign of Flopsy. There is, however, a mysterious vending machine on your driveway.");

    // Ask the player what they want to do outside
    let action = prompt("Do you want to investigate the vending machine, go back inside, or look in the garden? ").toLowerCase();

    if (action === "investigate") {
        console.log("The vending machine seems to require a coin.");

        // Loop to ensure valid input (yes or no)
        let activate = "";
        while (activate !== "yes" && activate !== "no") {
            activate = prompt("Do you want to activate it? (yes/no) ").toLowerCase();

            if (activate === "yes") {
                if (inventory.includes("Shiny Coin")) {
                    console.log("The Shiny Coin was used!");
                    inventory = inventory.filter(item => item !== "Shiny Coin");
                    console.log("You got a Lopsy Magnet!");
                    inventory.push("Flopsy Magnet");
                } else {
                    console.log("You do not have any coins.");
                }
            } else if (activate === "no") {
                console.log("You decide to not activate the vending machine.");
            } else {
                console.log("Invalid input. Please enter 'yes' or 'no'.");
            }
        }
    } else if (action === "back") {
        console.log("You go back into the garage.");
        location = "garage"; // Update location to "garage"
    } else if (action === "garden") {
        console.log("You decide to go into the garden.");
        location = "garden"; // Update location to "garden"
    } else {
        console.log("Invalid action! Please choose 'investigate,' 'back,' or 'garden.'");
    }
}
function gardenPath() {
    if (inventory.includes("Flopsy Magnet")) {
        console.log("As you enter the garden, Flopsy flies right into your Flopsy Magnet! You found Flopsy!")
        rabbitFound = true;
        gameOver = true;
    }else {
        console.log("\nYou are now in the garden. The flowers are blooming, but there's no sign of Flopsy.");
        let action = prompt("Do you want to look under the bushes or call out for Flopsy? ");

        if (action.toLowerCase() === "look") {
            console.log("You crouch down and peek under the bushes... You spot something!");
            let foundRabbit = Math.random() < 0.5; // 50% chance to find the rabbit

            if (foundRabbit) {
                rabbitFound = true;
                console.log("You found Flopsy! The rabbit is safe and sound.");
                gameOver = true; // End game when rabbit is found
            } else {
                console.log("No rabbit here, just some old gardening tools.");
            }
        } else if (action.toLowerCase() === "call") {
            console.log("You call out, 'Flopsy! Where are you?'... You hear a rustling in the bushes.");
            let rabbitNearby = Math.random() < 0.7; // 70% chance the rabbit responds

            if (rabbitNearby) {
                console.log("Flopsy hops out from behind the bushes! You've found your rabbit!");
                rabbitFound = true;
                gameOver = true; // End game when rabbit is found
            } else {
                console.log("No response. The garden is quiet again.");
            }
        } else {
            console.log("Invalid action! Please choose 'look under the bushes' or 'call out'.");
        }
    }
}


// Start the game
startGame();