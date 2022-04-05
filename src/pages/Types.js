import React, { useState, useEffect } from "react";

// Redux
import { fetchAllTypes, deleteTypeById } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

import { useSnackbar } from "notistack";

// Components
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Pagination } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

// ENUMS
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION, TYPES_ENUM } from "../app/generalEnums";
import { exists, notExists } from "../utils/utils";

function Types() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { typesList, typesListLoading, totalPages, deleteLoading } = useSelector((state) => state.types);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function retrieveTypesList() {
    const params = { ...pagination, ...ordenation };
    dispatch(fetchAllTypes(params))
  }

  function deleteType(record) {
    if (notExists(record?.id)) return;


    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar('This is a success message!', { variant: 'error' });
        return;
      }
    }
    dispatch(deleteTypeById(record?.id))
  }

  function onOrdenationChange(value) {
    if (notExists(value)) return;

    const orderObj = value.length > 0 ? value[0] : { ...DEFAULT_ORDENATION };
    setOrdenation({ field: orderObj?.field, order: orderObj?.sort });
  }

  function onPageChange(_, pageNumber) {
    setPagination({ ...pagination, page: pageNumber });
  }

  useEffect(() => {
    retrieveTypesList();
  }, [ordenation, pagination]);

  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      <DeleteIcon onClick={() => deleteType(row)} disabled />
      {deleteLoading && (
        <CircularProgress
          size={35}
          sx={{ color: 'red', position: 'absolute', top: -6, left: -6, zIndex: 1, }}
        />
      )}
    </div>
  )

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'type', headerName: 'Tipo', sortable: true, valueGetter: ({ row }) => TYPES_ENUM[row?.type] },
    { headerName: 'Ações', renderCell: renderActionButtons },
  ];

  return (
    <div className="App">
      <DataGrid
        autoHeight
        rows={typesList ?? []}
        columns={columns ?? []}
        checkboxSelection
        hideFooterPagination
        hideFooter
        sortingMode="server"
        onSortModelChange={onOrdenationChange}
        rowHeight={45}
        loading={typesListLoading}
      />
      <Pagination count={totalPages} size="small" onChange={onPageChange} />
    </div>
  );
}

export default Types;