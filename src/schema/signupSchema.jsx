import * as Yup from "yup";

export const signUpSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 alphanumeric characters.")
    .required("Please enter your password")
    .trim("Password should not contain spaces at the start and end")
    .matches(
      /^\S.*\S$/,
      "Password should not contain spaces at the start and end"
    ),
  name: Yup.string()
    .min(4, "Name must contain atleast 4 characters.")
    .required("Please enter your store name."),
  phone: Yup.string()
    .matches(/^[2-9]\d{2}[2-9]\d{2}\d{4}$/, "Phone number must be valid.")
    .min(10, "Phone number must be 10 digits long")
    .required("Please enter your phone number"),
});
