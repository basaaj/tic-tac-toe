function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if(board[row][column].getValue() === "") {
            board[row][column].addToken(player);
            return true;
        }

        else {
            console.log("You can't pick a non-empty cell!");
            return false;
        }
    };

    // TODO: to remove after implementing UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const checkColumn = (column, player) => {
        let win = true;

        for (let row = 0; row < board.length; row++) {
            if (board[row][column].getValue() !== player) {
                win = false;
            }
        }

        return win;
    }

    const checkRow = (row, player) => {
        let win = true;

        for (let col = 0; col < board.length; col++) {
            if (board[row][col].getValue() !== player) {
                win = false;
            }
        }

        return win;
    }

    const checkDiagonal = (row, column, player) => {
        let win = true;
        let win1 = true;
        let currRow = parseInt(row, 10);
        let currCol = parseInt(column, 10);

        // downward diagonal
        for (let i = 0; i < board.length; i++) {
            currRow = (currRow + 1) % 3;
            currCol = (currCol + 1) % 3;
            let cellVal = board[currRow][currCol].getValue();
            if (cellVal !== player) {
                win = false;
            }
        }

        // upward diagonal
        for (let i = 0; i < board.length; i++) {
            currRow = Math.abs((currRow + 1) % 3);
            currCol = currCol === 0 ? 2 : Math.abs((currCol - 1) % 3);
            let cellVal = board[currRow][currCol].getValue();
            if (cellVal !== player) {
                win1 = false;
            }
        }

        return win || win1;
    }

    return { getBoard, placeToken, printBoard, checkColumn, checkRow, checkDiagonal };
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "O",
            winner: false
        },
        {
            name: playerTwoName,
            token: "X",
            winner: false
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const setWinner = () => {
        activePlayer.winner = true;
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        if (board.placeToken(row, column, getActivePlayer().token)) {
            //TODO: Check if anyone won and relay msg
            if (board.checkColumn(column, getActivePlayer().token) ||
                board.checkRow(row, getActivePlayer().token) ||
                board.checkDiagonal(row, column, getActivePlayer().token)) {
                setWinner();

                //TODO: Disable game or immediately restart
            }

            else {
                // Switch player turn
                switchPlayerTurn();
            }
            
            printNewRound();
        }
    };

    // Initial play game message
    printNewRound();

    // TODO: getActivePlayer is needed when UI is implemented
    return { playRound, getActivePlayer, getBoard: board.getBoard };
}
  
function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        if (activePlayer.winner) {
            playerTurnDiv.textContent = `${activePlayer.name} won!`;
        }

        else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
        
         // Add event listener for the board
        function clickHandlerBoard(e) {
            const selectedColumn = e.target.dataset.column;
            const selectedRow = e.target.dataset.row;

            if (!selectedColumn && !selectedRow) return;
            
            game.playRound(selectedRow, selectedColumn);
            updateScreen();
        }

        boardDiv.addEventListener("click", clickHandlerBoard);
    }
  
    // Initial render
    updateScreen();
}
  
ScreenController();