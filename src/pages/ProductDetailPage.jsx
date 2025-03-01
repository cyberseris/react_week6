import { useState,useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage(){
    const [product, setProduct] = useState({});
    const [qtySelect, setQtySelect] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const {id:product_id} = useParams();
    

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`);
        setProduct(res.data.product);
      } catch (error) {
        alert("取得產品失敗");
        console.log("Error: ", error)
      } finally{
        setIsScreenLoading(false);
      }
    };
    
    const addCart = async(product_id, qtySelect) => {
        setIsLoading(true);
        try{
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`,
                {
                    data:{
                        "product_id":product_id,
                        "qty":Number(qtySelect)
                    }
                });
                setQtySelect(1);
        }catch(error){
            console.log("Error: ", error)
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-6">
                        <img className="img-fluid" src={product.imageUrl} alt={product.title}></img>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center gap-2">
                            <h2>{product.title}</h2>
                            <span className="badge text-bg-success">{product.category}</span>
                        </div>
                        <p className="mb-3">{product.description}</p>
                        <p className="mb-3">{product.content}</p>
                        <h5 className="mb-3">NT$ {product.price}</h5>
                        <div className="input-group align-items-center w-75">
                            <select
                                value={qtySelect}
                                onChange={(e)=>setQtySelect(e.target.value)}
                                id="qtySelect"
                                className="form-select"
                            >
                                {
                                    Array.from({length:10}).map((_,index)=>
                                        (
                                            <option key={index} value={index+1}>
                                                {index+1}
                                            </option>
                                        ))
                                }
                            </select>
                            <button type="button" onClick={()=>addCart(product_id,qtySelect)} className="btn btn-primary d-flex align-items-center gap-2" disabled={isLoading}>
                                加入購物車
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            </button>
                        </div>    
                    </div>
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