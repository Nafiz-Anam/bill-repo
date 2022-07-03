import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../apiconstants";

const Form = ({ id, handleEdit }) => {
    // console.log(id);
    const { user } = useSelector((state) => state.auth);
    const [defaultData, setDefaultData] = useState({});

    useEffect(() => {
        axios
            .get(API_BASE_URL + `/api/update-billing/${id}`, {
                headers: {
                    token: `Bearer ${user?.accessToken}`,
                },
            })
            .then((res) => {
                console.log(res.data.data);
                let billData = {
                    full_name: res.data.data.full_name,
                    email: res.data.data.email,
                    phone: res.data.data.phone,
                    paid_amount: res.data.data.paid_amount,
                };
                setDefaultData(billData);
                reset(billData);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: defaultData });

    const onSubmit = (data) => {
        // console.log("form data =>", data);
        try {
            axios
                .put(API_BASE_URL + `/api/update-billing/${id}`, data, {
                    headers: {
                        token: `Bearer ${user?.accessToken}`,
                    },
                })
                .then((res) => {
                    if (res.data.status === 1) {
                        handleEdit();
                    }
                });
        } catch (err) {
            console.log(err);
        }
        reset({ full_name: "", email: "", paid_amount: "", phone: "" });
    };
    return (
        <>
            {defaultData === "" ? (
                <span>Loading...</span>
            ) : (
                <form
                    className="modal-form py-1"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            {...register("full_name", {
                                required: true,
                                pattern: /^[A-Za-z]{1}[A-Za-z\s]+$/,
                            })}
                        />
                        {errors.full_name &&
                            errors.full_name.type === "required" && (
                                <span className="text-danger">
                                    This field is required
                                </span>
                            )}
                        {errors.full_name &&
                            errors.full_name.type === "pattern" && (
                                <span className="text-danger">
                                    Name must be in alphabets
                                </span>
                            )}
                    </div>
                    <div>
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
                            <span className="text-danger">
                                This field is required
                            </span>
                        )}
                        {errors.email && errors.email.type === "pattern" && (
                            <span className="text-danger">
                                Enter valid email address
                            </span>
                        )}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Phone"
                            {...register("phone", {
                                maxLength: 11,
                                minLength: 11,
                                required: true,
                                pattern: /[0-9]/,
                            })}
                        />
                        {errors.phone && errors.phone.type === "required" && (
                            <span className="text-danger">
                                This field is required
                            </span>
                        )}
                        {errors.phone && errors.phone.type === "pattern" && (
                            <span className="text-danger">
                                Phone number must be in numeric
                            </span>
                        )}
                        {errors.phone && errors.phone.type === "maxLength" && (
                            <span className="text-danger">
                                Maximum length is 11
                            </span>
                        )}
                        {errors.phone && errors.phone.type === "minLength" && (
                            <span className="text-danger">
                                Minimum length is 11
                            </span>
                        )}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Paid Amount"
                            {...register("paid_amount", {
                                required: true,
                                pattern: /[0-9]/,
                            })}
                        />
                        {errors.paid_amount &&
                            errors.paid_amount.type === "required" && (
                                <span className="text-danger">
                                    This field is required
                                </span>
                            )}
                    </div>
                    <input
                        className="btn add-btn mt-3"
                        type="submit"
                        value="Save Data"
                    />
                </form>
            )}
        </>
    );
};

export default Form;
