import React, { useState } from "react";
import {
  wordRegExp,
  emailRegExp,
  numberRegExp,
  phoneRegExp,
  passRegExp,
  birthRegExp,
  isOver18,
} from "../../util/utilMethod";
import useCustomFormik from "../../hook/useCustomFormik";
import { userApi } from "../../service/user/userApi";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { RegisterFormValues } from "../../Model/Model";
import useRoute from "../../hook/useRoute";

const Register: React.FC = () => {
  const { navigate } = useRoute();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const mutation = useMutation({
    mutationFn: userApi.postRegisterUser,
    onSuccess: () => {
      navigate(0);
    },
    onError: () => {},
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(wordRegExp, "Name should be the text")
      .required("Please input name!"),
    email: Yup.string()
      .matches(emailRegExp, "Email invalidate")
      .required("Please input email!"),
    password: Yup.string()
      .matches(
        passRegExp,
        "Password must have 6-10 characters (contains at least 1 numeric character, 1 uppercase character, 1 special character)"
      )
      .required("Please input password!"),
    phone: Yup.string()
      .matches(numberRegExp, "Phone can only be numbers")
      .matches(phoneRegExp, "Phone invalid")
      .required("Please input phone!"),
    birthday: Yup.string()
      .matches(birthRegExp, "Birth must be in the format YYYY-MM-DD")
      .required("Please input birthday!")
      .test("age", "You must be over 18 years old", (value) => isOver18(value)),
    gender: Yup.boolean().required("Please input gender!"),
  });

  const formik = useCustomFormik<RegisterFormValues>(
    {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
    },
    validationSchema,
    (values) => {
      mutation.mutate(values);
    }
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <div>
          <label htmlFor="registerName">Name</label>
          <input
            type="text"
            className="form-control rounded-input"
            id="registerName"
            placeholder="Enter name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-danger">{formik.errors.name}</div>
          ) : null}
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="registerEmail">Email address</label>
          <input
            type="email"
            className="form-control rounded-input"
            id="registerEmail"
            placeholder="Enter email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="registerPassword">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control rounded-input"
              id="loginPassword"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
                style={{ marginTop: "0px" }}
              >
                <i
                  className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                ></i>
              </button>
            </div>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="registerPhone">Phone</label>
          <input
            type="number"
            className="form-control rounded-input"
            id="registerPhone"
            placeholder="Phone"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-danger">{formik.errors.phone}</div>
          ) : null}
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="registerBirthday">Birthday</label>
          <input
            type="date"
            className="form-control rounded-input"
            id="registerBirthday"
            placeholder="Enter date"
            name="birthday"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.birthday}
          />
          {formik.touched.birthday && formik.errors.birthday ? (
            <div className="text-danger">{formik.errors.birthday}</div>
          ) : null}
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="registerGender" className="mr-2">
            Gender
          </label>
          <div className="form-check form-check-inline ms-2">
            <input
              type="radio"
              id="male"
              name="registerGender"
              value="true"
              className="form-check-input"
              checked={formik.values.gender === true}
              onChange={() => formik.setFieldValue("gender", true)}
            />

            <label className="form-check-label">Male</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              id="female"
              name="registerGender"
              value="false"
              checked={formik.values.gender === false}
              onChange={() => formik.setFieldValue("gender", false)}
              className="form-check-input"
            />

            <label className="form-check-label">Female</label>
          </div>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="text-danger">{formik.errors.gender}</div>
          ) : null}
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

export default Register;
