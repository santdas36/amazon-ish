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
            <Product id={product.id} item={product} />
          ) : category === product.category ? (
            <Product id={product.id} item={product} />
          ) : null
        )}
      </div>
    </div>
  );
}
export default Main;
