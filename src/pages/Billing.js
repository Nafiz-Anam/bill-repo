import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table/Table";
import "./global.css";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Form from "../components/Form";
import { API_BASE_URL } from "../apiconstants";
import { useSelector, useDispatch } from "react-redux";
import { getBills } from "../redux/features/bills/billSlice";

const Billing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { bills, isLoading, isError, message } = useSelector(
        (state) => state.bill
    );

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);
    const [billID, setBillID] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [loadData, setLoadData] = useState(false);

    const handleEdit = () => {
        setLoadData(true);
        handleClose2();
    };

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        if (!user) {
            navigate("/login");
        }
        dispatch(getBills());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (loadData) {
        dispatch(getBills());
        setLoadData(false);
    }

    const editBilling = (props) => {
        handleShow2();
        const id = props?.row?.original?._id;
        setBillID(id);
        // console.log(id);
    };
    const deleteBilling = (props) => {
        const id = props?.row?.original?._id;
        console.log(id);
        try {
            axios
                .delete(API_BASE_URL + `/api/delete-billing/${id}`, {
                    headers: {
                        token: `Bearer ${user?.accessToken}`,
                    },
                })
                .then((res) => {
                    if (res.data.status === 1) {
                        setLoadData(true);
                    }
                });
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        {
            Header: "Billing ID",
            accessor: "billing_id",
        },
        {
            Header: "Name",
            accessor: "full_name",
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Phone",
            accessor: "phone",
        },
        {
            Header: "Paid Amount",
            accessor: "paid_amount",
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: (props) => (
                <div className="d-flex">
                    <i
                        className="fas fa-edit p-2"
                        onClick={() => editBilling(props)}
                    ></i>
                    <i
                        className="fas fa-trash p-2"
                        onClick={() => deleteBilling(props)}
                    ></i>
                </div>
            ),
        },
    ];

    const itemsPerPage = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
    ];

    const onSubmit = (data) => {
        // console.log("form data =>", data);
        try {
            axios
                .post(API_BASE_URL + "/api/add-billing/", data, {
                    headers: {
                        token: `Bearer ${user?.accessToken}`,
                    },
                })
                .then((res) => {
                    if (res.data.status === 1) {
                        setLoadData(true);
                        handleClose(true);
                    }
                });
        } catch (err) {
            console.log(err);
        }
        reset({ full_name: "", email: "", paid_amount: "", phone: "" });
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="billing-title">Billing List</h2>
                <button className="btn btn-primary" onClick={handleShow}>
                    Add New
                </button>
            </div>
            {isLoading ? (
                <span>Loading...</span>
            ) : (
                <Table
                    columns={columns}
                    data={bills && bills}
                    pageSize={10}
                    sizePerPageList={itemsPerPage}
                    isSortable={true}
                    pagination={true}
                    isSearchable={true}
                />
            )}

            {/* modal edit*/}

            <Modal show={show2} onHide={handleClose2} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Billing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id={billID} handleEdit={handleEdit} />
                </Modal.Body>
            </Modal>

            {/* modal add*/}

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Billing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                            {errors.email &&
                                errors.email.type === "required" && (
                                    <span className="text-danger">
                                        This field is required
                                    </span>
                                )}
                            {errors.email &&
                                errors.email.type === "pattern" && (
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
                            {errors.phone &&
                                errors.phone.type === "required" && (
                                    <span className="text-danger">
                                        This field is required
                                    </span>
                                )}
                            {errors.phone &&
                                errors.phone.type === "pattern" && (
                                    <span className="text-danger">
                                        Phone number must be in numeric
                                    </span>
                                )}
                            {errors.phone &&
                                errors.phone.type === "maxLength" && (
                                    <span className="text-danger">
                                        Maximum length is 11
                                    </span>
                                )}
                            {errors.phone &&
                                errors.phone.type === "minLength" && (
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
                            value="Add Data"
                        />
                    </form>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default Billing;
