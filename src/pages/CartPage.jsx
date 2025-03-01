import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){
    const [cart, setCart] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(false);

    useEffect(() => {
        getCart();
    }, []);

    const getCart = async() => {
        try{
            const resGetCart = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
            setCart(Array.isArray(resGetCart.data.data.carts)?resGetCart.data.data.carts:[]);
            /* console.log("resGetCart.data.data.carts",resGetCart.data.data.carts) */
            getTotalPrice();
        }catch(error){
            console.log("Error: ", error)
        }
    }

    const updateCart = async(item,num) => {
        setIsScreenLoading(true);
        try{
            if((item.qty+num)>0){
                await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${item.id}`,{
                data:{
                    product_id:item.product_id,
                    qty:item.qty+num
                }
                })
                /* console.log("resUpdateCart", resUpdateCart) */
                getCart();
            }
        }catch(error){
            console.log("Error: ", error)
        }finally{
            setIsScreenLoading(false);
        }
    }

    const removeCartItem = async(id) => {
        setIsScreenLoading(true);
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`); 
            getCart();
        }catch(error){
            console.log("Error: ", error)
        }finally{
            setIsScreenLoading(false);
        }
    }

    const removeCart = async() => {
        setIsScreenLoading(true);
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`); 
            getCart();
        }catch(error){
            console.log("Error: ", error)
        }finally{
            setIsScreenLoading(false);
        }
    }

    const getTotalPrice = () => {
        const total = cart?.reduce((prev,item)=>{
            return prev + item.product.price*item.qty
        },0);
        return total
    }

    const  {
        register,
        handleSubmit,
        formState:{errors},
        reset
    } = useForm();

    const onSubmit = handleSubmit((data) => {
    const {message, ...user} = data;
    const userInfo = {
        data:{
            user,
            message
        }
        }
        checkout(userInfo);
    })

    const checkout = async(data) => {
        setIsScreenLoading(true);
        try{
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
            getCart();
            reset();
        }catch(error){
            console.log("Error: ", error)
        }finally{
            setIsScreenLoading(false);
        }
    }

    return (
        <>
            <div className="container">
                <div className="mt-4">
                    {
                    cart.length?<div className="text-end py-3">
                    <button type="button" onClick={removeCart} className="btn btn-outline-danger">
                        清空購物車
                    </button>
                    </div>:''
                    }

                    {
                    cart.length? <table className="table align-middle">
                    <thead>
                        <tr>
                        <th></th>
                        <th>品名</th>
                        <th style={{ width: "150px" }}>數量/單位</th>
                        <th className="text">單價</th>
                        <th className="text-end">總價</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                        cart.length?cart?.map((item) => {
                            return (
                            <tr key={item.id}>
                                <td>
                                <button type="button" onClick={()=>removeCartItem(item.id)} className="btn btn-outline-danger btn-sm">
                                    x
                                </button>
                                </td>
                                <td>{item.product.title}</td>
                                <td style={{ width: "150px" }}>
                                <div className="d-flex align-items-center">
                                    <div className="btn-group me-2" role="group">
                                    <button
                                        type="button"
                                        onClick={()=>updateCart(item,-1)}
                                        disabled = {item.qty===1}
                                        className="btn btn-outline-dark btn-sm"
                                    >
                                        -
                                    </button>
                                    <span
                                        className="btn border border-dark"
                                        style={{ width: "50px", cursor: "auto" }}
                                    >{item.qty}</span>
                                    <button
                                        type="button"
                                        onClick={()=>updateCart(item,1)}
                                        className="btn btn-outline-dark btn-sm"
                                    >
                                        +
                                    </button>
                                    </div>
                                    <span className="input-group-text bg-transparent border-0">
                                    {item.product.unit}
                                    </span>
                                </div>
                                </td>
                                <td className="">{item.product.price}</td>
                                <td className="text-end">{item.total}</td>
                            </tr>
                            )
                        }):<td colSpan="4" className="text-center">
                            目前購物車沒有任何東西：
                        </td>
                        }

                    </tbody>
                    <tfoot>
                        <tr>
                        <td colSpan="4" className="text-end">
                            總計：
                        </td>
                        <td className="text-end" style={{ width: "130px" }}>
                            {
                            getTotalPrice()
                            }
                        </td>
                        </tr>
                    </tfoot>
                    </table>:''
                    }

                </div>

                <div className="my-5 row justify-content-center">
                    <form onSubmit={onSubmit} className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                        Email
                        </label>
                        <input
                        {...register('email', {
                            required: 'Email 欄位必填',
                            pattern:{
                            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message:'Email 格式錯誤'
                            }
                        })}
                        id="email"
                        type="email"
                        className={`form-control ${errors.email && 'is-invalid'}`}
                        placeholder="請輸入 Email"
                        />
                        {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                        收件人姓名
                        </label>
                        <input
                        {...register('name', {
                            required: '姓名欄位必填',
                        })}
                        id="name"
                        className={`form-control ${errors.name && 'is-invalid'}`}
                        placeholder="請輸入姓名"
                        />
                        {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tel" className="form-label">
                        收件人電話
                        </label>
                        <input
                        {...register('tel', {
                            required: '電話欄位必填',
                            pattern:{
                            value:/^(0[2-8]\d{7}|09\d{8})$/,
                            message:'電話格式錯誤'
                            }
                        })}
                        id="tel"
                        type="text"
                        className={`form-control ${errors.tel && 'is-invalid'}`}
                        placeholder="請輸入電話"
                        />
                        {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                        收件人地址
                        </label>
                        <input
                        {...register('address', {
                            required: '地址欄位必填',
                        })}
                        id="address"
                        type="text"
                        className={`form-control ${errors.address && 'is-invalid'}`}
                        placeholder="請輸入地址"
                        />
                        {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                        留言
                        </label>
                        <textarea
                        {...register('message')}
                        id="message"
                        className="form-control"
                        cols="30"
                        rows="10"
                        ></textarea>
                    </div>
                    <div className="text-end">
                        <button type="submit" className="btn btn-danger">
                        送出訂單
                        </button>
                    </div>
                    </form>
                </div>
            </div>
            {isScreenLoading && (
                <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    zIndex: 999,
                }}
                >
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                </div>
            )}
        </>
    )
}