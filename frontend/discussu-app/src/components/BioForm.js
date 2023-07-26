import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useHomeStore } from "../store";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router";
import { ErrorCheck } from "./utils/utilFunctions";

const BioForm = ({ user, setShowEditBio }) => {
  const updateUserData = useHomeStore((state) => state.updateUserData);
  const token = Cookies.get("token");
  //   const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const schema = yup.object().shape({
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

  const onSubmit = async (data) => {
    // console.log('profile_image', data.profile_image[0]);

    let formData = new FormData();
    formData.append("username", data.username);
    formData.append("bio", data.bio);

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
      setShowEditBio(false);
      navigate("/user/profile");
    } catch (error) {
      ErrorCheck(error);
    }
  };

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="bio" className="form-label"></label>
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
        Update
      </button>
    </form>
  );
};

export default BioForm;
