import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.highlight ? 'highlight' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let highlight = false;
    if (this.props.result) {
      highlight =
        this.props.result.squares[0] === i ||
        this.props.result.squares[1] === i ||
        this.props.result.squares[2] === i;
    }
    return (
      <Square
        highlight={highlight}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard(rows, cols) {
    const board = [];
    let number = 0;
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(this.renderSquare(number++));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return board;
  }

  render() {
    return <div>{this.createBoard(3, 3)}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          step: 0,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          step: history.length,
          location: locations[i],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  sortMoves() {
    this.setState((prevState) => ({history: prevState.history.reverse()}));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);

    const moves = history.map(({step, location}, move) => {
      const desc = step ?
        'Go to move #' + step + location :
        'Go to game start';
      const current = step === this.state.stepNumber ? 'current' : '';
      return (
        <li key={move}>
          <button
            className={current}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (result) {
      status = 'Winner: ' + result.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            result={result}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="sort-button"
                  onClick={() => this.sortMoves()}>sort
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));

const locations = {
  0: '(row: 1, col: 1)',
  1: '(row: 1, col: 2)',
  2: '(row: 1, col: 3)',
  3: '(row: 2, col: 1)',
  4: '(row: 2, col: 2)',
  5: '(row: 2, col: 3)',
  6: '(row: 3, col: 1)',
  7: '(row: 3, col: 2)',
  8: '(row: 3, col: 3)',
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        squares: [a, b, c],
      };
    }
  }
  return null;
}
