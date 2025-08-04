import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";

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

function EditForm({ editedProduct, stopEditting, updateProduct }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editedProduct && editedProduct.image) {
      if (editedProduct.image.startsWith('data:image')) {
        setImagePreview(editedProduct.image);
      } else {
        setImagePreview(`data:image/jpeg;base64,${editedProduct.image}`);
      }
    }
  }, [editedProduct]);

  const formik = useFormik({
    initialValues: {
      name: editedProduct ? editedProduct.name : "",
      type: editedProduct ? (Array.isArray(editedProduct.type) ? editedProduct.type.join(", ") : editedProduct.type) : "",
      price: editedProduct ? editedProduct.price : 0,
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
          "Każdy typ musi mieć od 2 do 30 znaków, maksymalnie 5 typów",
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
        .nullable()
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
        const types = values.type
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const finalType = types.length === 1 ? types[0] : types;

        const updatedValues = {
          name: values.name.trim(),
          type: finalType,
          price: values.price.toString(),
        };

        if (values.image instanceof File) {
          updatedValues.image = await toBase64(values.image);
        }

        updateProduct(editedProduct, updatedValues);
      } catch (error) {
        console.error("Błąd podczas edycji produktu:", error);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    formik.setFieldValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto z-50">
      <h2 className="text-2xl font-bold mb-4">Edytuj produkt</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
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

        <div>
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

        <div>
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

        <div>
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
                className="max-w-full h-32 object-contain border rounded"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Usuń zdjęcie
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
          >
            Zapisz zmiany
          </button>
          <button
            type="button"
            onClick={stopEditting}
            className="bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-gray-600"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;