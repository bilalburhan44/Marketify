import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/HomeUi";
import Register from "./pages/Register/RegisterUI";
import Login from "./pages/Login/LoginUi";
import ProtectedRoutes from "./component/ProtectedRoutes";
import Spinner from "./component/Spinner";
import { useSelector } from "react-redux";
import ErrorBoundary from "./component/ErrorBoundary";
import ProfileUi from "./pages/Profile/ProfileUi";
import ProductsPage from "./pages/Profile/Products/ProductsForm"; 
import { ProductProvider } from "./pages/Profile/Products/ProductContext";
import Admin from "./pages/Admin/Admin";
import ProductInfo from "./pages/ProdInfo/ProductInfo";
import Verification from "./pages/Register/Verification";
import { EmailProvider } from "./pages/Register/EmailContext";


const App = () => {
  const { loading } = useSelector((state) => state.loaders); // Update to access 'loaders' state
  return (
    <ProductProvider>
    <ErrorBoundary>
     <EmailProvider>
     <div>
     {loading && <Spinner />}
     <Router>
       <Routes>
         <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
         <Route path="/profile" element={<ProtectedRoutes><ProfileUi /></ProtectedRoutes>} />
         <Route path="/product/:id" element={<ProtectedRoutes><ProductInfo /></ProtectedRoutes>} />
         <Route path="/admin" element={<ProtectedRoutes><Admin /></ProtectedRoutes>} />
         <Route path="/login" element={<Login />} />
         <Route path="/verify" element={<Verification />} />
         <Route path="/register" element={<Register />} />
         <Route path="/products" element={<ProtectedRoutes><ProductsPage /></ProtectedRoutes>} /> {/* Add route for the ProductsUi component */}
       </Routes>
     </Router>
   </div>
   </EmailProvider>
    </ErrorBoundary>
    </ProductProvider>
  );
};

export default App;