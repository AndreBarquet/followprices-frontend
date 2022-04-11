import React, { useEffect, useState } from "react";

// Redux
import { deleteProductById, fetchAllProducts, insertNewProduct, updateProductById } from "../model/productsStore";
import { useSelector, useDispatch } from 'react-redux';
import { exists, notExists, requiredFieldError, safeNull } from "../utils/utils";
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { DataGrid } from "@mui/x-data-grid";
import { Autocomplete, Button, CircularProgress, Pagination, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TableHeader } from "../utils/styles";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useSnackbar } from "notistack";
import { fetchTypesShort } from "../model/typesStore";

const DEFAULT_FORM_VALUES = { name: '', description: '', typeId: '' };

function Products() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { productsList, productsListLoading, totalPages, inserLoading, updateLoading, deleteLoading } = useSelector((state) => state.products);
  const { typeslist, typesShortList } = useSelector((state) => state.types);

  const [filters, setFilters] = useState({ name: null });
  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });
  const [formFields, setFormFields] = useState({});
  const [hasSendForm, setHasSendForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function retrieveProductsList() {
    const params = { ...pagination, ...ordenation, typeId: filters?.type?.id };
    dispatch(fetchAllProducts({ payload: params }))
  }

  function retrieveTypesShort() {
    dispatch(fetchTypesShort())
  }

  function deleteProduct(record) {
    if (notExists(record?.id)) return;
    dispatch(deleteProductById({ payload: record?.id }))
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
    setHasSendForm(false);
    setFormFields({ ...DEFAULT_FORM_VALUES });
    setShowForm(false);
  }

  function openInsertForm() {
    setShowForm(true);
    setIsUpdating(false);
  }

  function insertProduct() {
    setHasSendForm(true);

    const hasSendForm = requiredFieldError(formFields?.name) || requiredFieldError(formFields?.description || requiredFieldError(formFields?.typeId));
    if (hasSendForm) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      enqueueSnackbar('Novo produto inserido com sucesso', { variant: 'success' });
    }

    dispatch(insertNewProduct({ payload: formFields, callback }));
  }

  function updateProduct() {
    setHasSendForm(true);
    const hasSomeError = requiredFieldError(formFields?.name) || requiredFieldError(formFields?.description) || requiredFieldError(formFields?.typeId);

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

    dispatch(updateProductById({ payload: formFields, callback }));
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
    const body = {
      id: record?.id,
      name: record?.name,
      description: record?.description,
      typeId: record?.typeId
    };

    setFormFields(body);
    setShowForm(true);
    // ou assim setFormFields({...record}) !!! Porem assim, os campos que vem do back tem que estar exatamente iguais aos do form que vc usa no input
    setIsUpdating(true);
  }

  useEffect(() => {
    retrieveProductsList();
  }, [ordenation, pagination, filters?.type]);

  useEffect(() => {
    retrieveTypesShort();
  }, []);

  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ? <DeleteIcon onClick={() => deleteProduct(row)} className="tableActionIcon" /> : <CircularProgress size={30} />}
      {<EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" />}
    </div>
  )

  const renderNewProductForm = () => {
    return (
      <div className="container">
        <TextField
          style={{ marginRight: 15 }}
          error={requiredFieldError(formFields?.name) && hasSendForm}
          value={formFields?.name}
          onChange={e => setFormFields({ ...formFields, name: e?.target?.value })}
          label="Nome do produto"
        ></TextField>
        <TextField
          style={{ marginRight: 15 }}
          error={requiredFieldError(formFields?.description) && hasSendForm}
          value={formFields?.description}
          onChange={e => setFormFields({ ...formFields, description: e?.target?.value })}
          label="Descrição do produto"
        ></TextField>
        <TextField
          error={requiredFieldError(formFields?.typeId) && hasSendForm}
          value={formFields?.typeId}
          onChange={e => setFormFields({ ...formFields, typeId: e?.target?.value })}
          label="Tipo do produto"
        ></TextField>
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <Button variant="outlined" onClick={onFormCancel} style={{ marginRight: 15 }} startIcon={<CloseIcon />}>Cancelar</Button>
          <LoadingButton variant="contained" onClick={isUpdating ? updateProduct : insertProduct} style={{ marginRight: 15 }} startIcon={<SaveIcon />}>{isUpdating ? 'Atualizar' : 'Inserir'}</LoadingButton>
        </div>
      </div>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Produto', flex: 1, valueGetter: ({ row }) => safeNull(row?.name), sortable: true },
    { field: 'description', headerName: 'Descrição', flex: 1 },
    { field: 'typeId', headerName: 'Tipo do produto', valueGetter: ({ row }) => safeNull(row?.type?.description), flex: 1 },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  return (
    <div className="App">
      <div className="container">
        {showForm && renderNewProductForm()}
        <TableHeader>
          <Autocomplete
            disablePortal
            options={typesShortList ?? []}
            // colocar na propriedade o campo da lsita de objetos que vai conter o texto a ser mostrado na lista
            getOptionLabel={(option) => option.description}
            sx={{ width: 300 }}
            value={filters?.type}
            onChange={(_, value) => setFilters({ ...filters, type: value })}
            renderInput={(params) => <TextField {...params} label="Tipo de produto" variant="standard" />}
          />
          <span>Lista de produtos</span>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openInsertForm}>
            Novo produto
          </Button>
        </TableHeader>
        <DataGrid
          autoHeight
          rows={productsList ?? []}
          columns={columns ?? []}
          checkboxSelection
          hideFooterPagination
          hideFooter
          onSortModelChange={onOrdenationChange}
          rowHeight={45}
          loading={productsListLoading}
        />
        <div className="paginationAlign">
          <Pagination count={totalPages} size="small" onChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

export default Products;