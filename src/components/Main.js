import React from "react";
import "./Main.css";
import Product from "./Product";
import { useStateValue } from "../StateProvider";

function Main() {
  const [{ products, category }] = useStateValue();
  return (
    <div className="main">
      <div className="products">
        {products?.map((product) =>
          category === "all" ? (
            <Product id={product.id} item={product.data()} />
          ) : category === product.data().category ? (
            <Product id={product.id} item={product.data()} />
          ) : null
        )}
      </div>
    </div>
  );
}
export default Main;
