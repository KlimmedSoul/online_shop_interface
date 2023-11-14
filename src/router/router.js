import Admin from "../pages/AdminPage/AdminPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import Seller from "../pages/SellerPage/SellerPage";
import Buyer from "../pages/BuyerPage/BuyerPage";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage"
export const AllRoutes = [
    {path: "*", component: RegistrationPage},
    {path: "/login", component: LoginPage},
    {path: "/admin", component: Admin},
    {path: "/seller", component: Seller},
    {path: "/buyer", component: Buyer}
];