// Icons
import { Home, CurrencyExchange, Dvr } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import Types from '../pages/Types';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <Types />, icon: <Dvr /> }
]

export default routesList;