import React from 'react';
import Square from './Square';

export default class Board extends React.PureComponent {
  renderSquare(i) {
    const highlight = this.props.result && (
      this.props.result.squares[0] === i ||
      this.props.result.squares[1] === i ||
      this.props.result.squares[2] === i
    );
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
