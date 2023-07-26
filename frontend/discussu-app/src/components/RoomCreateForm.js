import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useHomeStore } from "../store";
import { getHeaders } from "../api/getHeaders";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import {useState } from "react";
import { ErrorCheck } from "./utils/utilFunctions";
import useErrorCheck from "./utils/useErrorCheck"
import useHandleLogout from "./utils/useHandleLogout"


const RoomCreateForm = () => {
  // const errorCheck = useErrorCheck()
  const handleLogout = useHandleLogout()
  const categories = useHomeStore((state) => state.categories);
  const schools = useHomeStore((state) => state.schools);
  const token = Cookies.get("token");
  //   const handleLogout = useHandleLogout();
  const navigate = useNavigate();
  const [category_name, setCategory_name] = useState('')
  const user = JSON.parse(localStorage.getItem("user"))

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    category: yup.string().required(),

    // school: yup.string().required("Please select a school."),
    school: yup.array().of(yup.string()).min(1, 'Please select at least one school.').required("Please select a school."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    let room;
    let permit_all = false;
    if (data.school.includes('all')) {
      data.school = data.school.filter(school => school !== 'all');
      permit_all = true;
    }

    console.log("school data", data.school);
    if (data.category === "New Category") {
      room = {
        "name": data.name,
        "description": data.description,
        "school": data.school,
        "category_name": data.newCategory,
        "permit_all": permit_all,
        "host": user.id
      }
    } else {
      room = {
        "name": data.name,
        "description": data.description,
        "school": data.school,
        "category_name": null,
        "category": data.category,
        "permit_all": permit_all,
        "host": user.id
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/rooms/`,
        room,
        getHeaders(token)
      );
      console.log("Room create data", response.data);
      // await getRoomsData()
      navigate(`/room/${response.data.id}`)
    }catch (error) {
      ErrorCheck(error)
    }



    function ErrorCheck(error) {
      if (error.response) {
        // Handle API error (status code 4xx or 5xx)
        console.error(error.response.data);
        if (error.response.data.details === "Invalid token.") {
          handleLogout()
        }
      } else if (error.request) {
        // Handle request error (no response received)
        console.error("No response from server.");
      } else {
        // Handle other errors
        console.error("An error occurred:", error.message);
      }
    }
  };

  return (
    <div className="container">
      <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
        {/* 'id', 'name', 'category', 'host', 'description',
         */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Room Name
          </label>
          <input
            type="text"
            id="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Room Name..."
            {...register("name")}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Room description
          </label>
          <input
            type="text"
            id="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            placeholder="Room description..."
            {...register("description")}
          />
          <div className="invalid-feedback">{errors.description?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="school" className="form-label">
            Permitted Schools
          </label>
          <select multiple
            {...register("school")}
            id="school"
            className={`form-control ${errors.school ? "is-invalid" : ""}`}
          >
            <option value="" disabled>
              Select School...
            </option>
            <option value="all">All Schools...</option>

            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.school?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className={`form-control ${errors.category ? "is-invalid" : ""}`}
            onChange={(e) => setCategory_name(e.target.value)}
          >
            <option value="" disabled>
              Select Category...
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="New Category" onClick={() => setCategory_name("New Category")}>New Category</option>
          </select>
          <div className="invalid-feedback">{errors.category?.message}</div>
        </div>

        {category_name === "New Category" && (
          <div className="mb-3">
            <label htmlFor="newCategory" className="form-label">
              New Category
            </label>
            <input
              type="text"
              id="newCategory"
              name="newCategory"
              className={`form-control ${errors.category ? "is-invalid" : ""}`}
              {...register("newCategory", {
                required: "New Category is required",
              })}
              required
            />
            <div className="invalid-feedback">{errors.category?.message}</div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RoomCreateForm;
