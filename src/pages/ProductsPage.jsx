import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage(){
    const [products, setProducts] = useState([]);
    const [qtySelect, setQtySelect] = useState(1);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
        console.log("Error: ", error)
      } finally{
        setIsScreenLoading(false);
      }
    };

    const addCart = async(product) => {
        setIsLoading(true);
        try{
        const resAddCart = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
            data:{
            "product_id": product.id,
            "qty": Number(qtySelect)
            }
        });
        setQtySelect(1);
        /* getCart(); */
        }catch(error){
        console.log("Error: ", error)
        }finally{
        setIsLoading(false);
        }
    }

    return (
        <>
            <div className="container">
                <table className="table align-middle">
                    <thead>
                        <tr>
                        <th>圖片</th>
                        <th>商品名稱</th>
                        <th>價格</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) =>{
                            return (
                                <tr key={product.id}>
                                    <td style={{ width: "200px" }}>
                                    <img
                                        className="img-fluid"
                                        src={product.imageUrl}
                                        alt={product.title}
                                    />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>
                                    <del className="h6">原價 {product.origin_price} 元</del>
                                    <div className="h5">特價 {product.price}元</div>
                                    </td>
                                    <td>
                                    <div className="btn-group btn-group-sm">
                                        <Link to={`/products/${product.id}`}
                                        className="btn btn-outline-secondary me-2"
                                        >
                                        查看更多
                                        </Link>
                                        <button type="button" onClick={()=>addCart(product)} className="btn btn-outline-danger d-flex align-items-center" disabled={isLoading}>
                                        加到購物車
                                        {isLoading && <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>}
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                )
                        })}
                    </tbody>
                </table>
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