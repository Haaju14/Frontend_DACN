import React, { useState, useEffect } from "react";
import {
  wordRegExp,
  emailRegExp,
  numberRegExp,
  phoneRegExp,
  birthRegExp,
  isOver18,
} from "../../../util/utilMethod";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { ProfileProps, UserProfileProps } from "../../../Model/Model";
import "../../../css/UserProfilePage.css";
import { userApi } from "../../../service/user/userApi";
import useCustomFormik from "../../../hook/useCustomFormik";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  updateAvatar,
  updateName,
} from "../../../redux/reducers/avatarReducer";

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const { avatar, userName } = useSelector(
    (state: RootState) => state.avatarReducer
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const mutationUpdateUserInformation = useMutation({
    mutationFn: (data: { userData: object; id: string }) =>
      userApi.updateUserInformation(data.userData, data.id),
    onSuccess: () => {},
    onError: () => {},
  });

  const mutationUserAvatar = useMutation({
    mutationFn: userApi.postUserAvatar,
    onSuccess: (data) => {
      dispatch(updateAvatar(data.content.avatar));
      dispatch(showNotification("Upload success"));
    },
    onError: () => {
      dispatch(showNotification("Upload failed"));
    },
  });

  const validationSchema = Yup.object().shape({
    id: Yup.number().required("Please input id!"),
    name: Yup.string()
      .matches(wordRegExp, "Name should be the text")
      .required("Please input name!"),
    email: Yup.string()
      .matches(emailRegExp, "Email invalidate")
      .required("Please input email!"),
    phone: Yup.string()
      .matches(numberRegExp, "Phone can only be numbers")
      .matches(phoneRegExp, "Phone invalid")
      .required("Please input phone!"),
    birthday: Yup.string()
      .matches(birthRegExp, "Birth must be in the format YYYY-MM-DD")
      .required("Please input birthday!")
      .test("age", "You must be over 18 years old", (value) => isOver18(value)),
    gender: Yup.boolean().required("Please input gender!"),
    role: Yup.string().required("Please input role!"),
  });

  const formik = useCustomFormik<UserProfileProps>(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      gender: user.gender,
      role: user.role,
    },
    validationSchema,
    (values) => {
      mutationUpdateUserInformation.mutate({
        userData: values,
        id: user.id.toString(),
      });
      dispatch(updateName(values.name));

      setShowModal(false);
      dispatch(showNotification("Update success"));
    }
  );

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowCustom = () => setShowCustomModal(true);
  const handleCloseCustom = () => setShowCustomModal(false);

  useEffect(() => {
    if (showModal || showCustomModal) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
    }
  }, [showModal, showCustomModal]);

  const handleUpload = async () => {
    if (file) {
      try {
        mutationUserAvatar.mutate(file);

        setShowCustomModal(false);
      } catch (error) {}
    } else {
      dispatch(showNotification("No file selected"));
    }
  };

  return (
    <div>
      <div className="profile card p-3">
        <div className="profile-header d-flex align-items-center">
          <div>
            <div
              className="profile-picture bg-secondary rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "100px", height: "100px" }}
            >
              <img
                src={avatar}
                alt="Profile Picture"
                className="rounded-circle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span className="update-photo" onClick={handleShowCustom}>
              Update image
            </span>
          </div>
          <div className="profile-verification ml-auto d-flex flex-column align-items-start">
            <span className="badge badge-success mb-2">
              Identity verification
            </span>
            <span className="badge badge-primary">Email address</span>
          </div>
        </div>
        <div className="profile-info mt-3">
          <h2>Hello I am {userName}</h2>
          <p>Start participating in 2024</p>
          <button className="btn btn-outline-primary" onClick={handleShow}>
            Edit profile
          </button>
        </div>
      </div>

      {/* Custom Modal */}
      {showCustomModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <span className="close-button" onClick={handleCloseCustom}>
              &times;
            </span>
            <h2>Change avatar</h2>
            <input
              type="file"
              className="form-control mb-3"
              onChange={handleFileChange}
            />
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseCustom}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpload}>
                Upload Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Modal */}
      {showModal && (
        <>
          <div
            className="modal-backdrop"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            style={{ display: showModal ? "block" : "none" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleClose}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
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
                    <div className="form-group">
                      <label htmlFor="profileName">Name</label>
                      <input
                        type="text"
                        className="form-control rounded-input"
                        id="profileName"
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
                    <div className="form-group">
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
                    <div className="form-group">
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
                        <div className="text-danger">
                          {formik.errors.birthday}
                        </div>
                      ) : null}
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
                            onChange={() =>
                              formik.setFieldValue("gender", true)
                            }
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
                            onChange={() =>
                              formik.setFieldValue("gender", false)
                            }
                            className="form-check-input"
                          />

                          <label className="form-check-label">Female</label>
                        </div>
                        {formik.touched.gender && formik.errors.gender ? (
                          <div className="text-danger">
                            {formik.errors.gender}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
