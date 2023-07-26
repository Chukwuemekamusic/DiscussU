import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useHomeStore } from "../store";
import { getHeaders } from "../api/getHeaders";
import Cookies from "js-cookie";
import useHandleLogout from "./utils/useHandleLogout";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { useLocation } from "react-router";
import { useGoBack } from "./utils/utilFunctions";


const RoomUpdateForm = () => {
    const categories = useHomeStore((state) => state.categories);
    const schools = useHomeStore((state) => state.schools);
    const location = useLocation();
    const {room: roomData} = location.state;
    const GoBackButton = useGoBack();
    

    const token = Cookies.get("token");
    //   const handleLogout = useHandleLogout();
    const navigate = useNavigate();
    const [category_name, setCategory_name] = useState('')


    //   get previous category and school id of roomData
    const selectedCategory = categories.find((category) => category.name === roomData.category);
    const selectedSchools = roomData.school.map((schoolId) => schools.find((school) => school.id === schoolId));
    // console.log('school_data', roomData.school);
    if (Array.isArray(roomData.school) && roomData.school.length === 0) {
        roomData.school.push('all');
      }
    const [schoolValue, setSchoolValue] = useState(roomData.school)

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
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: roomData.name,
            description: roomData?.description,
            category: selectedCategory?.id || '',
            // school: [...roomData.school]
        }
    });

    const onSubmit = async (data) => {
        // console.log(data);
        let room;
        let permit_all = false;
        if (data.school.includes('all')) {
            data.school = data.school.filter(school => school !== 'all');
            permit_all = true;
        }

        // console.log("school data", data.school);
        if (data.category === "New Category") {
            room = {
                "name": data.name,
                "description": data.description,
                "school": data.school,
                "category_name": data.newCategory,
                "permit_all": permit_all,
                "host": roomData.host
            }
        } else {
            room = {
                "name": data.name,
                "description": data.description,
                "school": data.school,
                "category_name": null,
                "category": data.category,
                "permit_all": permit_all,
                "host": roomData.host
            }
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/api/rooms/${roomData.id}/update/`,
                room,
                getHeaders(token)
            );
            // console.log("Room update data", response.data);
            // getRoomData()
            navigate(`/room/${response.data.id}`)
        } catch (error) {
            ErrorCheck(error);
        }



        function ErrorCheck(error) {
            if (error.response) {
                // Handle API error (status code 4xx or 5xx)
                console.error(error.response.data);
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
        <div className="container mb-3 p-3">
            <GoBackButton/>
            <h3>Update Room</h3>
            <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
                {/* 'id', 'name', 'category', 'host', 'description',
         */}
                {/* Name */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Room Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Room Name..."
                        onChange={((e) => setValue('name', e.target.value))}
                        {...register("name")}
                    />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>

                {/* Description */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Room description
                    </label>
                    <input
                        type="text"
                        id="description"
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        placeholder="Room description..."
                        onChange={(e) => setValue('description', e.target.value)}
                        {...register("description")}
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                </div>

                {/* School */}
                <div className="mb-3">
                    <label htmlFor="school" className="form-label">
                        Permitted Schools
                    </label>
                    <select 
                        {...register("school")}
                        id="school"
                        className={`form-control ${errors.school ? "is-invalid" : ""}`}
                        onChange={(e) => setSchoolValue([...e.target.selectedOptions].map(option => option.value))}                        
                        value={schoolValue}
                        multiple
                    >
                        <option value="" disabled selected>
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

                {/* Category */}
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                        Category
                    </label>
                    <select
                        {...register("category")}
                        id="category"
                        className={`form-control ${errors.category ? "is-invalid" : ""}`}
                        onChange={(e) => setCategory_name(e.target.value)}
                    // value={selectedCategory?.id || ''}
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

export default RoomUpdateForm;
