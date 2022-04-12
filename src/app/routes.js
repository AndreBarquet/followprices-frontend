// Icons
import { Home, Dvr, AppSettingsAlt, BarChart } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import ProductsPage from '../pages/Products';
import TypesPage from '../pages/Types';
import FollowPricesPage from '../pages/FollowPrices';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/acompanhar-precos", name: "Acompanhar Preços", component: <FollowPricesPage />, icon: <BarChart /> },
  { path: "/produtos", name: "Produtos", component: <ProductsPage />, icon: <Dvr /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <TypesPage />, icon: <AppSettingsAlt /> },
]

export default routesList;