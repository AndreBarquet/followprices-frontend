// Icons
import { Home, Dvr, AppSettingsAlt } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import Products from '../pages/Products';
import Types from '../pages/Types';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/produtos", name: "Produtos", component: <Products />, icon: <Dvr /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <Types />, icon: <AppSettingsAlt /> },
]

export default routesList;