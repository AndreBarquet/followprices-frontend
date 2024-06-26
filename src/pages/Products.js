import React, { useEffect, useMemo, useState } from "react";

// Redux
import { deleteProductById, fetchAllProducts, insertNewProduct, updateProductById } from "../model/productsStore";
import { fetchTypesShort } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';
import { insertNewPrice } from "../model/pricesStore";

// Components
import { Autocomplete, Button, CircularProgress, MenuItem, TextField, Grid, Tooltip, Collapse } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

// Utils
import { exists, formatDateToRequest, notExists, requiredFieldError, safeNull } from "../utils/utils";
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { useSnackbar } from "notistack";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DolarIcon from '@mui/icons-material/AttachMoney';

// Styles
import { FiltersTitle, FormBtnContainer, FormTitle, TableHeader } from "../utils/styles";
import Table from "../Components/Table/Table";

const DEFAULT_PRODUCT_VALUES = { name: '', description: '', typeId: '' };
const DEFAULT_PRICE_VALUES = { date: new Date(), inCashValue: '', inTermValue: '', productId: '', store: '' };

function Products() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { productsList, productsListLoading, totalPages, insertLoading, updateLoading, deleteLoading } = useSelector((state) => state.products);
  const { typesShortList } = useSelector((state) => state.types);
  const { insertPriceLoading } = useSelector((state) => state.prices);

  const [filters, setFilters] = useState({ typeId: '' });
  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });
  const [productFormFields, setProductFormFields] = useState({ ...DEFAULT_PRODUCT_VALUES });
  const [hasSendProductForm, setHasSendProductForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const [hasSendPriceForm, setHasSendPriceForm] = useState(false)
  const [priceFormFields, setPriceFormFields] = useState({ ...DEFAULT_PRICE_VALUES });
  const [showAddPriceForm, setShowAddPriceForm] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function retrieveProductsList() {
    const params = { ...pagination, ...ordenation, typeId: filters?.type?.id };
    dispatch(fetchAllProducts({ payload: params }))
  }

  function retrieveTypesShort() {
    dispatch(fetchTypesShort())
  }

  function onOrdenationChange(value) {
    if (notExists(value)) return;

    const orderObj = value.length > 0 ? value[0] : { ...DEFAULT_ORDENATION };
    setOrdenation({ field: orderObj?.field, order: orderObj?.sort });
  }

  function onPageChange(_, pageNumber) {
    setPagination({ ...pagination, page: pageNumber });
  }

  function onFormCancel() {
    setIsUpdating(false);
    setHasSendProductForm(false);
    setProductFormFields({ ...DEFAULT_PRODUCT_VALUES });
    setShowProductForm(false);
  }

  function onPriceFormCancel() {
    setShowAddPriceForm(false);
    setHasSendPriceForm(false);
    setPriceFormFields({ ...DEFAULT_PRICE_VALUES });
  }

  function onAddPriceOpen(record) {
    setPriceFormFields({ ...priceFormFields, productId: record?.id });
    setShowAddPriceForm(true);
  }

  function openInsertForm() {
    setShowProductForm(true);
    setIsUpdating(false);
  }

  function insertProduct() {
    setHasSendProductForm(true);

    const hasSendProductForm = requiredFieldError(productFormFields?.name) || requiredFieldError(productFormFields?.description) || requiredFieldError(productFormFields?.typeId);
    if (hasSendProductForm) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveProductsList();
      enqueueSnackbar('Novo produto inserido com sucesso', { variant: 'success' });
    }

    dispatch(insertNewProduct({ payload: productFormFields, callback }));
  }

  function updateProduct() {
    setHasSendProductForm(true);
    const hasSomeError = requiredFieldError(productFormFields?.name) || requiredFieldError(productFormFields?.description) || requiredFieldError(productFormFields?.typeId);

    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }
      onFormCancel();
      retrieveProductsList();
      enqueueSnackbar('Produto atualizado com sucesso', { variant: 'success' });
    };

    dispatch(updateProductById({ payload: productFormFields, callback }));
  }

  function deleteProduct(record) {
    if (notExists(record?.id)) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }
      retrieveProductsList();
      enqueueSnackbar('Produto excluido com sucesso', { variant: 'success' });
    }

    dispatch(deleteProductById({ payload: record?.id, callback }))
  }

  function mapRowDataToForm(record) {
    const bodyMapped = { id: record?.id, name: record?.name, description: record?.description, typeId: record?.typeId };
    setProductFormFields(bodyMapped);
    setShowProductForm(true);
    setIsUpdating(true);
  }

  function insertPrice() {
    setHasSendPriceForm(true);
    const payload = { ...priceFormFields, date: formatDateToRequest(priceFormFields?.date) };
    const hasSomeError = (
      requiredFieldError(priceFormFields?.date) || requiredFieldError(priceFormFields?.store) ||
      requiredFieldError(priceFormFields?.inCashValue) || requiredFieldError(priceFormFields?.inTermValue)
    );

    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onPriceFormCancel();
      enqueueSnackbar('Preço adicionado com sucesso', { variant: 'success' });
    }
    dispatch(insertNewPrice({ payload, callback }))
  }

  useEffect(() => {
    retrieveProductsList();
  }, [ordenation, pagination, filters?.type]);

  useEffect(() => {
    retrieveTypesShort();
  }, []);

  const renderNewProductForm = () => {
    return (
      <Grid item xs={12} md={6} lg={5} xl={3}>
        <div className="container" style={{ textAlign: "center" }}>
          <FormTitle>{isUpdating ? 'Editar Produto' : 'Novo Produto'}</FormTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(productFormFields?.name) && hasSendProductForm}
                value={productFormFields?.name}
                onChange={e => setProductFormFields({ ...productFormFields, name: e?.target?.value })}
                label="Nome do produto"
                variant="standard"
                fullWidth
                helperText={requiredFieldError(productFormFields?.name) && hasSendProductForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(productFormFields?.description) && hasSendProductForm}
                value={productFormFields?.description}
                onChange={e => setProductFormFields({ ...productFormFields, description: e?.target?.value })}
                label="Descrição do produto"
                variant="standard"
                fullWidth
                helperText={requiredFieldError(productFormFields?.description) && hasSendProductForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(productFormFields?.typeId) && hasSendProductForm}
                variant="standard"
                value={productFormFields?.typeId}
                style={{ textAlign: 'left' }}
                fullWidth
                select
                onChange={(event) => setProductFormFields({ ...productFormFields, typeId: event?.target?.value })}
                label="Tipo de produto"
                helperText={requiredFieldError(productFormFields?.typeId) && hasSendProductForm ? "Campo obrigatório" : ""}
              >
                {exists(typesShortList) && typesShortList.length > 0 && typesShortList.map(currentType => (
                  <MenuItem value={currentType?.id}>{currentType?.description}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <FormBtnContainer>
            <Button variant="outlined" onClick={onFormCancel} startIcon={<CloseIcon />}>
              Cancelar
            </Button>
            <LoadingButton variant="contained" onClick={isUpdating ? updateProduct : insertProduct} startIcon={<SaveIcon />} loading={isUpdating ? updateLoading : insertLoading}>
              {isUpdating ? 'Atualizar' : 'Inserir'}
            </LoadingButton>
          </FormBtnContainer>
        </div>
      </Grid>
    )
  }

  const renderAddPriceForm = () => {
    return (
      <Grid item xs={12} md={6} lg={5} xl={3}>
        <div className="container">
          <FormTitle>Adicionar Preço</FormTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DatePicker
                label="Data"
                value={priceFormFields?.date}
                onChange={value => setPriceFormFields({ ...priceFormFields, date: value })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={requiredFieldError(priceFormFields?.date, 'date') && hasSendPriceForm}
                    variant="standard"
                    fullWidth
                    helperText={requiredFieldError(priceFormFields?.date) && hasSendPriceForm ? "Campo obrigatório" : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencyTextField
                error={requiredFieldError(priceFormFields?.inCashValue) && hasSendPriceForm}
                value={priceFormFields?.inCashValue}
                onChange={(_, value) => setPriceFormFields({ ...priceFormFields, inCashValue: value })}
                label="Valor à vista"
                variant="standard"
                fullWidth
                currencySymbol="R$"
                decimalCharacter=","
                digitGroupSeparator="."
                helperText={requiredFieldError(priceFormFields?.inCashValue) && hasSendPriceForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencyTextField
                error={requiredFieldError(priceFormFields?.inTermValue) && hasSendPriceForm}
                value={priceFormFields?.inTermValue}
                onChange={(_, value) => setPriceFormFields({ ...priceFormFields, inTermValue: value })}
                label="Valor à prazo"
                variant="standard"
                fullWidth
                currencySymbol="R$"
                decimalCharacter=","
                digitGroupSeparator="."
                helperText={requiredFieldError(priceFormFields?.inTermValue) && hasSendPriceForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(priceFormFields?.store) && hasSendPriceForm}
                value={priceFormFields?.store}
                onChange={e => setPriceFormFields({ ...priceFormFields, store: e?.target?.value })}
                label="Loja"
                variant="standard"
                fullWidth
                helperText={requiredFieldError(priceFormFields?.store) && hasSendPriceForm ? "Campo obrigatório" : ""}
              />
            </Grid>
          </Grid>
          <FormBtnContainer>
            <Button variant="outlined" onClick={onPriceFormCancel} startIcon={<CloseIcon />}>Cancelar</Button>
            <LoadingButton variant="contained" onClick={insertPrice} loading={insertPriceLoading} startIcon={<SaveIcon />}>Salvar</LoadingButton>
          </FormBtnContainer>
        </div>
      </Grid>
    );
  }

  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ?
        <Tooltip title="Excluir produto" placement="top">
          <DeleteIcon onClick={() => deleteProduct(row)} className="tableActionIcon" />
        </Tooltip>
        :
        <CircularProgress size={30} />
      }
      {<Tooltip title="Editar produto" placement="top"><EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" /></Tooltip>}
      {<Tooltip title="Adicionar preço" placement="top"><DolarIcon onClick={() => onAddPriceOpen(row)} className="tableActionIcon" /></Tooltip>}
    </div>
  );

  const columns = [
    { field: 'name', headerName: 'Produto', flex: 1, valueGetter: ({ row }) => safeNull(row?.name), sortable: true },
    { field: 'description', headerName: 'Descrição', flex: 3 },
    { field: 'typeId', headerName: 'Tipo do produto', valueGetter: ({ row }) => safeNull(row?.type?.description), flex: 1 },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  const productsTable = useMemo(() => (
    <Table
      dataSource={productsList}
      columns={columns}
      loading={productsListLoading}
      onOrdenationChange={onOrdenationChange}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  ), [productsList, productsListLoading]);

  const renderProductsTable = (
    <div className="container">
      <TableHeader>
        <span>Lista de produtos</span>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openInsertForm} disabled={isUpdating}>
          Novo produto
        </Button>
      </TableHeader>
      {productsTable}
    </div>
  );

  const renderTableFilters = (
    <div className="container">
      <FiltersTitle>Filtros</FiltersTitle>
      <Autocomplete
        disablePortal
        options={typesShortList ?? []}
        getOptionLabel={(option) => option.description}
        noOptionsText="Não há dados"
        sx={{ width: 300 }}
        value={filters?.type}
        onChange={(_, value) => setFilters({ ...filters, type: value })}
        renderInput={(params) => <TextField {...params} label="Tipo de produto" size="small" />}
      />
    </div>
  )

  return (
    <div className="App">
      {renderTableFilters}
      <Collapse in={showProductForm || showAddPriceForm} timeout={500}>
        <Grid container spacing={2} className="alignContentCenter">
          {showProductForm && renderNewProductForm()}
          {showAddPriceForm && renderAddPriceForm()}
        </Grid>
      </Collapse>
      {renderProductsTable}
    </div>
  );
}

export default Products;