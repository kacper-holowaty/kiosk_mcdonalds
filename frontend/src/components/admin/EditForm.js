import { useFormik } from "formik";
import * as Yup from "yup";

function EditForm({ editedProduct, stopEditting, updateProduct }) {
  const formik = useFormik({
    initialValues: {
      name: editedProduct ? editedProduct.name : "",
      type: editedProduct ? editedProduct.type : "",
      price: editedProduct ? editedProduct.price : 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nazwa produktu jest wymagana"),
      type: Yup.string().required("Typ produktu jest wymagany"),
      price: Yup.number()
        .required("Cena produktu jest wymagana")
        .min(0.01, "Cena musi być większa niż 0"),
    }),
    onSubmit: async (values) => {
      updateProduct(editedProduct, values);
    },
  });
  return (
    <div>
      <h2>Edytuj produkt</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Nazwa produktu:</label>
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
          <label htmlFor="type">Typ produktu:</label>
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
          <label htmlFor="price">Cena produktu:</label>
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
          <button type="submit">Zapisz zmiany</button>
          <button type="button" onClick={stopEditting}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
