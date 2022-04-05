import React from 'react';

import { useNavigate } from 'react-router-dom';

// Styles
import styled from 'styled-components';

const MainContainer = styled.div`
  padding: 10px;
  `;

const PageNotFound = props => {
  const history = useNavigate();

  function backFunction() {
    history('/');
  }

  return (
    <MainContainer>
      <span>Página não encontrada</span>
    </MainContainer>
  );
}

export default PageNotFound;
