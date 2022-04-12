// Icons
import { Home, Dvr, AppSettingsAlt, BarChart, Computer } from '@mui/icons-material';

// Pages
import HomePage from '../pages/Home';
import ProductsPage from '../pages/Products';
import TypesPage from '../pages/Types';
import FollowPricesPage from '../pages/FollowPrices';
import MountYourPc from '../pages/MountYourPc';


const routesList = [
  { path: "/inicio", name: "Início", component: <HomePage />, icon: <Home /> },
  { path: "/acompanhar-precos", name: "Acompanhar Preços", component: <FollowPricesPage />, icon: <BarChart /> },
  { path: "/montar-pc", name: "Monte seu PC", component: <MountYourPc />, icon: <Computer /> },
  { path: "/produtos", name: "Produtos", component: <ProductsPage />, icon: <Dvr /> },
  { path: "/tipos", name: "Tipos de Produtos", component: <TypesPage />, icon: <AppSettingsAlt /> },
]

export default routesList;