import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { useHomeStore } from "../store";

const Form = ({ getSchoolsData }) => {
  //   useEffect(() => {
  //     getSchoolsData();
  //   }, []);

  const schools = useHomeStore((state) => state.schools);

  const schema = yup.object().shape({
    username: yup.string().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    student_id: yup.string().required(),
    password: yup.string().min(4).max(20).required(),
    password2: yup.string().oneOf([yup.ref("password")],"Passwords must match").required("Confirm Password is required"),
    school: yup.string().required("Please select a school."),
  });

  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 'id', 'username', 'first_name', 'last_name',
                  'email', 'student_id', 'school', 'course' */}
    <label htmlFor="first_name">First Name</label>
      <input
        type="text"
        placeholder="First Name..."
        {...register("first_name")}
      />
        <span className="form-error text-danger">{errors.first_name?.message}</span>

      <input
        type="text"
        placeholder="Last Name..."
        {...register("last_name")}
      />
      <span className="form-error text-danger">{errors.last_name?.message}</span>

      <input type="text" placeholder="Username..." {...register("username")} />
      <span className="form-error text-danger">{errors.username?.message}</span>

      <input type="email" placeholder="Email..." {...register("email")} />
      <span className="form-error text-danger">{errors.email?.message}</span>

      <input
        type="number "
        placeholder="Student ID..."
        {...register("student_id")}
      />
      <span className="form-error text-danger">{errors.student_id?.message}</span>

      <input type="text" placeholder="Course..." {...register("course")} />
      <span className="form-error text-danger">{errors.course?.message}</span>

      <input type="password" placeholder="Password" {...register("password")} />
      <span className="form-error text-danger">{errors.password?.message}</span>
      <input
        type="password"
        placeholder="Confirm Password"
        {...register("password2")}
      />
      <span className="form-error text-danger">{errors.password2?.message}</span>

      <select {...register("school")}>
        <option value="" disabled selected>
          Select School...
        </option>
        {schools.map((school) => {
          console.log("school", school.name);
          return <option key={school.id} value={school.id}>{school.name}</option>;
        })}
      </select>
      <span className="form-error text-danger">{errors.school?.message}</span>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
