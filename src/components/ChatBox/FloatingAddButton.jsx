import { useState } from "react";
import { userService } from "../../services/userService";
import "./FloatingAddButton.scss";

export default function FloatingAddButton({ onSelectUser, onOpenChat }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch sales khi mở modal
  const handleOpenSalesModal = async () => {
    setShowMenu(false);
    setShowSalesModal(true);
    setLoading(true);
    try {
      const res = await userService.getListSales();
      if (res.data?.success) {
        setSalesList(res.data.data || []);
        console.log("📋 Fetched sales:", res.data.data?.length);
      }
    } catch (err) {
      console.error("Lỗi load sales:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle open chat
  const handleOpenChat = () => {
    setShowMenu(false);
    onOpenChat();
  };

  // Handle select sales
  const handleSelectSales = (sale) => {
    onSelectUser(sale);
    setShowSalesModal(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-add-btn"
        onClick={() => setShowMenu(!showMenu)}
        title="Chọn tùy chọn"
      >
        +
      </button>

      {/* Menu Options */}
      {showMenu && (
        <div className="floating-menu">
          <button
            className="floating-menu__item floating-menu__item--chat"
            onClick={handleOpenChat}
            title="Mở hộp chat"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Chat</span>
          </button>
          <button
            className="floating-menu__item floating-menu__item--sales"
            onClick={handleOpenSalesModal}
            title="Chọn sales"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Sales</span>
          </button>
        </div>
      )}

      {/* Sales Modal */}
      {showSalesModal && (
        <div
          className="floating-modal-overlay"
          onClick={() => setShowSalesModal(false)}
        >
          <div className="floating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="floating-modal__header">
              <h3>Chọn Sales để tư vấn</h3>
              <button
                className="floating-modal__close"
                onClick={() => setShowSalesModal(false)}
              >
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
                      onClick={() => handleSelectSales(sale)}
                    >
                      <img
                        src={
                          sale.avatar ||
                          "https://i.pravatar.cc/150?u=" + sale.id
                        }
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
      )}
    </>
  );
}
