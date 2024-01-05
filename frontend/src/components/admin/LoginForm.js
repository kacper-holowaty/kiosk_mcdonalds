import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

function LoginForm() {
  const { state, dispatch } = useAppContext();
  const { isAdmin } = state;
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      const timeout = setTimeout(() => {
        navigate("/adminpanel/main");
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
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/">
        <button className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white text-lg rounded-lg">
          Powrót
        </button>
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="login" className="mb-1 text-lg mr-6">
              Login:
            </label>
            <input
              type="text"
              id="login"
              name="login"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.login}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 text-lg"
            />
            {formik.touched.login && formik.errors.login && (
              <span style={{ color: "red" }} className="ml-1">
                {formik.errors.login}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="mb-1 text-lg mr-6">
              Hasło:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 text-lg"
            />
            {formik.touched.password && formik.errors.password && (
              <span style={{ color: "red" }} className="ml-1">
                {formik.errors.password}
              </span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue text-lg float-right"
            >
              Zaloguj się
            </button>
          </div>
          {loginError && <div style={{ color: "red" }}>{loginError}</div>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
