import React, { useState, useEffect } from "react";

// Redux
import { fetchAllTypes, deleteTypeById } from "../model/typesStore";
import { useSelector, useDispatch } from 'react-redux';

// Components
import { DataGrid } from "@mui/x-data-grid";

// ENUMS
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION, TYPES_ENUM } from "../app/generalEnums";
import { notExists } from "../utils/utils";
import { Pagination } from "@mui/material";

function Types() {
  const dispatch = useDispatch();
  const { typesList, typesListLoading, totalPages } = useSelector((state) => state.types);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });

  function retrieveTypesList() {
    const params = { ...pagination, ...ordenation };
    dispatch(fetchAllTypes(params))
  }

  function deleteType(record) {
    if (notExists(record?.id)) return;
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
    <div style={{ cursor: 'pointer' }} onClick={() => deleteType(row)}>Excluir</div>
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
        onSortModelChange={onOrdenationChange}
        rowHeight={45}
        loading={typesListLoading}
      />
      <Pagination count={totalPages} size="small" onChange={onPageChange} />
    </div>
  );
}

export default Types;