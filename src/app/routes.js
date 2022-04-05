import HomePage from '../pages/Home';

import { Home, CurrencyExchange, Dvr } from '@mui/icons-material';
import ProductTypes from '../pages/ProductTypes';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <ProductTypes />, icon: <Dvr /> }
]

export default routesList;