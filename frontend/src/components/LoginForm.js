import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router";

function LoginForm() {
  const { state, dispatch } = useAppContext();
  const { isAdmin } = state;
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      const timeout = setTimeout(() => {
        navigate("/adminpanel/edit");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isAdmin, navigate]);

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string().required("Pole jest wymagane"),
      password: Yup.string().required("Pole jest wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/login",
          values
        );
        if (response.data.success && response.data.isAdmin) {
          dispatch({ type: "LOGIN" });
          setLoginError("");
          alert("Zalogowano jako administrator!");
        } else {
          dispatch({ type: "LOGOUT" });
          setLoginError("Nieprawidłowy login lub hasło. Spróbuj ponownie.");
        }
      } catch (error) {
        console.error("Nie udało się zalogować", error);
        dispatch({ type: "LOGOUT" });
        setLoginError(
          "Wystąpił błąd podczas logowania. Spróbuj ponownie później."
        );
      }
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
      {loginError && <div style={{ color: "red" }}>{loginError}</div>}
    </form>
  );
}

export default LoginForm;
