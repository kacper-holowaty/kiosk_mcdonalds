import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";
import axios from "axios";
import EditForm from "./EditForm";
import { Link } from "react-router-dom";

function AdminMain() {
  const { state, dispatch } = useAppContext();
  const { isAdmin, products } = state;
  const [product, setProduct] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/products`,
          {
            params: { name: nameFilter, type: categoryFilter },
          }
        );
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, [nameFilter, categoryFilter]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
      }
    };

    fetchCategories();
  }, [categories]);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);

      const responseAllProducts = await axios.get(
        "http://localhost:5000/products"
      );
      dispatch({ type: "SET_PRODUCTS", payload: responseAllProducts.data });

      if (nameFilter || categoryFilter) {
        const response = await axios.get(
          "http://localhost:5000/admin/products",
          {
            params: {
              name: nameFilter,
              type: categoryFilter,
            },
          }
        );
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania produktu:", error);
    }
  };

  const handleUpdateProduct = async (updatedProduct, values) => {
    try {
      const productId = updatedProduct._id;
      await axios.put(`http://localhost:5000/products/${productId}`, values);

      const responseAllProducts = await axios.get(
        "http://localhost:5000/products"
      );
      dispatch({ type: "SET_PRODUCTS", payload: responseAllProducts.data });

      if (nameFilter || categoryFilter) {
        const response = await axios.get(
          "http://localhost:5000/admin/products",
          {
            params: {
              name: nameFilter,
              type: categoryFilter,
            },
          }
        );
        setFilteredProducts(response.data);
      }
      setProduct(null);
    } catch (error) {
      console.error("Błąd podczas aktualizacji produktu:", error);
    }
  };

  const onCancel = () => {
    setProduct(null);
  };

  const displayedProducts =
    nameFilter || categoryFilter ? filteredProducts : products;

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isAdmin ? (
        <div>
          <div>
            <input
              type="text"
              placeholder="Wyszukaj produkt po nazwie"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Wybierz kategorię...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <ul>
            {displayedProducts.map((product) => (
              <li key={product._id}>
                {product.name} - {product.type} - {product.price} zł
                <button onClick={() => setProduct(product)}>Edytuj</button>
                <button onClick={() => handleDeleteProduct(product._id)}>
                  Usuń
                </button>
              </li>
            ))}
          </ul>
          {product && (
            <EditForm
              editedProduct={product}
              stopEditting={onCancel}
              updateProduct={handleUpdateProduct}
            />
          )}
        </div>
      ) : (
        <div>
          <div>Nie możesz jeszcze edytować danych...</div>
          <div>Musisz się zalogować!</div>
          <Link to="/login">
            <button>Zaloguj się</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminMain;
