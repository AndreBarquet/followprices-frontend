import React, { useEffect, useState } from "react";

// Redux
import { fetchProductsShort } from "../model/productsStore";
import { fetchProductPrices } from "../model/pricesStore";
import { fetchTypesShort } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

// Utils
import { exists, formatDate, notExists } from "../utils/utils";

// Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Components
import FormattedNumer from '../Components/FormattedNumber/FormattedNumber';
import { TextField, Autocomplete, Accordion, AccordionSummary, AccordionDetails, Button, Drawer, Box, List, Backdrop, CircularProgress } from "@mui/material";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardIos'

import styled from 'styled-components';

const ComputerPartContainer = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding: 18px 12px;
  border-radius: 5px;
  border: 1px solid #ededed;
  box-shadow: 0px 14px 4px -9px #e3e3e3;
  color: #505050;
  cursor: pointer;

  p {
    font-size: 16px;
    margin: 0px;
    font-weight: bold;
  }
`;

const DrawerTitle = styled.p`
  padding: 18px 15px;
  margin: 0;
  font-size: 20px;
  color: white;
  background-color: #1976d2;
`;

const ProductOptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #95caff;
  border-radius: 8px;
  margin-bottom: 8px;

  .title{
    font-weight: bold;
    margin: 0px 0px 2px 0px;
  }

  .description{
    color: #1976d2;
  }

  .actionIcon{
    cursor: pointer;
    color: #1976d2;
  }
`;

function MountYourPc() {
  const dispatch = useDispatch();
  const { productsShortList, loadingProductsShortList } = useSelector((state) => state.products);
  const { typesShortList, typesShortListLoading } = useSelector((state) => state.types);

  const [showDrawer, setShowDrawer] = useState(false);
  const [openedSectionType, setOpenedSectionType] = useState(null)
  const [selectedProductsByType, setSelectedProductsByType] = useState({});

  function retrieveProductsList(typeId) {
    if (notExists(typeId)) return;

    const payload = { typeId };
    const callback = (response) => {
      setShowDrawer(true);
    }
    dispatch(fetchProductsShort({ payload, callback }))
  }

  function retrieveTypesList() {
    dispatch(fetchTypesShort())
  }

  function onOpenProductsOptions(type) {
    setOpenedSectionType(type);
    retrieveProductsList(type?.id)
  }

  function onCloseProductsOptions() {
    setShowDrawer(false);
    setOpenedSectionType(null);
  }

  function onAddProduct(selectedProduct) {
    const listMapped = JSON.parse(JSON.stringify(selectedProductsByType));

    if (notExists(listMapped[openedSectionType?.type])) listMapped[openedSectionType?.type] = [];
    listMapped[openedSectionType?.type].push(selectedProduct);
    setSelectedProductsByType(listMapped);
  }

  function onRemoveProduct(selectedProduct) {
    const listMapped = JSON.parse(JSON.stringify(selectedProductsByType));

    const indexToRemove = listMapped[openedSectionType?.type].findIndex(currentProduct => currentProduct?.id === selectedProduct?.id);
    listMapped[openedSectionType?.type].splice(indexToRemove, 1);
    setSelectedProductsByType(listMapped);
  }

  useEffect(() => {
    retrieveTypesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const renderChart = (dataSource) => {
  //   if (notExists(dataSource) || dataSource.length <= 0) return;

  //   return (
  //     <ResponsiveContainer width='100%' height={300}>
  //       <LineChart width={1020} height={200} data={dataSource} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  //         <CartesianGrid strokeDasharray="3 3" />
  //         <XAxis dataKey="date" tickFormatter={value => formatDate(value) ?? '-'} />
  //         <YAxis />
  //         <Tooltip formatter={(value, name) => [<FormattedNumer prefix="R$ " value={value} />, priceTypeLabel[name]]} labelFormatter={value => `Data: ${formatDate(value) ?? '-'}`} />
  //         <Legend formatter={value => priceTypeLabel[value]} />
  //         <Line type="monotone" dataKey="inCashValue" stroke="#82ca9d" />
  //         <Line type="monotone" dataKey="inTermValue" stroke="#8884d8" />
  //       </LineChart>
  //     </ResponsiveContainer>
  //   )
  // }

  // {exists(showingProducts) && showingProducts.length > 0 && showingProducts.map((currentItem, itemIndex) => (
  //   <Accordion defaultExpanded={true} key={itemIndex}>
  //     <AccordionSummary expandIcon={<DeleteIcon onClick={() => removeCurrentProduct(itemIndex)} />} id={0}>
  //       <Typography>
  //         {currentItem?.product?.name ?? 'Acompanhar novo produto'}
  //         {exists(currentItem?.product?.description) &&
  //           <p style={{ margin: 0, fontSize: 15, color: '#9f9f9f' }}>{currentItem?.product?.description}</p>
  //         }
  //       </Typography>
  //     </AccordionSummary>
  //     <AccordionDetails>
  //       {renderFilters(currentItem, itemIndex)}
  //       {renderChart(currentItem?.prices)}
  //     </AccordionDetails>
  //   </Accordion>
  // ))
  // }

  const hasAlreadyAddProduct = (renderedProduct) => {
    if (notExists(selectedProductsByType) || notExists(productsShortList) || notExists(openedSectionType)) return false;

    const productsList = selectedProductsByType[openedSectionType?.type];
    if (notExists(productsList) || productsList.length <= 0) return false;

    return productsList.some(currentProduct => currentProduct?.id === renderedProduct?.id);
  }

  const renderProductsOptions = () => {
    return (
      <Box sx={{ width: 600 }} role="presentation" onKeyDown={() => setShowDrawer(false)}>
        <DrawerTitle>{`Selecionar: ${openedSectionType?.description}`}</DrawerTitle>
        <div style={{ padding: 15 }}>
          <List>
            {exists(productsShortList) && productsShortList.map(currentProduct => (
              <ProductOptionContainer>
                <div>
                  <p className="title">{currentProduct?.name}</p>
                  <span className="description">{currentProduct?.description}</span>
                </div>
                {hasAlreadyAddProduct(currentProduct)
                  ? <DeleteIcon className="actionIcon" onClick={() => onRemoveProduct(currentProduct)} />
                  : <AddIcon className="actionIcon" onClick={() => onAddProduct(currentProduct)} />
                }
              </ProductOptionContainer>
            ))}
          </List>
        </div>
      </Box>
    )
  }

  return (
    <div className="App" style={{ padding: '10px 20px' }}>
      <Backdrop sx={{ color: '#74baff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={typesShortListLoading || loadingProductsShortList}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {exists(typesShortList) && typesShortList.length > 0 && typesShortList.map(currentType => {
        if (exists(selectedProductsByType[currentType?.type]) && selectedProductsByType[currentType?.type].length > 0) {
          return (
            <ComputerPartContainer onClick={() => onOpenProductsOptions(currentType)}>
              <p>{currentType?.description}</p>
              {selectedProductsByType[currentType?.type].map(currentProduct => (
                <p>{currentProduct?.name}</p>
              ))}
              <ArrowRightIcon />
            </ComputerPartContainer>
          )
        }

        return (
          <ComputerPartContainer onClick={() => onOpenProductsOptions(currentType)}>
            <p>{currentType?.description}</p>
            <ArrowRightIcon />
          </ComputerPartContainer>
        )
      })}

      <Drawer anchor="right" open={showDrawer} onClose={onCloseProductsOptions}>
        {renderProductsOptions()}
      </Drawer>
    </div>
  );
}

export default MountYourPc;