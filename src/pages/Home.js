import React, { useEffect, useState } from "react";

// Redux
import { fetchAllSetups } from "../model/setupsStore";
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Grow, Box, Button, Pagination } from '@mui/material';

// General ENUMs
import { DEFAULT_PAGINATION } from "../app/generalEnums";

// Icons
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import styled from 'styled-components';
import { notExists } from "../utils/utils";

const Card = styled.div`
  cursor: pointer;
  background-color: white;
  min-height: 10rem;
  width: 15rem;
  position: relative;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  margin: 5px 10px;

  &:hover{
    transition: 0.2s !important;
    box-shadow: 0px 8px 8px -4px #787676;
    transform: translateY(-5px) !important;
  }
`;

const CardInfo = styled.div`
  padding: 5px 15px;
  
  .title{
    margin: 10px 0px 15px;
    border-bottom: 1px solid #98adc3;
    padding-bottom: 8px;
    font-weight: bold;
  }

  .description{
    color: #959595;
    margin-bottom: 34px;
  }
`;

const CardActionContainer = styled.div`
  width: 100%;
  position: absolute;
  background-color: #1976d2;
  height: 30px;
  bottom: 0;
  transition: 0.2s;
  color: white;
  overflow: hidden;
  text-align: center;

  &:hover{
    height: 90px;
  }

  .MuiSvgIcon-root{
    font-size: 30px;
  }
`;

const ActionButton = styled.div`
  color: white;
  padding: 8px;
`;

function Home() {
  const dispatch = useDispatch();
  const { loadingSetupsList, setupsList, totalPages } = useSelector((state) => state.setups);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION, size: 24 });

  function retrieveSetupsList() {
    dispatch(fetchAllSetups({ payload: { ...pagination } }));
  }

  function goToDetails() {
    alert("FOII");
  }

  function onPageChange(_, pageNumber) {
    setPagination({ ...pagination, page: pageNumber });
  }

  useEffect(() => {
    retrieveSetupsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);


  const renderSetupCard = (currentSetup) => {
    return (
      <Card>
        <CardInfo>
          <p className="title">{currentSetup?.name}</p>
          <p className="description">{currentSetup?.description}</p>
        </CardInfo>
        <CardActionContainer onClick={goToDetails}>
          <ArrowDropUpIcon />
          <ActionButton>Ver detalhes</ActionButton>
        </CardActionContainer>
      </Card>
    )
  }

  const renderSetupsCardsList = () => {
    if (notExists(setupsList) || setupsList.length <= 0) return <div style={{ color: 'grey' }}>Nao há dados</div>;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {setupsList.map(currentSetup => <Grow in timeout={800}>{renderSetupCard(currentSetup)}</Grow>)}
      </Box>
    )
  }

  return (
    <div className="App" style={{ padding: 10 }}>
      <h3>Meus Setups</h3>
      {renderSetupsCardsList()}
      {totalPages > 1 &&
        <div className="paginationAlign">
          <Pagination count={totalPages} size="small" onChange={onPageChange} />
        </div>
      }
    </div>
  );
}

export default Home;