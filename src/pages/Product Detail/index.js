import React, { Component } from "react";
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux'

import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";

import "./ProductDetail.css";
//import axios from "axios";
import withParams from "../../Helper/withParams";
import withLocation from "../../Helper/withLocation";
import { getProductDetail } from "../../utiliti/product";
import { formater } from "../../Helper/formatNumber";

import {
    counterUp,
    counterDown,
    setDelivery,
    setIdProduct,
    setPictures,
    setName,
    setSize,
    setTime,
    setPrice,
} from "../../redux/actionCreator/cart";
class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckOut: false,
            successMsg: "",
            errorMsg: "",
            token: localStorage.getItem("token"),
            product: {
                getProduct: [],
            },
        }
    }

    getProductDetailPage = (id) => {
        getProductDetail(id)
            .then((res) => {
                //console.log(res.data)
                this.setState({
                    product: { ...this.state.product, getProduct: res.data.data[0] },
                });
            })
            .catch((err) => {
                console.log("ERROR GET PRODUCTS", err);
            });
    };

    setAddCart(event) {
        event.preventDefault();
        const { getProduct } = this.state.product;
        console.log(getProduct);
        const {
            params: { id },
            dispatch,
        } = this.props;
        dispatch(setIdProduct(id));
        dispatch(setPictures(getProduct.pictures));
        dispatch(setName(getProduct.name));
        dispatch(setPrice(getProduct.price));
        dispatch(setSize);
    }

    checkOutHandle = () => {
        const { token } = this.state;
        if (token) {
            this.setState({
                isCheckOut: true,
            });
        }
        // this.setState({
        //   showModal: true,
        // });
    };

    componentDidMount() {
        const {
            params: { id },
            location: state,
        } = this.props;
        this.getProductDetailPage(id);
    }
    render() {
        const { params, dispatch, counter, size, delivery } = this.props;
        //console.log(counter);
        const { getProduct } = this.state.product
        if (this.state.isCheckOut) return <Navigate to="/payment" />;
        return (
            <div>
                <Header />
                <main>
                    {params.id ? (
                        <section className="pd-main-container">
                            <div className="pd-title-menu">
                                <Link to={"/product"}>
                                    {`${getProduct.category === "non coffee" ? "Non Coffee" : getProduct.category}`}
                                </Link><span>{`>${getProduct.name}`}</span></div>
                            <section className="pd-main-content">
                                <div className="pd-left-content">
                                    <div className="pd-main-img-container">
                                        <img src={`http://localhost:8000${getProduct.pictures}`} alt="coldbrew" className="pd-main-img" />
                                    </div>
                                    <div className="pd-main-product-name">
                                        <h2>{getProduct.name}</h2>
                                        <p>{`${formater.format(getProduct.price)}`}</p>
                                    </div>
                                    <div className="pd-addcart-button"
                                        onClick={this.setAddCart}
                                    >Add to Cart</div>
                                    <div className="pd-askstaff-button">Ask a Staff</div>
                                </div>
                                <div className="pd-right-content">
                                    <div className="pd-desc-card">
                                        <div className="pd-desc-delivery">
                                            <p>Delivery only on <span>Monday to friday</span>  at <span>{getProduct.start_hours} am - {getProduct.end_hours} pm</span> </p>
                                        </div>
                                        <div className="pd-desc-info">
                                            <p>
                                                {getProduct.description}
                                            </p>
                                        </div>
                                        <div className="pd-choose-size">
                                            <h4 className="pd-size-title">Choose a size</h4>
                                            <div className="pd-size-container">
                                                <label className="pd-size-vector">R
                                                    <input type="radio" className='pd-size-input' name='pd-size-input' value="2"
                                                        onClick={() => {
                                                            dispatch(setSize("Reguler"));
                                                        }}
                                                    /><span className='pd-size-checkmark'></span>
                                                </label>
                                                <label className="pd-size-vector">L
                                                    <input type="radio" className='pd-size-input' name='pd-size-input' value="3"
                                                        onClick={() => {
                                                            dispatch(setSize("Large"));
                                                        }}
                                                    /><span className='pd-size-checkmark'></span>
                                                </label>
                                                <label className="pd-size-vector">XL
                                                    <input type="radio" className='pd-size-input' name='pd-size-input' value="6"
                                                        onClick={() => {
                                                            dispatch(setSize("Extra Large"));
                                                        }}
                                                    /><span className='pd-size-checkmark'></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pd-delivery-container">
                                        <h4 className="pd-delivery-title">Choose Delivery Methods</h4>
                                        <div className="pd-delivery-button">
                                            <label className="pd-dm-button-inactive">
                                                <input type="radio" name="pd-dm-input" className='pd-dm-input' />
                                                <span className="pd-dm-checkmark"
                                                    value="1"
                                                    //checked={delivery === 1}
                                                    onChange={(event) => {
                                                        dispatch(setDelivery(event.target.value));
                                                    }}>Dine in</span></label>
                                            <label className="pd-dm-button-inactive">
                                                <input type="radio" name="pd-dm-input" className='pd-dm-input' />
                                                <span className="pd-dm-checkmark"
                                                    value="2"
                                                    //checked={delivery === 2}
                                                    onChange={(event) => {
                                                        dispatch(setDelivery(event.target.value));
                                                    }}>Door Delivery</span></label>
                                            <label className="pd-dm-button-inactive">
                                                <input type="radio" name="pd-dm-input" className='pd-dm-input' />
                                                <span className="pd-dm-checkmark"
                                                    value="6"
                                                    //checked={delivery === 6}
                                                    onChange={(event) => {
                                                        dispatch(setDelivery(event.target.value));
                                                    }}>Pick up</span></label>
                                        </div>
                                        <form className="pd-settime">
                                            <label htmlFor="settime">Set time:</label>
                                            <input type="time" className="settime" id="settime" placeholder="Enter the time you'll arrived"
                                                value={this.state.time}
                                                onChange={(event) => {
                                                    dispatch(setTime(event.target.value));
                                                }} />
                                        </form>
                                    </div>
                                </div>
                            </section>
                            <section className="pd-checkout-container">
                                <div className="pd-product-checkout">
                                    <div className="pd-checkout-img">
                                        <img src={`http://localhost:8000${getProduct.pictures}`} alt="coldbrew" className='pd-check-out-img' />
                                    </div>
                                    <div className="pd-checkout-info">
                                        <h4 className="pd-checkout-name">{getProduct.name}</h4>
                                        <div className="pd-checkout-details">
                                            {counter !== 0 ? (
                                                <p>{`x${counter}`}</p>
                                            ) : null}
                                            <p>{size} {delivery}</p>
                                        </div>
                                    </div>
                                    <div className="pd-checkout-quantity">
                                        <div className="pd-minus-button" onClick={() => {
                                            if (counter > 0) {
                                                dispatch(counterDown());
                                            }
                                        }}>-</div>
                                        <div className="pd-quantity">{counter}</div>
                                        <div className="pd-plus-button" onClick={() => dispatch(counterUp())}>+</div>
                                    </div>
                                </div>
                                <div className="pd-checkout-button" onClick={this.checkOutHandle}>CHECKOUT</div>
                            </section>
                        </section>
                    ) : null}
                </main>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        cart: { counter, size, delivery },
    } = state;
    return { counter, size, delivery };
}

export default connect(mapStateToProps)(withLocation(withParams(ProductDetail)))