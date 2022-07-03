import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../redux/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "./global.css";

const Login = () => {
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
        if (isSuccess || user) {
            navigate("/billings");
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (data) => {
        console.log("form data =>", data);
        const userData = {
            email: data?.email,
            password: data?.password,
        };
        dispatch(login(userData));
    };

    return (
        <Layout>
            <div className="login-page">
                <div className="container">
                    <h1 className="text-center login-title">Login Here</h1>
                    <div className="login-form">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: true,
                                    pattern:
                                        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                })}
                            />
                            {errors.email &&
                                errors.email.type === "required" && (
                                    <p className="text-danger err">
                                        This field is required
                                    </p>
                                )}
                            {errors.email &&
                                errors.email.type === "pattern" && (
                                    <p className="text-danger err">
                                        Enter valid email address
                                    </p>
                                )}
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password", {
                                    required: true,
                                })}
                            />
                            {errors.password &&
                                errors.password.type === "required" && (
                                    <p className="text-danger err">
                                        This field is required
                                    </p>
                                )}
                            {isLoading ? (
                                <input
                                    className="btn login-btn"
                                    type="submit"
                                    value="Login"
                                    disabled
                                />
                            ) : (
                                <input
                                    className="btn login-btn"
                                    type="submit"
                                    value="Login"
                                />
                            )}
                        </form>
                        <span>
                            Don't have an account?
                            <Link to="/registration"> Create an account.</Link>
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
