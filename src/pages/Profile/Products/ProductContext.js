import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { GetProducts } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import { getCurrentUser } from '../../../apicalls/users';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  //const { user } = useSelector((state) => state.users);

  const getdata = useCallback(async (value) => {
    try {
      dispatch(SetLoader(true));
      if(value === null){
        const response = await GetProducts(null);
        console.log("response", response);
        dispatch(SetLoader(false));
        if (response.success) {
          setProducts(response.data);
        } else {
          console.log("Failed to fetch products");
        }
      }else{
        const user = await getCurrentUser();
      const response = await GetProducts({
        seller: user.data._id,
      });
       console.log("response", response);
      console.log("user", user);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      } else {
        console.log("Failed to fetch products");
      }
      }
      
     
    } catch (error) {
      dispatch(SetLoader(false));
      console.error("Error fetching products:", error);
    }
  }, [dispatch]);

  return (
    <ProductContext.Provider value={{ products, setProducts, selectedProduct, setSelectedProduct, getdata }}>
      {children}
    </ProductContext.Provider>
  );
};