import React from "react";
import styled from "styled-components";

const Grid = styled.div`
  box-sizing: border-box;
  border: 1px solid #eee;
  background: ${props => props.isAlive ? "palevioletred" : "#ccc"};
  cursor: pointer;
`;

class Cell extends React.Component {
  render() {
    const {isAlive, width, onClick} = this.props;
    return (
        <Grid isAlive = {isAlive}
              style={{ width: width, height: width }}
              onClick={onClick}/>
    );
  }
}

export default Cell;
