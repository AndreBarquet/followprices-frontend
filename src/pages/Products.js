import React, { useEffect, useState } from "react";

// Redux
import { deleteProductById, fetchAllProducts } from "../model/productsStore";
import { useSelector, useDispatch } from 'react-redux';
import { notExists } from "../utils/utils";
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination } from "@mui/material";

function Products() {
  const dispatch = useDispatch();
  const { productsList, productsListLoading, totalPages } = useSelector((state) => state.products);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function retrieveProductsList() {
    const params = { ...pagination, ...ordenation };
    dispatch(fetchAllProducts(params))
  }

  function deleteProduct(record) {
    if (notExists(record?.id)) return;
    dispatch(deleteProductById(record?.id))
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
    retrieveProductsList();
  }, [ordenation, pagination,]);

  const renderActionButtons = ({ row }) => (
    <div style={{ cursor: 'pointer' }} onClick={() => deleteProduct(row)}>Excluir</div>
  )

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Produto' },
    { headerName: 'Ações', renderCell: renderActionButtons },
  ];

  return (
    <div className="App">
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
      <Pagination count={totalPages} size="small" onChange={onPageChange} />
    </div>
  );
}

export default Products;