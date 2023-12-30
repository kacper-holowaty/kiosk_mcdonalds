import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginForm() {
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string().required("Pole jest wymagane"),
      password: Yup.string().required("Pole jest wymagane"),
    }),
    onSubmit: (values) => {
      // Tutaj można umieścić logikę obsługi zalogowania
      console.log("Zalogowano pomyślnie!", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="login">Login:</label>
        <input
          type="text"
          id="login"
          name="login"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.login}
        />
        {formik.touched.login && formik.errors.login && (
          <span style={{ color: "red" }}>{formik.errors.login}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <span style={{ color: "red" }}>{formik.errors.password}</span>
        )}
      </div>
      <div>
        <button type="submit">Zaloguj się</button>
      </div>
    </form>
  );
}

export default LoginForm;
