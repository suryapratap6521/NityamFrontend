import * as yup from "yup";

const ContactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  number: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .required("Number is required"),
  message: yup.string().required("Message is required"),
});

export default ContactSchema;
