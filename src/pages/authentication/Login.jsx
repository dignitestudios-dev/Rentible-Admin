import React, { useEffect, useState } from "react";
import { OrangeLogo } from "../../assets/export";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValues } from "../../data/authentication";
import { signInSchema } from "../../schema/signInSchema";
import axios from "../../axios";
import {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "../../components/global/Toaster.jsx";
import Cookies from "js-cookie";
import { FiLoader } from "react-icons/fi";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: loginValues,
      validationSchema: signInSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);

          const verifiedLoginData = {
            email: values?.email,
            password: values?.password,
            role: "admin",
          };
          const response = await axios.post("/auth/signIn", verifiedLoginData);
          if (response.status === 200) {
            const admin = response?.data?.data?.admin;
            Cookies.set("store", JSON.stringify(admin));
            Cookies.set("token", response?.data?.data?.token, { expires: 15 });
            const userCredential = await signInWithEmailAndPassword(
              auth,
              values?.email,
              values?.password
            );

            Cookies.set("user", JSON.stringify(userCredential), {
              expires: 15,
            });
            setLoading(false);
            navigate("/dashboard");
          }
        } catch (err) {
          console.log("🚀 ~ createAccount ~ err:", err);
          ErrorToast(err?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      },
    });

  // } else {
  //   navigate("/select-package");
  //   SuccessToast("Please purchase a plan to continue.");
  // }
  // } else {
  // sessionStorage.setItem("email", formData?.email);
  // let obj = { email: formData?.email };

  // const response = await axios.post("/auth/otp/resend/email", obj);
  // if (response.status === 200) {
  // SuccessToast("Please verify your email to continue.");
  // navigate("/onboard-verify-otp");
  // }
  // }
  // navigate("/dashboard");
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    } else {
      return;
    }
  }, []);
  return (
    <div className="w-full h-auto flex flex-col items-center p-6 justify-center md:w-[499px] md:h-[548px]  rounded-[19px] bg-white">
      <img src={OrangeLogo} alt="orange_logo" className="w-[148.4px]" />
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-[48px]">Welcome Back</h2>
        <p className="text-[18px] font-normal text-center leading-[27px] text-[#3C3C43D9]">
          Please enter your details to continue
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="w-full md:w-[393px] mt-5 flex flex-col justify-start items-start gap-4"
      >
        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <input
            type="text"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full h-[49px] border-[0.8px] bg-[#F8F8F899] outline-none  rounded-[8px] placeholder:text-[#959393] text-[#262626] px-3 text-[16px] font-normal leading-[20.4px] ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
            placeholder="Email Address"
          />
          {errors.email && touched.email ? (
            <p className="text-red-700 text-sm font-medium">{errors.email}</p>
          ) : null}
        </div>

        <div className="w-full h-auto flex flex-col justify-start items-start gap-1">
          <div
            className={`h-[49px] flex justify-start bg-[#F8F8F899] items-start w-full relative border-[0.8px]  border-[#D9D9D9] rounded-[8px] ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
          >
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-[90%] h-full  bg-transparent rounded-l-[8px] placeholder:text-[#959393] outline-none text-[#262626] px-3 text-[16px] font-normal leading-[20.4px]"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="w-[10%] h-full rounded-r-[8px] bg-transparent text-md text-[#959393] flex items-center justify-center"
            >
              {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {errors.password && touched.password ? (
            <p className="text-red-700 text-sm font-medium">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="w-full -mt-1  flex items-center justify-end">
          <Link
            to={"/forgot-password"}
            className="text-black hover:no-underline hover:text-black text-[16px] font-normal leading-[20.4px]"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center text-md font-medium"
        >
          <span>Log In</span>
          {loading && <FiLoader className="animate-spin text-lg " />}
        </button>
      </form>
    </div>
  );
};

export default Login;
