import React, { useEffect, useState } from "react";

// Redux
import { fetchSetupDetails, fetchSetupDetailsEvolution } from "../model/setupsStore";
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Grow, Box, Button, Backdrop, CircularProgress, Fade, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FormattedNumber from '../Components/FormattedNumber/FormattedNumber';

// Helpers
import { exists, formatDate, isEmptyString, notExists } from "../utils/utils";
import { parse } from 'qs';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import styled from 'styled-components';

const ViewBtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const ViewButton = styled(Button)`
  background-color: white;

  .label{
    font-weight: bold;
    margin-right: 7px;
  }
`;

const AccordionTitle = styled(AccordionSummary)`
  min-height: 39px;

  .MuiAccordionSummary-content{
    margin: 7px 0 !important;
  }
`;

const ChartContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 15px 10px 10px 12px;
  margin-bottom: 10px;

  .name{
    font-weight: bold;
    margin: 0px 0px 0px 20px;
  }

  .description{
    margin: 0px 0px 20px 20px;
    font-size: 15px;
    color: #1976d2;
  }
`;

const SectionTitle = styled.h3`
  margin-left: 13px;
  margin-bottom: 15px;
`;

const SummaryPriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const SummaryPriceCard = styled.div`
  text-align: center;
  margin: 5px 20px;
  background-color: white;
  min-width: 24rem;
  min-height: 5rem;
  box-shadow: 0px 11px 6px -9px #c1c1c1;
  border: 1px solid #ebebeb;
  border-radius: 4px;

  .title{
    margin: 12px 0px 4px;
    font-size: 16px;
    color: grey;
  }

  .value{
    color: #1976d2;
    font-size: 20px;
    font-weight: bold;
  }
`;

const priceTypeLabel = { inCashValue: "Valor à vista", inTermValue: "Valor à prazo" };

function SetupDetails() {
  const dispatch = useDispatch();
  const { setupSummary, setupSummaryLoading, setupProductsEvolution, setupProductsEvolutionLoading } = useSelector((state) => state.setups);
  const generalLoading = setupSummaryLoading || setupProductsEvolutionLoading;

  const [setupId, setSetupId] = useState(null);
  const [showLatestPrices, setShowLatestPrices] = useState(true);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  function retrieveSetupSummary() {
    dispatch(fetchSetupDetails({ payload: { id: setupId } }));
  }

  function retrieveSetupProductsEvolution() {
    dispatch(fetchSetupDetailsEvolution({ payload: { id: setupId } }));
  }


  useEffect(() => {
    const urlFilters = parse(window.location.search.replace("?", ''));
    if (notExists(urlFilters?.id) || isEmptyString(urlFilters?.id)) return;
    setSetupId(urlFilters?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notExists(setupId)) return;
    retrieveSetupProductsEvolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupId]);

  useEffect(() => {
    if (notExists(setupId)) return;
    if (showLatestPrices) retrieveSetupSummary();

    if (!showLatestPrices && showDateSelector && exists(selectedDate)) {
      debugger
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupId, showLatestPrices, selectedDate]);


  const renderLineChart = (dataSource) => {
    if (notExists(dataSource) || dataSource.length <= 0) return;

    return (
      <ResponsiveContainer width='100%' height={300}>
        <LineChart width={1020} height={200} data={dataSource} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={value => formatDate(value) ?? '-'} />
          <YAxis tickFormatter={value => exists(value) ? value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 0} />
          <Tooltip formatter={(value, name) => [<FormattedNumber prefix="R$ " value={value} />, priceTypeLabel[name]]} labelFormatter={value => `Data: ${formatDate(value) ?? '-'}`} />
          <Legend formatter={value => priceTypeLabel[value]} />
          <Line type="monotone" dataKey="inCashValue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="inTermValue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    )
  };

  const renderBarChart = (dataSource) => {
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const date = payload[0].payload?.date;
        const firstLabel = priceTypeLabel[payload[0].name];
        const firstValue = payload[0].value;

        const secondLabel = priceTypeLabel[payload[1].name];
        const secondValue = payload[1].value;

        return (
          <div className="setupCustomTooltip">
            <p className="setupCustomTooltipLabel">{`${label}`}</p>
            <p className="setupCustomTooltipDate">{formatDate(date)}</p>
            <p className="setupCustomTooltipValue" style={{ color: payload[0].fill }}>{`${firstLabel}: ${firstValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`}</p>
            <p className="setupCustomTooltipValue" style={{ color: payload[1].fill }}>{`${secondLabel}: ${secondValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`}</p>
          </div>
        );
      }

      return null;
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart width={400} height={300} data={dataSource} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={value => exists(value) ? value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 0} />
          <Legend formatter={value => priceTypeLabel[value]} />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="inCashValue" fill="#82ca9d" barSize={28} />
          <Bar dataKey="inTermValue" fill="#8884d8" barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  const renderProductsEvolutionCharts = () => {
    if (notExists(setupProductsEvolution) || setupProductsEvolution.length <= 0) return;

    return Object.keys(setupProductsEvolution).map((currentType, typeIndex) => {
      const typeName = setupProductsEvolution[currentType][0]?.type;
      const productsList = setupProductsEvolution[currentType];
      const productsIdList = [...new Set(productsList.map(currentProduct => currentProduct?.productId))];
      const hasMoreThanOneProduct = productsIdList.length > 1;
      const lastProductDate = productsList[productsList.length - 1]?.date;

      const chartContent = (dataSource) => {
        if (notExists(dataSource) || dataSource.length <= 0) return;
        return (
          <ChartContainer>
            <p className="name">{dataSource[0]?.name}</p>
            <p className="description">{dataSource[0]?.description}</p>
            {renderLineChart(dataSource)}
          </ChartContainer>
        )
      };

      return (
        <Fade in timeout={500}>
          <Accordion defaultExpanded={false} key={typeIndex}>
            <AccordionTitle expandIcon={<KeyboardArrowDownIcon />}>
              <Typography style={{ fontWeight: 'bold' }}>
                {typeName}
                {!hasMoreThanOneProduct && <p style={{ margin: 0, fontSize: 14, color: '#9f9f9f', fontWeight: 'normal' }}>
                  {`Último preço adicionado: ${formatDate(lastProductDate)}`}
                </p>}
              </Typography>
            </AccordionTitle>
            <AccordionDetails>
              {!hasMoreThanOneProduct && chartContent(productsList)}
              {hasMoreThanOneProduct && productsIdList.map(currentProductId => chartContent(productsList.filter(currentProduct => currentProduct?.productId === currentProductId)))}
            </AccordionDetails>
          </Accordion>
        </Fade >
      )
    })
  }

  return (
    <div className="App" style={{ padding: 10 }}>
      <Backdrop sx={{ color: '#74baff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={generalLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ViewBtnContainer>
        <ViewButton variant="outlined" onClick={() => { setShowLatestPrices(!showLatestPrices); setShowDateSelector(showLatestPrices) }}>
          <span className="label">Últimos preços</span>
          <SwapHorizIcon />
        </ViewButton>
      </ViewBtnContainer>

      {exists(setupSummary) &&
        <SummaryPriceSection>
          <SummaryPriceCard>
            <p className="title">Valor a vista</p>
            <span className="value">{<FormattedNumber prefix="R$ " value={setupSummary.reduce((sum, currentItem) => (sum + currentItem.inCashValue), 0)} />}</span>
          </SummaryPriceCard>
          <SummaryPriceCard>
            <p className="title">Valor a prazo</p>
            <span className="value">{<FormattedNumber prefix="R$ " value={setupSummary.reduce((sum, currentItem) => (sum + currentItem.inTermValue), 0)} />}</span>
          </SummaryPriceCard>
        </SummaryPriceSection>
      }

      {exists(setupSummary) &&
        <div style={{ backgroundColor: 'white', padding: '2px 0px 10px 20px', margin: '28px 0px 45px' }}>
          <SectionTitle style={{ textAlign: 'center' }}>Preços por Produto</SectionTitle>
          {renderBarChart(setupSummary)}
        </div>
      }

      {exists(setupProductsEvolution) &&
        <section>
          <SectionTitle>Evolução de preços</SectionTitle>
          {renderProductsEvolutionCharts()}
        </section>
      }
    </div>
  );
}

export default SetupDetails;