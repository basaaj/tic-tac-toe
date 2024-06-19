function Gameboard() {
    const board = [];
    const winningConditions= [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < 9; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i].resetValue();
        }
    };

    const placeToken = (index, player) => {
        if(board[index].getValue() === "") {
            board[index].addToken(player);
            return true;
        }

        else {
            console.log("You can't pick a non-empty cell!");
            return false;
        }
    };

    const checkWin = (player) => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]].getValue();
            let b = board[winCondition[1]].getValue();
            let c = board[winCondition[2]].getValue();

            if (a === b && b === c && a === player) {
                roundWon = true;
                break;
            }
        }

        return roundWon;
    };

    return { getBoard, placeToken, checkWin, clearBoard };
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    const resetValue = () => {
        value = "";
    };

    return { addToken, getValue, resetValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    let play = true;

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
        play = false;
    }

    const playRound = (index) => {
        if (board.placeToken(index, getActivePlayer().token)) {
            if (board.checkWin(getActivePlayer().token)) {
                setWinner();
            }

            else {
                // Switch player turn
                switchPlayerTurn();
            }
        }
    };

    const getState = () => play;

    const reset = () => {
        play = true;
        board.clearBoard();
        activePlayer.winner = false;
        activePlayer = players[0];
    };

    return { playRound, getActivePlayer, getBoard: board.getBoard, reset, getState };
}
  
function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const reset = document.querySelector('#reset');
  
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
        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");

            cellButton.dataset.index = index;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
        });
        
         // Add event listener for the board
        function clickHandlerBoard(e) {
            const spot = e.target.dataset.index;

            if (!spot || !game.getState()) return;
            
            game.playRound(spot);
            updateScreen();
        }

        boardDiv.addEventListener("click", clickHandlerBoard);
    }
  
    // Initial render
    updateScreen();

    reset.addEventListener('click', () => {
        game.reset();
        updateScreen();
    });
}
  
ScreenController();