import { useAppContext } from "../../context/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";

function AddProductForm() {
  const { state, dispatch } = useAppContext();
  const { isAdmin } = state;
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      price: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nazwa produktu jest wymagana"),
      type: Yup.string().required("Typ produktu jest wymagany"),
      price: Yup.number()
        .required("Cena produktu jest wymagana")
        .min(0.01, "Cena musi być większa niż 0"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:5000/products", values);

        const response = await axios.get("http://localhost:5000/products");
        dispatch({ type: "SET_PRODUCTS", payload: response.data });
        alert("Dodano nowy produkt!");
        navigate("/adminpanel/main");
      } catch (error) {
        console.error("Błąd podczas edycji produktu:", error);
      }
    },
  });
  return (
    <div>
      {isAdmin && <AdminPanel />}
      <h2>Dodaj nowy produkt:</h2>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div>
          <label htmlFor="name">Nazwa:</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <span style={{ color: "red" }}>{formik.errors.name}</span>
          )}
        </div>

        <div>
          <label htmlFor="type">Typ:</label>
          <input
            type="text"
            id="type"
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.type}
          />
          {formik.touched.type && formik.errors.type && (
            <span style={{ color: "red" }}>{formik.errors.type}</span>
          )}
        </div>

        <div>
          <label htmlFor="price">Cena:</label>
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
          />
          {formik.touched.price && formik.errors.price && (
            <span style={{ color: "red" }}>{formik.errors.price}</span>
          )}
        </div>

        <div>
          <button type="submit">Dodaj produkt</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;
