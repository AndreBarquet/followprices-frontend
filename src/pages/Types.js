import React, { useState, useEffect, useMemo } from "react";

// Redux
import { fetchAllTypes, deleteTypeById, insertNewType, updateTypeById } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

import { useSnackbar } from "notistack";

// Components
import { Button, CircularProgress, TextField, Grid, Tooltip, Collapse } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { FormBtnContainer, FormTitle, TableHeader } from "../utils/styles";
import Table from "../Components/Table/Table";

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

  const { typesList, typesListLoading, totalPages, deleteLoading, insertLoading, updateLoading } = useSelector((state) => state.types);

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
    setIsUpdating(true);
  }

  useEffect(() => {
    retrieveTypesList();
  }, [ordenation, pagination]);


  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ? <Tooltip title="Excluir tipo" placement="top"><DeleteIcon onClick={() => deleteType(row)} className="tableActionIcon" /></Tooltip> : <CircularProgress size={30} />}
      {<Tooltip title="Editar tipo" placement="top"><EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" /></Tooltip>}
    </div>
  )

  const columns = [
    { field: 'description', headerName: 'Descrição', flex: 1 },
    { field: 'type', headerName: 'Tipo', sortable: true, flex: 1, valueGetter: ({ row }) => safeNull(row?.type) },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  const renderNewTypeForm = () => {
    return (
      <Grid item xs={12} md={6} lg={5} xl={3}>
        <div className="container" style={{ textAlign: "center" }}>
          <FormTitle>{isUpdating ? 'Editar Tipo' : 'Novo Tipo'}</FormTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(formFields?.type) && hasSendForm}
                value={formFields?.type}
                onChange={e => setFormFields({ ...formFields, type: e?.target?.value })}
                label="ENUM do tipo"
                fullWidth
                helperText={requiredFieldError(formFields?.type) && hasSendForm ? "Campo obrigatório" : ""}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(formFields?.description) && hasSendForm}
                value={formFields?.description}
                onChange={e => setFormFields({ ...formFields, description: e?.target?.value })}
                label="Tipo"
                fullWidth
                helperText={requiredFieldError(formFields?.description) && hasSendForm ? "Campo obrigatório" : ""}
                variant="standard"
              />
            </Grid>
          </Grid>
          <FormBtnContainer>
            <Button variant="outlined" onClick={onFormCancel} startIcon={<CloseIcon />}>Cancelar</Button>
            <LoadingButton variant="contained" onClick={isUpdating ? updateType : insertType} loading={updateLoading || insertLoading} startIcon={<SaveIcon />}>
              {isUpdating ? 'Atualizar' : 'Inserir'}
            </LoadingButton>
          </FormBtnContainer>
        </div>
      </Grid>
    )
  }

  const typesTable = useMemo(() => (
    <Table
      dataSource={typesList}
      columns={columns}
      loading={typesListLoading}
      onOrdenationChange={onOrdenationChange}
      totalPages={totalPages}
      onPageChange={onPageChange}
      sortingMode="server"
    />
  ), [typesList, typesListLoading]);

  const renderTypesTable = (
    <div className="container">
      <TableHeader>
        <span>Lista de tipos</span>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openInsertForm} disabled={isUpdating}>
          Novo tipo
        </Button>
      </TableHeader>
      {typesTable}
    </div>
  )

  return (
    <div className="App">
      <Collapse in={showForm} timeout={500}>
        <Grid container spacing={2} className="alignContentCenter">
          {showForm && renderNewTypeForm()}
        </Grid>
      </Collapse>
      {renderTypesTable}
    </div>
  );
}

export default Types;