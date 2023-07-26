
// old form
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useHomeStore } from "../store";
import { getHeaders } from "../api/getHeaders";
import Cookies from "js-cookie";
import useHandleLogout from "./utils/useHandleLogout";
import { useNavigate } from "react-router";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const Form = () => {
  const schools = useHomeStore((state) => state.schools);
  const token = Cookies.get("token");
  const handleLogout = useHandleLogout();
  const navigate = useNavigate();

  const { setAuth, setUser } = useContext(AuthContext);

  //   logout anyone who want to access the form
  if (token) {
    handleLogout();
  }

  const schema = yup.object().shape({
    username: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    student_id: yup
      .string()
      .required()
      .matches(/^\d+$/, "Student ID must contain only digits"),
    password: yup.string().min(4).max(20).required(),
    password2: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
    school: yup.string().required("Please select a school."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data.username);
    const user = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      student_id: data.student_id,
      school: data.school,
      course: data.course,
      password: data.password,
    };

    // logout any user still logged in just in case
    // plainLogout();

    try {
      const registrationResponse = await axios.post(
        `http://localhost:8000/api/users/create/`,
        user,
        {
          headers: { "Content-Type": "application/json" },
        //   headers: { "Content-Type": "multipart/form-data" },
        //   const URL = 'http://localhost:8000/'
          withCredentials: true,
        }
      );
      console.log("Registration data", registrationResponse.data);

      // login user immediately
      if (registrationResponse.data.username) {
        handleLogin(data);
      } else {
        console.error("Registration failed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (data) => {
    try {
      const loginResponse = await axios.post(
        `http://localhost:8000/api/users/login/`,
        { email: data.email, password: data.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // set the token
      const newToken = loginResponse.data.token;
      Cookies.set("token", newToken);

      // set the user
      const user = loginResponse.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      setAuth({ newToken });
      setUser(user);

      navigate("/");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
        {/* 'id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course' */}
        <div className="mb-3">
          <label htmlFor="profile_image" className="form-label">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            id="profile_image"
            className={`form-control`}
            // onChange={handleChange}
            // placeholder="First Name..."
          />
        </div>

        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            // placeholder="First Name..."
            {...register("first_name")}
          />
          <div className="invalid-feedback">{errors.first_name?.message}</div>
        </div>

        {/* Repeat the same pattern for other form fields */}

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            placeholder="Last Name..."
            {...register("last_name")}
          />
          <div className="invalid-feedback">{errors.last_name?.message}</div>
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
            {...register("username")}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            id="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="email..."
            {...register("email")}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        {/* ... (other form fields) */}

        <div className="mb-3">
          <label htmlFor="student_id" className="form-label">
            Student ID
          </label>
          <input
            type="number"
            id="student_id"
            className={`form-control ${errors.student_id ? "is-invalid" : ""}`}
            placeholder="Student ID..."
            {...register("student_id")}
          />
          <div className="invalid-feedback">{errors.student_id?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="course" className="form-label">
            Course
          </label>
          <input
            type="text"
            id="course"
            className={`form-control ${errors.course ? "is-invalid" : ""}`}
            placeholder="Course..."
            {...register("course")}
          />
          <div className="invalid-feedback">{errors.course?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            {...register("password")}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            className={`form-control ${errors.password2 ? "is-invalid" : ""}`}
            placeholder="Confirm Password"
            {...register("password2")}
          />
          <div className="invalid-feedback">{errors.password2?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="school" className="form-label">
            School
          </label>
          <select
            {...register("school")}
            id="school"
            className={`form-control ${errors.school ? "is-invalid" : ""}`}
          >
            <option value="" disabled selected>
              Select School...
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.school?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
