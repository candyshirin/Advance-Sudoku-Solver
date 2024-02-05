const sudokuArray = [[], [], [], [], [], [], [], [], []]
let selectedOption = 'easy'

document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9
    const solveButton = document.getElementById('solve-btn')
    const NewSudokuButton = document.getElementById('newsudoku-btn');
    NewSudokuButton.addEventListener('click', fetchNewSudoku);
    solveButton.addEventListener('click', solveSudoku)

    const optionsSelect = document.getElementById('options');
    optionsSelect.addEventListener('change', function () {
        selectedOption = optionsSelect.value;
        // Use the selectedOption in your code as needed
         // console.log(`Selected Option: ${selectedOption}`);
    })


    const sudokuGrid = document.getElementById('sudoku-grid')
    // Creating the sudoku grid with input cells

    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr")
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td")
            const input = document.createElement("input")
            input.type = "text"
            input.className = "cell"
            input.id = `cell-${row}-${col}`
            cell.appendChild(input)
            newRow.appendChild(cell)
        }
        sudokuGrid.appendChild(newRow)
    }

})


// This fucntion accepts invalid inputs
// async function solveSudoku() {
//     const gridSize = 9

//     // Filling the sudoku with input value
//     for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//             const cellId = `cell-${row}-${col}`
//             const cellValue = document.getElementById(cellId).value
//             sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0

//         }
//     }

//     // Indetifying user input cells and mark them
//     for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//             const cellId = `cell-${row}-${col}`
//             const cell = document.getElementById(cellId)

//             if (sudokuArray[row][col] !== 0) {
//                 cell.classList.add("user-input")
//             }
//         }
//     }


//     // solve the sudoku and display the solution
//     if (solveSudokuHelper(sudokuArray)) {
//         for (let row = 0; row < gridSize; row++) {
//             for (let col = 0; col < gridSize; col++) {
//                 const cellId = `cell-${row}-${col}`
//                 const cell = document.getElementById(cellId)

//                 // Fill in solved values and apply animation
//                 if (!cell.classList.contains("user-input")) {
//                     cell.value = sudokuArray[row][col]
//                     //cell.classList.remove("newboard", "user-input");
//                     cell.classList.add("solved")
//                     await sleep(20) //add a delay for viualization
//                 }

//             }
//         }
//     }
//     else {
//         alert("No Solution exists for the given Sudoku puzzle")
//     }
// }

// this accepts only valid inputs
async function solveSudoku() {
    const gridSize = 9

    // Filling the sudoku with input value
    let invalidInput = false; // Add a flag to track invalid input

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`
            const cellValue = document.getElementById(cellId).value

            if (cellValue !== "") {
                const parsedValue = parseInt(cellValue);

                // Check for invalid input values
                if (parsedValue < 1 || parsedValue > 9) {
                    alert(`Invalid input value at ROW : ${row+1} COL : ${col+1} . Please enter a number between 1 and 9.`);
                    invalidInput = true;
                    break;
                }

                sudokuArray[row][col] = parsedValue;
            } else {
                sudokuArray[row][col] = 0;
            }
        }
        if (invalidInput) {
            break; // Stop processing if there is an invalid input
        }
    }

    if (!invalidInput) {
        // Indetifying user input cells and mark them
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`
                const cell = document.getElementById(cellId)

                if (sudokuArray[row][col] !== 0) {
                    cell.classList.add("user-input")
                }
            }
        }

        // solve the sudoku and display the solution
        if (solveSudokuHelper(sudokuArray)) {
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const cellId = `cell-${row}-${col}`
                    const cell = document.getElementById(cellId)

                    // Fill in solved values and apply animation
                    if (!cell.classList.contains("user-input")) {
                        cell.value = sudokuArray[row][col]
                        //cell.classList.remove("newboard", "user-input");
                        cell.classList.add("solved")
                        await sleep(20) //add a delay for visualization
                    }
                }
            }
        } else {
            alert("No Solution exists for the given Sudoku puzzle")
        }
    }
}

async function fetchNewSudoku() {
    var newBoard = [[], [], [], [], [], [], [], [], []]
    const xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = async function () {
        const response = JSON.parse(xhrRequest.response);
         newBoard = response.board;

        // Update sudokuArray with the new board
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                sudokuArray[row][col] = newBoard[row][col];
            }
        }

    //   console.log(sudokuArray)
      
        // Display the new board in the DOM
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);
                const cellValue = newBoard[row][col];
                
                // Clear any previous values and classes
                cell.value = '';
                cell.classList.remove("solved", "user-input");
                //cell.classList.add("newboard")

                if (cellValue !== 0) {
                    cell.value = cellValue;
                    await sleep(25)
                }
            }
        }
    };

  // console.log(`https://sugoku.onrender.com/board?difficulty=${selectedOption}`)

    xhrRequest.open('get', `https://sugoku.onrender.com/board?difficulty=${selectedOption}`);
    xhrRequest.send();
}

function solveSudokuHelper(board) {
    const gridSize = 9
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {

                        board[row][col] = num

                        if (solveSudokuHelper(board) === true) {
                            return true;
                        }

                        board[row][col] = 0
                    }
                }
                return false; // No valid Sudoku found
            }
        }
    }
    return true // All cells filled
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num){
            return false
        }
        if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] === num) {
            return false
        }
    }
    return true
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}