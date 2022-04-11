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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      Tela de inicio
    </div>
  );
}

export default Home;