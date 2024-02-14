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
      name: Yup.string()
        .trim()
        .matches(
          /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ]{2,}$/,
          "Nieprawidłowa nazwa produktu"
        )
        .required("Nazwa produktu jest wymagana"),
      type: Yup.string()
        .trim()
        .matches(
          /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ]{2,}$/,
          "Nieprawidłowy typ produktu"
        )
        .required("Typ produktu jest wymagany"),
      price: Yup.number()
        .required("Cena produktu jest wymagana")
        .min(0.01, "Cena musi być większa niż 0")
        .max(1000.01, "Cena może wynosić maksymalnie 1000"),
    }),
    onSubmit: async (values) => {
      updateProduct(editedProduct, values);
    },
  });
  return (
    <div className="fixed top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edytuj produkt</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Nazwa produktu:</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
          />
          {formik.touched.price && formik.errors.price && (
            <span style={{ color: "red" }}>{formik.errors.price}</span>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Zapisz zmiany
          </button>
          <button
            type="button"
            onClick={stopEditting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
