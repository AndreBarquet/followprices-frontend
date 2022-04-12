import React, { useEffect, useState } from "react";

// Redux
import { fetchTypesShort } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  ${props => props.hasChartData && 'margin-left: 5rem;'}
  margin-bottom: 1rem;

  .MuiAutocomplete-root {
    margin-right: 25px;
  }
`;

const priceTypeLabel = { inCashValue: "Valor à vista", inTermValue: "Valor à prazo" };

function Home() {
  const dispatch = useDispatch();
  const { typesShortList } = useSelector((state) => state.types);


  function retrieveTypesList() {
    dispatch(fetchTypesShort());
  }


  useEffect(() => {
    retrieveTypesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App" style={{ padding: 10 }}>
      Inicio
    </div>
  );
}

export default Home;