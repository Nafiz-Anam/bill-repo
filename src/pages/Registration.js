import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registration, reset } from "../redux/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "./global.css";

const Registration = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        if (isSuccess || user) {
            navigate("/billings");
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (data) => {
        console.log("form data =>", data);
        const userData = {
            user_name: data?.user_name,
            email: data?.email,
            password: data?.password,
        };
        dispatch(registration(userData));
    };

    return (
        <Layout>
            <div className="register-page">
                <div className="register-form container">
                    <h1 className="register-title text-center">
                        Register Here
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="User Name"
                            {...register("user_name", {
                                required: true,
                                pattern: /^[A-Za-z]{1}[A-Za-z\s]+$/,
                            })}
                        />
                        {errors.user_name &&
                            errors.user_name.type === "required" && (
                                <p className="text-danger err">
                                    This field is required
                                </p>
                            )}
                        {errors.user_name &&
                            errors.user_name.type === "pattern" && (
                                <p className="text-danger err">
                                    Name must be in alphabets
                                </p>
                            )}
                        <input
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                                required: true,
                                pattern:
                                    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            })}
                        />
                        {errors.email && errors.email.type === "required" && (
                            <p className="text-danger err">
                                This field is required
                            </p>
                        )}
                        {errors.email && errors.email.type === "pattern" && (
                            <p className="text-danger err">
                                Enter valid email address
                            </p>
                        )}
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        {errors.password &&
                            errors.password.type === "required" && (
                                <p className="text-danger err">
                                    This field is required
                                </p>
                            )}
                        {isLoading ? (
                            <input
                                className="btn btn-register"
                                type="submit"
                                value="Register"
                                disabled
                            />
                        ) : (
                            <input
                                className="btn btn-register"
                                type="submit"
                                value="Register"
                            />
                        )}
                    </form>
                    <span>
                        Already have an account?
                        <Link to="/login"> Login from here.</Link>
                    </span>
                </div>
            </div>
        </Layout>
    );
};

export default Registration;
