import React, { useState, useEffect } from "react";

// Redux
import { fetchAllTypes, deleteTypeById, insertNewType, updateTypeById, fetchTypesShort } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

import { useSnackbar } from "notistack";

// Components
import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress, Pagination, TextField, Autocomplete } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { TableHeader } from "../utils/styles";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// ENUMS
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { exists, notExists, requiredFieldError, safeNull } from "../utils/utils";


// Se nao definir os valores com array vazio, o campo de input buga, e nao limpa o que digitou se colocar undefined
const DEFAULT_FORM_VALUES = { type: '', description: '' };

function Types() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {
    typesList, typesListLoading, totalPages, deleteLoading, insertLoading, updateLoading, typesShortListLoading,
    typesShortList,
  } = useSelector((state) => state.types);

  const [filters, setFilters] = useState({ type: null });
  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });
  const [formFields, setFormFields] = useState({ ...DEFAULT_FORM_VALUES });
  const [hasSendForm, setHasSendForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showForm, setShowForm] = useState(false);

  function retrieveTypesList() {
    const params = { ...pagination, ...ordenation };
    dispatch(fetchAllTypes({ payload: params }))
  }

  function retrieveTypesShort() {
    dispatch(fetchTypesShort())
  }

  function retrieveFilters() {
    const params = { type: filters?.type?.type };
    dispatch(fetchTypesShort({ payload: params }))
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

  function insertType() {
    setHasSendForm(true);
    const hasSomeError = requiredFieldError(formFields?.type) || requiredFieldError(formFields?.description);
    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveTypesList();
      enqueueSnackbar('Novo tipo inserido com sucesso', { variant: 'success' });
    };

    dispatch(insertNewType({ payload: formFields, callback }));
  }

  function updateType() {
    setHasSendForm(true);
    const hasSomeError = requiredFieldError(formFields?.type) || requiredFieldError(formFields?.description);
    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveTypesList();
      enqueueSnackbar('Tipo atualizado com sucesso', { variant: 'success' });
    };

    dispatch(updateTypeById({ payload: formFields, callback }));
  }

  function deleteType(record) {
    if (notExists(record?.id)) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      retrieveTypesList();
      enqueueSnackbar('Tipo excluido com sucesso', { variant: 'success' });
    }

    dispatch(deleteTypeById({ payload: record?.id, callback }))
  }

  function mapRowDataToForm(record) {
    const body = {
      type: record?.type,
      description: record?.description,
      id: record?.id,
    };

    setFormFields(body);
    setShowForm(true);
    // ou assim setFormFields({...record}) !!! Porem assim, os campos que vem do back tem que estar exatamente iguais aos do form que vc usa no input
    setIsUpdating(true);
  }

  useEffect(() => {
    retrieveTypesList();
  }, [ordenation, pagination]);

  useEffect(() => {
    if (notExists(filters?.type)) return;
    retrieveFilters();
  }, [filters?.type]);

  useEffect(() => {
    retrieveTypesShort();
  }, []); // Quando esse array do useEffect esta vazio, ele chama logo quando entra na pagina


  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ? <DeleteIcon onClick={() => deleteType(row)} className="tableActionIcon" /> : <CircularProgress size={30} />}
      {<EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" />}
    </div>
  )

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'description', headerName: 'Descrição', flex: 1 },
    { field: 'type', headerName: 'Tipo', sortable: true, flex: 1, valueGetter: ({ row }) => safeNull(row?.type) },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  const renderNewTypeForm = () => {
    return (
      <div className="container">
        <TextField
          style={{ marginRight: 15 }}
          error={requiredFieldError(formFields?.type) && hasSendForm}
          value={formFields?.type}
          onChange={e => setFormFields({ ...formFields, type: e?.target?.value })}
          label="ENUM do tipo"
          helperText={requiredFieldError(formFields?.type) && hasSendForm ? "Campo obrigatório" : ""}
        />
        <TextField
          error={requiredFieldError(formFields?.description) && hasSendForm}
          value={formFields?.description}
          onChange={e => setFormFields({ ...formFields, description: e?.target?.value })}
          label="Tipo"
          helperText={requiredFieldError(formFields?.description) && hasSendForm ? "Campo obrigatório" : ""}
        />
        <div style={{ marginTop: 20, marginBottom: 10 }}>
          <Button variant="outlined" onClick={onFormCancel} style={{ marginRight: 15 }} startIcon={<CloseIcon />}>
            Cancelar
          </Button>
          <LoadingButton variant="contained" onClick={isUpdating ? updateType : insertType} loading={updateLoading || insertLoading} startIcon={<SaveIcon />}>
            {isUpdating ? 'Atualizar' : 'Inserir'}
          </LoadingButton>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {showForm && renderNewTypeForm()}
      <div className="container">
        <TableHeader>
          <Autocomplete
            disablePortal
            options={typesShortList}
            // colocar na propriedade o campo da lsita de objetos que vai conter o texto a ser mostrado na lista
            getOptionLabel={(option) => option.description}
            sx={{ width: 300 }}
            value={filters?.type}
            onChange={(_, value) => setFilters({ ...filters, type: value })}
            renderInput={(params) => <TextField {...params} label="Tipo de produto" variant="standard" />}
          />
          <span>Lista de tipos</span>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openInsertForm}>
            Novo tipo
          </Button>
        </TableHeader>
        <DataGrid
          className="table"
          autoHeight
          rows={typesList ?? []}
          columns={columns ?? []}
          // checkboxSelection
          headerHeight={45}
          hideFooterPagination
          hideFooter
          sortingMode="server"
          onSortModelChange={onOrdenationChange}
          rowHeight={45}
          loading={typesListLoading}
        />
        <div className="paginationAlign">
          <Pagination count={totalPages} size="small" onChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

export default Types;