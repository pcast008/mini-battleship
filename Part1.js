var rs = require('readline-sync')

let rowLetter
let colNumber
let guesses = []
let ships = 0
let grid

startGame()

function buildGrid() {
    grid = {
        A: { 1: "O", 2: "O", 3: "O" },
        B: { 1: "O", 2: "O", 3: "O" },
        C: { 1: "O", 2: "O", 3: "O" }
    }
}

function resetGame() {
    clearGuesses()
    buildGrid()
}

function clearGuesses() {
    guesses = []
}

function startGame() {
    rs.keyIn('Press any key to start the game. ')

    let userLocation = askForUserLocation() 
    buildGrid()
    generateRandomRowAndCol()
    placeShip()
    generateRandomRowAndCol()
    placeShip()
    
    while (ships > 0) {
        // check if location exists - if exists, ask for location again
        while (checkUserLocationExistence(userLocation)) {
            console.log("You have already picked this location. Miss!")
            userLocation = askForUserLocation() 
        }
        
        // if location does not exist, was there a hit
        
        if (checkHit(userLocation)) {
            if (ships === 0) {
                if (playAgain()) {
                    console.table(grid)
                    resetGame()
                    startGame()
                } else {
                    console.table(grid)
                    process.exit()
                }
            } else {
                console.log(`Hit. You have sunk a battleship. ${ships} ship remaining.`)
            }
        } else {
            console.log("You have missed!")
        }
    
        userLocation = askForUserLocation()
    }
}

function playAgain() {
    const playAgain = rs.keyInYN("You have destroyed all battleships. Would you like to play again? Y/N: ")
    return playAgain ? true : false
}

function checkHit(loc) {
    const row = loc[0]
    const col = loc[1]

    if (grid[row][col] === "X") {
        logGuess(loc)
        ships--
        return true
    } else {
        logGuess(loc)
        return false
    }
}

function logGuess(loc) {
    guesses.push(loc)
}

function checkUserLocationExistence(loc) {
    if (guesses.includes(loc)) {
        return true
    } else {
        logGuess(loc)
        return false
    }
}

function askForUserLocation() {
    const userLocation = rs.question("Enter a location to strike ie 'A2': ")
    const row = userLocation[0].toUpperCase()
    const col = userLocation[1]

    return row.concat(col)
}

function generateRandomRowAndCol() {
    const row = ["A", "B", "C"]
    const col = ["1", "2", "3"]

    rowLetter = row[Math.floor(Math.random() * row.length)]
    colNumber = col[Math.floor(Math.random() * col.length)]
}

function placeShip() {
    while (grid[rowLetter][colNumber] === "X") {
        generateRandomRowAndCol()
    }

    grid[rowLetter][colNumber] = "X"
    ships++
}