import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";
import axios from "axios";
import EditForm from "./EditForm";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

function AdminMenu() {
  const { keycloak } = useKeycloak();
  const { state, dispatch } = useAppContext();
  const { products } = state;
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
    <div className="pb-4">
      {keycloak.authenticated && <AdminPanel />}
      {keycloak.authenticated && keycloak.hasRealmRole("admin") ? (
        <div>
          <div className="max-w-3xl mr-auto mt-4 ml-4 p-4 border rounded-lg shadow-lg bg-gray-300">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Wyszukaj produkt po nazwie"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="flex-grow px-2 py-1 border rounded-l-md"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 border rounded-r-md"
              >
                <option value="">Wybierz kategorię...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <ul className="space-y-4">
              {displayedProducts.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center border-b-2 pb-1"
                >
                  <span className="flex-grow">
                    {item.name} - {item.type} - {item.price} zł
                  </span>
                  <button
                    onClick={() => setProduct(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {product && (
            <EditForm
              editedProduct={product}
              stopEditting={onCancel}
              updateProduct={handleUpdateProduct}
            />
          )}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-2xl">Nie możesz jeszcze edytować danych...</div>
          <div className="text-2xl mb-4 mt-1">Musisz się zalogować!</div>
          <Link to="/">
            <button className="text-2xl bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none">
              Strona główna
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
