import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import AdminPanel from "./AdminPanel";
import { useKeycloak } from "@react-keycloak/web";
import { useState, useRef } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
  });

function AddProductForm() {
  const { keycloak } = useKeycloak();
  const { dispatch } = useAppContext();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      price: 0,
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .matches(
          /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻéñ0-9 \-.()]{2,50}$/,
          "Nieprawidłowa nazwa produktu"
        )
        .required("Nazwa produktu jest wymagana"),
      type: Yup.string()
        .required("Typ produktu jest wymagany")
        .test(
          "valid-types",
          "Nieprawidłowe dane",
          (value) => {
            if (!value) return false;

            const types = value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            if (types.length === 0 || types.length > 5) return false;

            return types.every(
              (t) =>
                /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻéñ0-9 \-.()]{2,30}$/.test(t)
            );
          }
        )
        .test(
          "no-trailing-comma",
          "Nie może kończyć się przecinkiem",
          (value) => value && !value.trim().endsWith(",")
        ),
      price: Yup.number()
        .required("Cena produktu jest wymagana")
        .min(0, "Cena nie może być mniejsza niż 0")
        .max(1000, "Cena może wynosić maksymalnie 1000"),
      image: Yup.mixed()
        .required("Zdjęcie produktu jest wymagane")
        .test(
          "fileSelected",
          "Zdjęcie produktu jest wymagane",
          (value) => value instanceof File
        )
        .test(
          "fileSize",
          "Zdjęcie nie może być większe niż 2MB",
          (value) => !value || value.size <= 2 * 1024 * 1024
        )
        .test(
          "fileType",
          "Dozwolone formaty to JPG, JPEG, PNG, WEBP, GIF, BMP, SVG",
          (value) =>
            !value ||
            [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
              "image/gif",
              "image/bmp",
              "image/svg+xml",
            ].includes(value.type)
        )
    }),
    onSubmit: async (values) => {
      try {
        const base64Image = await toBase64(values.image);

        const types = values.type
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const finalType = types.length === 1 ? types[0] : types;

        const payload = {
          name: values.name.trim(),
          type: finalType,
          price: values.price.toString(),
          image: base64Image,
        };

        await axios.post(`${backendUrl}/products`, payload);

        const response = await axios.get(`${backendUrl}/products`);
        dispatch({ type: "SET_PRODUCTS", payload: response.data });
        alert("Dodano nowy produkt!");
        navigate("/adminpanel/main");
      } catch (error) {
        console.error("Błąd podczas edycji produktu:", error);
      }
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("image", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleReset = (e) => {
    formik.handleReset(e);
    formik.setFieldValue("image", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {keycloak.authenticated && <AdminPanel />}
      {keycloak.authenticated && keycloak.hasRealmRole("admin") ? (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-4">
          <h2 className="text-2xl font-semibold mb-4">Dodaj nowy produkt</h2>
          <form onSubmit={formik.handleSubmit} onReset={handleReset}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-600"
              >
                Nazwa:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="mt-1 p-2 border rounded-md w-full text-lg"
              />
              {formik.touched.name && formik.errors.name && (
                <span style={{ color: "red" }}>{formik.errors.name}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-lg font-medium text-gray-600"
              >
                Typ (może być kilka, wpisuj po przecinku):
              </label>
              <input
                type="text"
                id="type"
                name="type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                className="mt-1 p-2 border rounded-md w-full text-lg"
              />
              {formik.touched.type && formik.errors.type && (
                <span style={{ color: "red" }}>{formik.errors.type}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-lg font-medium text-gray-600"
              >
                Cena:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value.replace(",", "."));

                  if (!isNaN(value)) {
                    const formattedValue = value.toFixed(2);
                    formik.setFieldValue("price", formattedValue);
                  }

                  formik.handleBlur(e);
                }}
                value={formik.values.price}
                className="mt-1 p-2 border rounded-md w-full text-lg"
              />
              {formik.touched.price && formik.errors.price && (
                <span style={{ color: "red" }}>{formik.errors.price}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-lg font-medium text-gray-600 pb-1"
              >
                Zdjęcie:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="block w-full text-md"
              />
              {formik.touched.image && formik.errors.image && (
                <span style={{ color: "red" }}>{formik.errors.image}</span>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Podgląd"
                    className="max-w-full h-32 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      formik.setFieldValue("image", null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                      }
                    }}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Usuń zdjęcie
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
              >
                Dodaj produkt
              </button>
              <button
                type="reset"
                className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-2xl">
            Nie możesz jeszcze dodawać nowych produktów...
          </div>
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

export default AddProductForm;
