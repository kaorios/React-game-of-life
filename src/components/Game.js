import React from 'react';
import Board from './Board';

const CELL_SIZE = 20;

class Game extends React.Component {
  constructor() {
    super();

    this.interval = 100;

    this.state = {
      cells: this.makeEmptyCells(),
      isRunning: false,
      generation: 0,
    };
  }

  makeEmptyCells() {
    let cells = [];
    for (let y = 0; y < CELL_SIZE; y++) {
      cells[y] = [];
      for (let x = 0; x < CELL_SIZE; x++) {
        cells[y][x] = false;
      }
    }
    return cells;
  }

  runGame() {
    this.setState({isRunning: true});
    this.runIteration();
  }

  stopGame() {
    this.setState({isRunning: false});
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  runIteration() {
    const {cells} = this.state;
    let newCells = this.makeEmptyCells();
    let isExtinction = true;

    for (let row = 0; row < CELL_SIZE; row++) {
      for (let col = 0; col < CELL_SIZE; col++) {
        let neighbors = this.calculateNeighbors(cells, row, col);

        if (cells[row][col]) {
          if (neighbors === 2 || neighbors === 3) {
            newCells[row][col] = true;
            isExtinction = false;
          } else {
            newCells[row][col] = false;
          }
        } else {
          if (neighbors === 3) {
            newCells[row][col] = true;
            isExtinction = false;
          }
        }
      }
    }

    this.setState({cells: newCells});
    this.setState({generation: this.state.generation+1});

    if (isExtinction) {
      this.setState({generation: `${this.state.generation} (Extinction)`});
      this.stopGame();
      return;
    }

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.interval);
  }

  calculateNeighbors(cells, row, col) {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let row1 = row + dir[0];
      let col1 = col + dir[1];

      if (col1 >= 0 && col1 < CELL_SIZE && row1 >= 0 && row1 < CELL_SIZE && cells[row1][col1]) {
        neighbors++;
      }
    }

    return neighbors;
  }

  handleClick(row, col) {
    const newCells = this.state.cells.slice();
    newCells[row][col] = !newCells[row][col];
    this.setState({cells: newCells});
  }

  render() {
    const {cells, isRunning} = this.state;
    return (
        <div>
          <Board grid={CELL_SIZE} cells={cells} onClick={(row, col) => this.handleClick(row, col)}></Board>

          <div className="controls">
            <p>Generations: {this.state.generation}</p>
            {isRunning ?
                <button onClick={() => this.stopGame()}>Stop</button> :
                <button onClick={() => this.runGame()}>Run</button>
            }
          </div>
        </div>
    )
  }
}

export default Game;
