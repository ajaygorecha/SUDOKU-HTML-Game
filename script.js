document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const hintCounter = document.getElementById('hint-counter');
    const message = document.getElementById('message');
    let hintsUsed = 0;
    const maxHints = 10;

    // Function to create the board
    function createBoard() {
        board.innerHTML = ''; // Clear the board
        for (let i = 0; i < 81; i++) {
            const input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('min', '1');
            input.setAttribute('max', '9');
            board.appendChild(input);
        }
    }

    // Function to get the current board state
    function getBoard() {
        const inputs = board.querySelectorAll('input');
        const boardState = [];
        inputs.forEach(input => {
            const value = input.value ? parseInt(input.value) : 0;
            boardState.push(value);
        });
        return boardState;
    }

    // Function to set the board state
    function setBoard(boardState) {
        const inputs = board.querySelectorAll('input');
        inputs.forEach((input, i) => {
            input.value = boardState[i] ? boardState[i] : '';
        });
    }

    // Sudoku solver (Backtracking algorithm)
    function solveSudoku(board) {
        const isValid = (board, row, col, num) => {
            for (let x = 0; x < 9; x++) {
                if (board[row * 9 + x] === num || board[x * 9 + col] === num || board[Math.floor(row / 3) * 27 + Math.floor(col / 3) * 3 + (x % 3) + Math.floor(x / 3) * 9] === num) {
                    return false;
                }
            }
            return true;
        };

        const solve = (board) => {
            for (let i = 0; i < 81; i++) {
                if (board[i] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, Math.floor(i / 9), i % 9, num)) {
                            board[i] = num;
                            if (solve(board)) {
                                return true;
                            }
                            board[i] = 0;
                        }
                    }
                    return false;
                }
            }
            return true;
        };

        const boardCopy = [...board];
        if (solve(boardCopy)) {
            return boardCopy;
        }
        return null;
    }

    // Function to provide a random hint
    function provideHint() {
        if (hintsUsed >= maxHints) {
            message.textContent = 'You have used all 10 hints!';
            return;
        }

        const boardState = getBoard();
        const solvedBoard = solveSudoku(boardState);

        if (solvedBoard) {
            let emptyCells = [];
            for (let i = 0; i < 81; i++) {
                if (boardState[i] === 0) {
                    emptyCells.push(i);
                }
            }

            if (emptyCells.length > 0) {
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                boardState[randomIndex] = solvedBoard[randomIndex];
                setBoard(boardState);
                hintsUsed++;
                hintCounter.textContent = `Hints used: ${hintsUsed}/10`;
                message.textContent = '';
            } else {
                message.textContent = 'No empty cells available for a hint!';
            }
        } else {
            message.textContent = 'No solution exists!';
        }
    }

    // Function to fill random cells at the start
    function fillRandomCells(count) {
        const boardState = getBoard();
        const solvedBoard = solveSudoku(boardState);
        if (solvedBoard) {
            let emptyCells = [];
            for (let i = 0; i < 81; i++) {
                emptyCells.push(i);
            }
            for (let i = 0; i < count; i++) {
                const randomIndex = emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1)[0];
                boardState[randomIndex] = solvedBoard[randomIndex];
            }
            setBoard(boardState);
        }
    }

    // Function to restart the game
    function restartGame() {
        hintsUsed = 0;
        hintCounter.textContent = `Hints used: ${hintsUsed}/10`;
        message.textContent = '';
        createBoard();
        fillRandomCells(10); // Fill 10 random cells
    }

    // Event listener for the solve button
    document.getElementById('solve-button').addEventListener('click', () => {
        const boardState = getBoard();
        const solvedBoard = solveSudoku(boardState);
        if (solvedBoard) {
            setBoard(solvedBoard);
        } else {
            message.textContent = 'No solution exists!';
        }
    });

    // Event listener for the hint button
    document.getElementById('hint-button').addEventListener('click', provideHint);

    // Event listener for the restart button
    document.getElementById('restart-button').addEventListener('click', restartGame);

    // Initialize the board and fill random cells
    createBoard();
    fillRandomCells(10); // Fill 10 random cells at the start
});
