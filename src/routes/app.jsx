import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/app/Dashboard";
import Products from "../pages/app/Products";
import AddProduct from "../pages/app/AddProduct";
import ProductDetails from "../pages/app/ProductDetails";
import EditProduct from "../pages/app/EditProduct";
import RentalTracking from "../pages/app/RentalTracking";
import ProductIssues from "../pages/app/ProductIssues";
import Messages from "../pages/app/Messages";
import RentalDetails from "../pages/app/RentalDetails";
import Notifications from "../pages/app/Notifications";
import Users from "../pages/app/Users";
import UserDetails from "../pages/app/UserDetails";
import Stores from "../pages/app/Stores";
import StoreDetails from "../pages/app/StoreDetails";
import Reports from "../pages/app/Reports";

export const app = [
  {
    title: "Dashboard",
    url: "/dashboard",
    page: <AppLayout page={<Dashboard />} />,
  },
  {
    title: "Users",
    url: "/users",
    page: <AppLayout page={<Users />} />,
  },
  {
    title: "User Detail",
    url: "/users/:id",
    page: <AppLayout page={<UserDetails />} />,
  },
  {
    title: "Stores",
    url: "/stores",
    page: <AppLayout page={<Stores />} />,
  },
  {
    title: "Store Detail",
    url: "/stores/:id",
    page: <AppLayout page={<StoreDetails />} />,
  },
  {
    title: "Products",
    url: "/products",
    page: <AppLayout page={<Products />} />,
  },
  {
    title: "Add Product",
    url: "/products/add",
    page: <AppLayout page={<AddProduct />} />,
  },
  {
    title: "Edit Product",
    url: "/products/update/:id",
    page: <AppLayout page={<EditProduct />} />,
  },
  {
    title: "Product Detail",
    url: "/products/:id",
    page: <AppLayout page={<ProductDetails />} />,
  },
  // {
  //   title: "Orders",
  //   url: "/orders",
  //   page: <AppLayout page={<Orders />} />,
  // },
  {
    title: "Rental Tracking",
    url: "/rental-tracking",
    page: <AppLayout page={<RentalTracking />} />,
  },
  {
    title: "Rental Tracking",
    url: "/rental-tracking/:id",
    page: <AppLayout page={<RentalDetails />} />,
  },
  {
    title: "Product Issues",
    url: "/product-issues",
    page: <AppLayout page={<ProductIssues />} />,
  },
  {
    title: "Reports",
    url: "/reports",
    page: <AppLayout page={<Reports />} />,
  },

  {
    title: "Notifcations",
    url: "/notifications",
    page: <AppLayout page={<Notifications />} />,
  },

  {
    title: "Messages",
    url: "/messages",
    page: <AppLayout page={<Messages />} />,
  },
  {
    title: "Messages",
    url: "/messages/:chatId",
    page: <AppLayout page={<Messages />} />,
  },
];
