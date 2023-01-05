var rs = require('readline-sync')

let availableLetters
let numberOfColumns
let direction 
let startingLetter
let startingNumber
let shipPlacementSuccessful = false
let grid = {}
// let displayGrid = {}
let guesses = []
let shipCount = 0
let ships = [
    {
        units: 2,
        locations: []
    },
    {
        units: 3,
        locations: []
    },
    {
        units: 3,
        locations: []
    },
    {
        units: 4,
        locations: []
    },
    {
        units: 5,
        locations: []
    }
]

buildGrid(10)
placeAllShips()
console.log(shipCount)
console.log(ships)
console.table(grid)


function resetGame() {
    clearGuesses()
    buildGrid(10)
}

function clearGuesses() {
    guesses = []
}

function checkHit(loc) {
    const row = loc[0]
    const col = loc.slice(1)

    ships.forEach(ship => {
        ship.locations.forEach(location => {
            if (location === loc) {
                grid[row][col] === "X"
                logGuess(loc)
                return true
            }
        })
    })

    grid[row][col] === "O"
    logGuess(loc)
    return false
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
    const col = userLocation.slice(1)

    return row.concat(col)
}



function buildGrid(n) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    availableLetters = letters.slice(0, n)
    numberOfColumns = n

    for (let l = 0; l < letters.slice(0, n).length; l++) {
        for (let i = 0; i < n; i++) { 
            grid[letters[l]] = { ...grid[letters[l]], [i + 1]: "" }
        }
    }
}

function generateRandomValues() {
    direction = Math.round(Math.random())
    startingLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)]
    startingNumber = Math.floor(Math.random() * numberOfColumns) + 1
}

function placeAllShips() {
    ships.map(ship => {
        while (!shipPlacementSuccessful) {
            placeShip(ship)
        }
        shipCount++
        shipPlacementSuccessful = false
    })
}

function removeShip(ship) {
    ship.locations.forEach(location => grid[location[0]][location.slice(1)] = "")
    ship.locations = []
}

function placeShip(ship) {
    generateRandomValues()

    while (grid[startingLetter][startingNumber] === "X") {
        generateRandomValues()
    }

    grid[startingLetter][startingNumber] = "X"
    ship.locations.push(startingLetter.concat(startingNumber))

    // direction 1 is vertical and direction 0 is horizontal
    if (direction === 1) {
        for (let i = 1; i < ship.units; i++) {
            const prevLetter = availableLetters[availableLetters.indexOf(startingLetter) - i]

            if (prevLetter === undefined || grid[prevLetter][startingNumber] === "X") {
                shipPlacementSuccessful = false
                removeShip(ship)
                return
            } else {
                grid[prevLetter][startingNumber] = "X"
                ship.locations.push(prevLetter.concat(startingNumber))
                shipPlacementSuccessful = true
            }  
        }          
    }

    if (direction === 0) {
        for (let i = 1; i < ship.units; i++) {
            if (grid[startingLetter][startingNumber + i] === "X" || grid[startingLetter][startingNumber + i] === undefined) {
                shipPlacementSuccessful = false
                removeShip(ship)
                return
            } else {
                grid[startingLetter][startingNumber + i] = "X"
                ship.locations.push(startingLetter.concat(startingNumber + i))
                shipPlacementSuccessful = true
            }
        }
    }
}
