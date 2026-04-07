import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import "../ChatBox/FloatingAddButton.scss"; 

export default function SalesModal({ onClose, onSelectSales }) {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await userService.getListSales();
        if (res.data?.success) {
          setSalesList(res.data.data || []);
        }
      } catch (err) {
        console.error("Lỗi load sales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="floating-modal-overlay" onClick={onClose}>
      <div className="floating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="floating-modal__header">
          <h3>Chọn Sales để tư vấn</h3>
          <button className="floating-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="floating-modal__body">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#999",
              }}
            >
              Đang tải...
            </div>
          ) : salesList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#999",
              }}
            >
              Không có sales nào
            </div>
          ) : (
            <div>
              {salesList.map((sale) => (
                <div
                  key={sale.id}
                  className="floating-sales-item"
                  onClick={() => {
                    onSelectSales(sale);
                    onClose();
                  }}
                >
                  <img
                    src={sale.avatar || "https://i.pravatar.cc/150?u=" + sale.id}
                    alt="avatar"
                    className="floating-sales-avatar"
                  />
                  <div className="floating-sales-info">
                    <div className="floating-sales-name">
                      {sale.fullName || sale.email}
                    </div>
                    <div className="floating-sales-email">{sale.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
