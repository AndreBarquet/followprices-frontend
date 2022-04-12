import React, { useEffect, useState } from "react";

// Redux
import { fetchProductsShort } from "../model/productsStore";
import { fetchTypesShort } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

// Utils
import { exists, formatDate, notExists } from "../utils/utils";

// Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Components
import FormattedNumer from '../Components/FormattedNumber/FormattedNumber';
import { TextField, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

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
const NEW_PRODUCT_PROPS = { type: undefined, product: undefined, productsList: [], prices: [], };

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
      Início
    </div >
  );
}

export default Home;