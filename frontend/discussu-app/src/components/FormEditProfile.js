import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useHomeStore } from "../store";

import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { ErrorCheck } from "./utils/utilFunctions";
import { useState, useEffect } from "react";

const FormEditProfile = () => {
  // const location = useLocation();
  // const user = location.state?.user;
  const updateUserData = useHomeStore((state) => state.updateUserData);
  const token = Cookies.get("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [currentProfilePic, setCurrentProfilePic] = useState(user?.profile_pic);



  useEffect(() => {
    setCurrentProfilePic(user?.profile_pic);
  }, [user]);

  const schema = yup.object().shape({
    username: yup
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9@/./+/-/_]+$/,
        "Username may only contain letters, numbers, and @/./+/-/_ characters"
      ),
    bio: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user.username,
      bio: user?.bio,
    },
  });

  const handleFileChange = (e) => {
    // Set the selected file in the form data
    const file = e.target.files;
    setValue("profile_image", file);

    if (file) {
      const tempUrl = URL.createObjectURL(file[0]);
      console.log(tempUrl);
      setCurrentProfilePic(tempUrl);
    }
  };

  const onSubmit = async (data) => {
    console.log("submit form...");
    // console.log('profile_image', data.profile_image[0]);

    let formData = new FormData();
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    if (data.profile_image) {
      formData.append("profile_pic", data.profile_image[0]);
      //   console.log("profile_image", "yes");
    }

    try {
      const updateResponse = await axios.put(
        `http://localhost:8000/api/users/${user.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // Add the token to the "Authorization" field
          },
          withCredentials: true,
        }
      );
      await updateUserData();
      navigate("/user/profile");
    } catch (error) {
      ErrorCheck(error);
    }
  };

  return (
    <div className="container">
      <form
        className="needs-validation"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        {/* 'id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course' */}
        <div className="mb-3">
          <label htmlFor="profile_image" className="form-label">
            Profile Image
          </label>
          {currentProfilePic && (
            <img
              src={currentProfilePic}
              alt="Current Profile Pic"
              style={{ marginBottom: "10px", maxWidth: "200px" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            id="profile_image"
            className={`form-control`}
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Username..."
            onChange={(e) => setValue("username", e.target.value)}
            {...register("username")}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Headline about You
          </label>
          <input
            type="text"
            id="bio"
            className={`form-control`}
            placeholder="Bio..."
            onChange={(e) => setValue("bio", e.target.value)}
            {...register("bio")}
          />
          {/* <div className="invalid-feedback">{errors.bio?.message}</div> */}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormEditProfile;
