import React, { useEffect } from "react";

// Redux
import { fetchAllProducts } from "../model/productsStore";
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const dispatch = useDispatch();
  const { productsList, productsListLoading } = useSelector((state) => state.products);

  function retrieveProductsList() {
    dispatch(fetchAllProducts())
  }

  useEffect(() => {
    retrieveProductsList();
  }, []);

  return (
    <div className="App">
      {productsListLoading && <p>loading...</p>}
      {productsList.map(currentProduct => currentProduct.name)}
    </div>
  );
}

export default Home;