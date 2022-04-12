import { Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

import PropTypes from 'prop-types';

const Table = props => {
  const {
    dataSource, columns, onOrdenationChange, onPageChange, loading, totalPages,
    checkboxSelection = false,
  } = props;

  return (
    <div>
      <DataGrid
        autoHeight
        rows={dataSource ?? []}
        columns={columns ?? []}
        headerHeight={45}
        checkboxSelection={checkboxSelection}
        hideFooterPagination
        hideFooter
        sortingMode="server"
        onSortModelChange={onOrdenationChange}
        rowHeight={45}
        loading={loading}
      />
      <div className="paginationAlign">
        <Pagination count={totalPages} size="small" onChange={onPageChange} />
      </div>
    </div>
  );
}

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  /**
   * @description table loading
   * @default false
   */
  loading: PropTypes.bool,
  totalPages: PropTypes.number,
  onOrdenationChange: PropTypes.func,
  onPageChange: PropTypes.func,
  /**
   * @description Show checkbox selecion column
   * @default true  
   */
  checkboxSelection: PropTypes.bool,
};

export default Table;
