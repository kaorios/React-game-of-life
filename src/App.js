import React, { Component } from 'react';
import styled from 'styled-components';

import Game from './components/Game';

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
  color: palevioletred;
`;


class App extends Component {
  render() {
    return (
      <Wrapper>
        <Game></Game>
      </Wrapper>
    );
  }
}

export default App;
