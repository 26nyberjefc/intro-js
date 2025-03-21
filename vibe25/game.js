class PizzaTycoon {
    constructor() {
        this.money = 50; // Starting money
        this.pizzaPrice = 10; // Base price per pizza (this will increase with recipes)
        this.pizzasSold = 0; // Number of pizzas sold
        this.ovenCount = 1; // Number of ovens (affects how fast pizzas are made)
        this.staffCount = 0; // Number of staff (affects how fast pizzas are sold)
        this.staffCost = 20; // Cost to hire one staff member
        this.ovenCost = 50; // Cost to buy one oven
        this.recipes = {
            pepperoni: { price: 40, bought: false, priceIncrease: 5 },
            mushroom: { price: 60, bought: false, priceIncrease: 7 },
            sausage: { price: 80, bought: false, priceIncrease: 10 },
            stuffedCrust: { price: 100, bought: false, priceIncrease: 12 }
        };
    }

    // Function to make pizzas and sell them
    makePizza() {
        const pizzasMade = this.ovenCount; // Number of pizzas made is equal to the number of ovens
        this.money += pizzasMade * this.pizzaPrice; // Earn money for each pizza sold
        this.pizzasSold += pizzasMade; // Increase the number of pizzas sold
        console.log(`You made ${pizzasMade} pizza(s) and earned $${pizzasMade * this.pizzaPrice}.`);
    }

    // Function to hire staff (which helps sell pizzas faster)
    hireStaff() {
        // Increase staff cost as the number of staff increases
        const staffIncreaseCost = this.staffCount * 30;  // Staff cost increases by $30 per staff member
        if (this.money >= staffIncreaseCost) {
            this.money -= staffIncreaseCost;
            this.staffCount++;
            console.log(`You hired a staff member! You now have ${this.staffCount} staff(s).`);
        } else {
            console.log("You don't have enough money to hire staff.");
        }
    }
    
    // Function to buy more ovens (which helps you make more pizzas)
    buyOven() {
        if (this.money >= this.ovenCost) {
            this.money -= this.ovenCost;
            this.ovenCount++;
            console.log(`You bought an oven! You now have ${this.ovenCount} oven(s).`);
        } else {
            console.log("You don't have enough money to buy an oven.");
        }
    }

    // Function to buy pizza recipes (increases pizza price)
    buyRecipe(recipe) {
        const recipeDetails = this.recipes[recipe];
        if (!recipeDetails.bought) {
            if (this.money >= recipeDetails.price) {
                this.money -= recipeDetails.price;
                this.pizzaPrice += recipeDetails.priceIncrease;
                recipeDetails.bought = true;
                console.log(`You bought the ${recipe} recipe! Pizza price is now $${this.pizzaPrice}.`);
            } else {
                console.log(`You don't have enough money to buy the ${recipe} recipe.`);
            }
        } else {
            console.log(`You already bought the ${recipe} recipe.`);
        }
    }

    // Display the current status of the tycoon business
    showStatus() {
        console.log("\nCurrent Status:");
        console.log(`Money: $${this.money}`);
        console.log(`Pizzas Sold: ${this.pizzasSold}`);
        console.log(`Ovens: ${this.ovenCount}`);
        console.log(`Staff: ${this.staffCount}`);
        console.log(`Pizza Price: $${this.pizzaPrice}`);
        console.log(`Recipes: ${Object.keys(this.recipes).filter(r => this.recipes[r].bought).join(", ") || "None"}\n`);
    }

    // Function to handle player actions and choices
    async promptAction() {
        const action = await this.askQuestion(`
            What would you like to do?
            1. Make pizza
            2. Hire staff
            3. Buy oven
            4. Buy a recipe (Pepperoni, Mushroom, Sausage, Stuffed Crust)
            5. Check status
            6. Exit game
        `);

        switch (action) {
            case '1':
                this.makePizza();
                break;
            case '2':
                this.hireStaff();
                break;
            case '3':
                this.buyOven();
                break;
            case '4':
                const recipeChoice = await this.askQuestion(`
                    Which recipe would you like to buy?
                    1. Pepperoni ($40) 
                    2. Mushroom ($60)
                    3. Sausage ($80)
                    4. Stuffed Crust ($100)
                `);
                switch (recipeChoice) {
                    case '1': this.buyRecipe('pepperoni'); break;
                    case '2': this.buyRecipe('mushroom'); break;
                    case '3': this.buyRecipe('sausage'); break;
                    case '4': this.buyRecipe('stuffedCrust'); break;
                    default: console.log("Invalid choice. Try again."); break;
                }
                break;
            case '5':
                this.showStatus();
                break;
            case '6':
                console.log("Thanks for playing!");
                process.exit();
                break;
            default:
                console.log("Invalid choice, please choose again.");
        }

        // Continue the game loop
        this.promptAction();
    }

    // Utility function to prompt the player for input
    askQuestion(query) {
        return new Promise(resolve => {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(query, answer => {
                rl.close();
                resolve(answer);
            });
        });
    }

    // Start the game
    startGame() {
        console.log("Welcome to Pizza Tycoon!");
        this.promptAction();
    }
}

// Create a new PizzaTycoon game instance and start the game
const myPizzaTycoon = new PizzaTycoon();
myPizzaTycoon.startGame();