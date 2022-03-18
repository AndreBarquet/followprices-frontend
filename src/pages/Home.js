import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/products";

function Home() {
  const [productsList, setProductsList] = useState([]);
  useEffect(() => {
    // const listOfProducts = getAllProducts();
    // debugger
    // setProductsList(listOfProducts?.products?.data);
  }, []);

  return (
    <div className="App">
      {productsList.map(currentProduct => currentProduct.name)}
    </div>
  );
}

export default Home;