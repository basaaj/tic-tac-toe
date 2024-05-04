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

    // TODO: UI render this board
    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if(board[row][column].getValue() === "-") {
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
    let value = "-";

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
    return { playRound, getActivePlayer };
}
  
const game = GameController();