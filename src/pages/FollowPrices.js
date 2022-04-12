import React, { useEffect, useState } from "react";

// Redux
import { fetchProductsShort } from "../model/productsStore";
import { fetchTypesShort } from "../model/typesStore";
import { fetchProductPrices } from "../model/pricesStore";
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

function FollowPrices() {
  const dispatch = useDispatch();
  const { typesShortList } = useSelector((state) => state.types);

  const [showingProducts, setShowingProducts] = useState([{ ...NEW_PRODUCT_PROPS }]);

  function addMoreProduct() {
    const listMapped = JSON.parse(JSON.stringify(showingProducts));
    listMapped.push({ ...NEW_PRODUCT_PROPS });
    setShowingProducts(listMapped);
  }

  function removeCurrentProduct(productIndex) {
    const listMapped = JSON.parse(JSON.stringify(showingProducts));
    listMapped.splice(productIndex, 1);
    setShowingProducts(listMapped);
  }

  function retrieveTypesList() {
    dispatch(fetchTypesShort());
  }

  function retrieveProductsList(selectedType, currentProductIndex) {
    if (notExists(selectedType)) return;
    const payload = { typeId: selectedType?.id }

    const callback = (response) => {
      const listMapped = JSON.parse(JSON.stringify(showingProducts));

      listMapped[currentProductIndex] = { ...listMapped[currentProductIndex], productsList: response };
      setShowingProducts(listMapped);
    }

    dispatch(fetchProductsShort({ payload, callback }))
  }

  function retrieveProductPrice(selectedProduct, currentProductIndex) {
    if (notExists(selectedProduct)) return;
    const payload = { productId: selectedProduct?.id };

    const callback = (response) => {
      const listMapped = JSON.parse(JSON.stringify(showingProducts));

      listMapped[currentProductIndex] = { ...listMapped[currentProductIndex], prices: response?.content ?? [] };
      setShowingProducts(listMapped);
    };

    dispatch(fetchProductPrices({ payload, callback }))
  }

  function onTypeChange(selectedType, currentProductIndex) {
    showingProducts[currentProductIndex] = {
      ...showingProducts[currentProductIndex],
      type: selectedType,
      product: undefined,
      productsList: [],
      prices: [],
    };
    retrieveProductsList(selectedType, currentProductIndex);
  }

  function onProductChange(selectedProduct, currentProductIndex) {
    showingProducts[currentProductIndex] = {
      ...showingProducts[currentProductIndex],
      product: selectedProduct,
      prices: [],
    };
    retrieveProductPrice(selectedProduct, currentProductIndex);
  }

  useEffect(() => {
    retrieveTypesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFilters = (currentItem, itemIndex) => {
    return (
      <FilterContainer hasChartData={exists(currentItem?.prices) && currentItem.prices.length > 0}>
        <Autocomplete
          disablePortal
          options={typesShortList ?? []}
          getOptionLabel={option => option.description}
          noOptionsText="Não há dados"
          sx={{ width: 300 }}
          value={currentItem?.type}
          onChange={(_, value) => onTypeChange(value, itemIndex)}
          renderInput={(params) => <TextField {...params} label="Selecione o tipo do produto" variant="standard" />}
        />
        <Autocomplete
          disablePortal
          options={currentItem?.productsList ?? []}
          getOptionLabel={option => option.name}
          noOptionsText="Não há dados"
          sx={{ width: 400 }}
          value={currentItem?.product}
          onChange={(_, value) => onProductChange(value, itemIndex)}
          renderInput={(params) => <TextField {...params} label="Selecione o produto" variant="standard" />}
        />
      </FilterContainer>
    )
  }

  const renderChart = (dataSource) => {
    if (notExists(dataSource) || dataSource.length <= 0) return;

    return (
      <ResponsiveContainer width='100%' height={300}>
        <LineChart width={1020} height={200} data={dataSource} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={value => formatDate(value) ?? '-'} />
          <YAxis />
          <Tooltip formatter={(value, name) => [<FormattedNumer prefix="R$ " value={value} />, priceTypeLabel[name]]} labelFormatter={value => `Data: ${formatDate(value) ?? '-'}`} />
          <Legend formatter={value => priceTypeLabel[value]} />
          <Line type="monotone" dataKey="inCashValue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="inTermValue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="App" style={{ padding: 10 }}>
      <Button style={{ marginBottom: 10 }} variant="contained" startIcon={<AddIcon />} onClick={addMoreProduct}>
        Acompanhar produto
      </Button>
      {exists(showingProducts) && showingProducts.length > 0 && showingProducts.map((currentItem, itemIndex) => (
        <Accordion defaultExpanded={true} key={itemIndex}>
          <AccordionSummary expandIcon={<CloseIcon onClick={() => removeCurrentProduct(itemIndex)} />} id={itemIndex}>
            <Typography>
              {currentItem?.product?.name ?? 'Acompanhar novo produto'}
              {exists(currentItem?.product?.description) &&
                <p style={{ margin: 0, fontSize: 15, color: '#9f9f9f' }}>{currentItem?.product?.description}</p>
              }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderFilters(currentItem, itemIndex)}
            {renderChart(currentItem?.prices)}
          </AccordionDetails>
        </Accordion>
      ))
      }
    </div >
  );
}

export default FollowPrices;