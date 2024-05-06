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

    return { getBoard, placeToken, printBoard };
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
            token: "O"
        },
        {
            name: playerTwoName,
            token: "X"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        if (board.placeToken(row, column, getActivePlayer().token)) {
            // Switch player turn
            switchPlayerTurn();
            printNewRound();

            //TODO: Check if anyone won and relay msg
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
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

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