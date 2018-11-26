import React from 'react';
import styled from 'styled-components';

import Board from './Board';

const CELL_SIZE = 20;

const Wrapper = styled.section`
  padding: 4em 0;
  background: papayawhip;
  color: palevioletred;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  text-align: center;
`;

const Button = styled.button`
  display: inline-block;
  background: palevioletred;
  color: #fff;
  border: none;
  font-size: 1.2rem;
  padding: .5em 2em;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  margin-right: 1em;
  :hover {
    opacity: .7;
  }
`;

class Game extends React.Component {
  constructor() {
    super();

    this.interval = 100;
    this.isExtinction = false;
    this.generation = 0;

    this.state = {
      cells: this.makeEmptyCells(),
      isRunning: false,
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

  resetGame() {
    this.stopGame();
    this.setState({cells: this.makeEmptyCells()});
    this.generation = 0;
    this.isExtinction = false;
  }

  createRandomCells() {
    let newCells = this.makeEmptyCells();

    for (let y = 0; y < CELL_SIZE; y++) {
      newCells[y] = [];
      for (let x = 0; x < CELL_SIZE; x++) {
        newCells[y][x] = Math.round(Math.random()) ? true : false;
      }
    }
    this.setState({cells: newCells});
  }

  runIteration() {
    if (this.isExtinction) {
      console.log(this.generation);
      this.generation = 0;
    }
    const {cells} = this.state;
    let newCells = this.makeEmptyCells();

    this.isExtinction = true;

    for (let row = 0; row < CELL_SIZE; row++) {
      for (let col = 0; col < CELL_SIZE; col++) {
        let neighbors = calculateNeighbors(cells, row, col);

        if (cells[row][col]) {
          if (neighbors === 2 || neighbors === 3) {
            newCells[row][col] = true;
            this.isExtinction = false;
          } else {
            newCells[row][col] = false;
          }
        } else {
          if (neighbors === 3) {
            newCells[row][col] = true;
            this.isExtinction = false;
          }
        }
      }
    }

    this.setState({cells: newCells});
    this.generation++;

    if (this.isExtinction) {
      this.stopGame();
      return;
    }

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.interval);
  }

  handleClick(row, col) {
    const newCells = this.state.cells.slice();
    newCells[row][col] = !newCells[row][col];
    this.setState({cells: newCells});
  }

  render() {
    const {cells, isRunning} = this.state;
    return (
        <Wrapper>
          <div>
            <Title>Game Of Life</Title>
            <Board grid={CELL_SIZE} cells={cells} onClick={(row, col) => this.handleClick(row, col)}></Board>

            <div className="controls">
              <p>Generations: {this.generation} {this.isExtinction ? '(Extinction)' : ''}</p>
              {isRunning ?
                  <Button onClick={() => this.stopGame()}>Stop</Button> :
                  <Button onClick={() => this.runGame()}>Run</Button>
              }
              <Button onClick={() => this.resetGame()}>Reset</Button>
              <Button onClick={() => this.createRandomCells()}>Random</Button>
            </div>
          </div>
        </Wrapper>
    )
  }
}

export default Game;

function calculateNeighbors(cells, row, col) {
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

