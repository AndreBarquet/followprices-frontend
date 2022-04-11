// Icons
import { Home, Dvr } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import Products from '../pages/Products';
import Types from '../pages/Types';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <Types />, icon: <Dvr /> },
  { path: "/produtos", name: "Produtos", component: <Products />, icon: <Dvr /> }
]

export default routesList;