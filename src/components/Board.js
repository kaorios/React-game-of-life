import React from "react";
import styled from 'styled-components';

import Cell from './Cell';

const BoardBase = styled.div`
  width: 400px;
  height: 400px;
`;

const Rows = styled.div`
  display:flex;
`;

class Board extends React.Component {

  renderCell(row, col) {
    return (
        <Cell
            key={row + col}
            width={400 / this.props.grid}
            isAlive={this.props.cells[row][col]}
            onClick={() => this.props.onClick(row, col)}
        ></Cell>
    );
  }

  createCells = () => {
    let cells = [];

    for (let row = 0; row < this.props.grid; row++) {
      let rows = []
      for (let col = 0; col < this.props.grid; col++) {
        rows.push(this.renderCell(row, col));
      }
      cells.push(<Rows key={row}>{rows}</Rows>)
    }
    return cells;
  };

  render() {
    return (
        <BoardBase>
          {this.createCells()}
        </BoardBase>
    )
  }
}

export default Board;
