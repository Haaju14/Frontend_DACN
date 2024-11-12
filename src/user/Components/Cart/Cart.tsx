import React, { useState, useEffect } from "react";
import { Checkbox, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../../public/user/css/Cart.css"; // Import file CSS để style
import { BASE_URL } from "../../../util/fetchfromAPI";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // Dữ liệu giỏ hàng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

  // Lấy token từ localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token"); // Lấy token từ localStorage
  };

  // Cấu hình header với token
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {}; // Thêm Authorization header nếu có token
  };

  // Lấy giỏ hàng từ backend
  const fetchCartItems = async () => {
    try {
      const headers = getAuthHeaders(); // Lấy header với token
      const { data } = await axios.get(`${BASE_URL}/don-hang`, { headers }); // Lấy giỏ hàng từ backend
      setCartItems(data); // Giả sử backend trả về giỏ hàng trong data
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.IDKhoaHoc_KhoaHoc && item.IDKhoaHoc_KhoaHoc.GiaTien ? item.IDKhoaHoc_KhoaHoc.GiaTien : 0;
      return total + price * 1; // Số lượng cố định là 1
    }, 0);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDeleteItem = async (IDDonHang: number) => {
    try {
      const headers = getAuthHeaders(); // Lấy header với token
      const response = await axios.delete(`${BASE_URL}/don-hang/delete/${IDDonHang}`, { headers });
      setCartItems(cartItems.filter((item) => item.IDDonHang !== IDDonHang));
      console.log("Xóa đơn hàng thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };

  // Nếu đang loading, hiển thị loading
  if (loading) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-header">
        <span className="product-info">Sản phẩm</span>
        <span className="price">Đơn giá</span>
        <span className="quantity">Số lượng</span>
        <span className="total-price">Số tiền</span>
        <span className="action">Thao tác</span>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.IDDonHang} className="cart-item">
            <div className="product-info">
              {/* Kiểm tra nếu item.IDKhoaHoc_KhoaHoc và item.IDKhoaHoc_KhoaHoc.HinhAnh tồn tại */}
              {item.IDKhoaHoc_KhoaHoc && item.IDKhoaHoc_KhoaHoc.HinhAnh ? (
                <img
                  src={item.IDKhoaHoc_KhoaHoc.HinhAnh}
                  alt={item.IDKhoaHoc_KhoaHoc.TenKhoaHoc}
                  className="product-image"
                />
              ) : (
                <span>Hình ảnh không có sẵn</span>
              )}
              <span>{item.IDKhoaHoc_KhoaHoc ? item.IDKhoaHoc_KhoaHoc.TenKhoaHoc : "Tên khóa học không có"}</span>
            </div>
            <div className="price">
              {/* Hiển thị đơn giá nếu có */}
              {item.IDKhoaHoc_KhoaHoc ? item.IDKhoaHoc_KhoaHoc.GiaTien.toLocaleString() : "0 đ"}
            </div>
            <div className="quantity">1</div> {/* Số lượng cố định là 1 */}
            <div className="total-price">
              {/* Hiển thị tổng tiền nếu có */}
              {item.TongTien ? item.TongTien.toLocaleString() : "0 đ"}
            </div>
            <div className="action">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteItem(item.IDDonHang)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="total">
          Tổng tiền: <span>{calculateTotalPrice().toLocaleString()} đ</span> {/* Cập nhật tổng tiền */}
        </div>
        <Button type="primary" size="large">
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
