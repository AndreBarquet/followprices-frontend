import React, { useEffect, useState } from "react";

// Redux
import { fetchProductsShort } from "../model/productsStore";
import { fetchTypesShort } from "../model/typesStore";
import { insertSetup } from "../model/setup";
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from "notistack";

// Utils
import { exists, notExists } from "../utils/utils";

// Components
import { Button, Drawer, Box, List, Backdrop, CircularProgress } from "@mui/material";

// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardIos';
import AddSetupIcon from '@mui/icons-material/DashboardCustomize';
import BarChartIcon from '@mui/icons-material/Equalizer';

import styled from 'styled-components';

const ComputerPartContainer = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  padding-right: 8px;
  border-radius: 5px;
  border: 1px solid #ededed;
  color: #505050;
  cursor: pointer;
  transition: 0.2s;
  min-height: 68px;
  
  &:hover{
    box-shadow: 0px 14px 4px -9px #e3e3e3;
    transform: scale(1.015);
    margin-bottom: 17px;
  }
`;

const ComputerPartTitle = styled.div`
  background-color: #1976d2;
  color: white;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 20px;
  font-size: 16px;
  margin: 0px;
  width: 9rem;
  word-break: break-all;
  border-radius: 5px 0px 0px 5px;
`;

const ComputerPartItem = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;  
`;

const SelectedProductItem = styled.div`
  padding: 15px 20px;
  display: flex;

  .productQuantity{
    margin-right: 10px;
    font-weight: bold;
  }

  .productName{
    font-size: 16px;
    margin: 0px !important;
    font-weight: bold;
    color: #404040;
  }

  .productDescription{
    font-size: 16px;
    margin: 0px !important;
    color: #4b8dcf;
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

  .quantityContainer{
    text-align: center;
  }

  .removeAll{
    color: #1976d2;
    font-size: 14px;
    padding: 1px 5px 3px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s;
    font-weight: bold;
    
    &:hover{
      color: white;
      background-color: #1976d2;
    }
  }

  .quantityActionButtonsContainer{
    display: flex;
  }

  .quantityNumber{
    padding: 0px 5px;
  }
`;

const GeneralActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 10px;
  
  button {
    margin: 0px 5px;
  }
`;

function MountYourSetup() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

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

  function saveSetup() {
    if (notExists(selectedProductsByType) || Object.keys(selectedProductsByType).length <= 0) return;

    const products = []
    Object.keys(selectedProductsByType).forEach(currentType => {
      const currentTypeSelectedProducts = selectedProductsByType[currentType];
      products.push(...currentTypeSelectedProducts);
    });
    const payload = { name: 'Teste', description: 'NOVO TESTEE', products };

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      enqueueSnackbar(`Setup ${response?.name} salvo com sucesso`, { variant: 'success' });
    }
    dispatch(insertSetup({ payload, callback }))
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

    const selectedProductIndex = listMapped[openedSectionType?.type].findIndex(currProduct => currProduct?.id === selectedProduct?.id);
    if (exists(selectedProductIndex) && selectedProductIndex >= 0) {
      const savedProduct = listMapped[openedSectionType?.type][selectedProductIndex];
      listMapped[openedSectionType?.type][selectedProductIndex] = { ...savedProduct, quantity: savedProduct?.quantity + 1 };
    }
    else listMapped[openedSectionType?.type].push({ ...selectedProduct, quantity: 1 });

    setSelectedProductsByType(listMapped);
  }

  function onRemoveProduct(selectedProduct) {
    const listMapped = JSON.parse(JSON.stringify(selectedProductsByType));

    if (notExists(listMapped[openedSectionType?.type]) || listMapped[openedSectionType?.type].length <= 0) return;

    const selectedProductIndex = listMapped[openedSectionType?.type].findIndex(currentProduct => currentProduct?.id === selectedProduct?.id);
    if (notExists(selectedProductIndex) || selectedProductIndex < 0) return;

    const savedProduct = listMapped[openedSectionType?.type][selectedProductIndex];
    if (savedProduct?.quantity > 1) listMapped[openedSectionType?.type][selectedProductIndex] = { ...savedProduct, quantity: savedProduct?.quantity - 1 };
    else listMapped[openedSectionType?.type].splice(selectedProductIndex, 1);

    setSelectedProductsByType(listMapped);
  }

  function onProductCompleteRemove(selectedProduct) {
    const listMapped = JSON.parse(JSON.stringify(selectedProductsByType));
    if (notExists(listMapped[openedSectionType?.type]) || listMapped[openedSectionType?.type].length <= 0) return;

    const selectedProductIndex = listMapped[openedSectionType?.type].findIndex(currentProduct => currentProduct?.id === selectedProduct?.id);
    if (notExists(selectedProductIndex) || selectedProductIndex < 0) return;

    listMapped[openedSectionType?.type].splice(selectedProductIndex, 1);
    setSelectedProductsByType(listMapped);
  }

  useEffect(() => {
    retrieveTypesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productSelectedQty = (renderedProduct) => {
    if (notExists(selectedProductsByType) || notExists(productsShortList) || notExists(openedSectionType)) return false;

    const productsList = selectedProductsByType[openedSectionType?.type];
    if (notExists(productsList) || productsList.length <= 0) return 0;

    const productQty = productsList.find(currentProduct => currentProduct?.id === renderedProduct?.id)?.quantity;
    return productQty ?? 0;
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
                <div className="quantityContainer">
                  <div className="quantityActionButtonsContainer">
                    <RemoveIcon className="actionIcon" onClick={() => onRemoveProduct(currentProduct)} />
                    <span className="quantityNumber">{productSelectedQty(currentProduct)}</span>
                    <AddIcon className="actionIcon" onClick={() => onAddProduct(currentProduct)} />
                  </div>
                  <span className="removeAll" onClick={() => onProductCompleteRemove(currentProduct)}>Remover</span>
                </div>
              </ProductOptionContainer>
            ))}
          </List>
        </div>
      </Box>
    )
  }

  const renderProductTypesSection = () => {
    if (notExists(typesShortList) || typesShortList.length <= 0) return;

    return typesShortList.map(currentType => {
      if (notExists(selectedProductsByType[currentType?.type]) || selectedProductsByType[currentType?.type].length <= 0) return (
        <ComputerPartContainer onClick={() => onOpenProductsOptions(currentType)}>
          <ComputerPartTitle>{currentType?.description}</ComputerPartTitle>
          <p className="productName">Selecionar</p>
          <ArrowRightIcon />
        </ComputerPartContainer>
      )

      return (
        <ComputerPartContainer onClick={() => onOpenProductsOptions(currentType)}>
          <ComputerPartTitle>{currentType?.description}</ComputerPartTitle>
          <ComputerPartItem>
            {selectedProductsByType[currentType?.type].map(currentProduct => (
              <SelectedProductItem>
                <span className="productQuantity">{currentProduct?.quantity}x</span>
                <div>
                  <p className="productName">{currentProduct?.name}</p>
                  <p className="productDescription">{currentProduct?.description}</p>
                </div>
              </SelectedProductItem>
            ))}
          </ComputerPartItem>
          <ArrowRightIcon />
        </ComputerPartContainer>
      )
    });
  }

  return (
    <div className="App" style={{ padding: '10px 30px' }}>
      <Backdrop sx={{ color: '#74baff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={typesShortListLoading || loadingProductsShortList}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {renderProductTypesSection()}
      {!typesShortListLoading &&
        <GeneralActionButtonsContainer>
          <Button variant="contained" startIcon={<AddSetupIcon />} onClick={saveSetup}>Salvar Setup</Button>
          <Button variant="contained" startIcon={<BarChartIcon />}>Ver Resumo</Button>
        </GeneralActionButtonsContainer>
      }
      <Drawer anchor="right" open={showDrawer} onClose={onCloseProductsOptions}>
        {renderProductsOptions()}
      </Drawer>
    </div>
  );
}

export default MountYourSetup;