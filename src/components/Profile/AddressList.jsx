import { useState } from "react";
import { userService } from "@/services/userService";
import "./AddressList.scss";

export default function AddressList({ profile, onReload }) {

    const [newAddress, setNewAddress] = useState({
        street: "",
        ward: "",
        district: "",
        city: ""
    });

    const handleChange = (e) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleAdd = async () => {
        if (!newAddress.street || !newAddress.city) {
            alert("Vui lòng nhập đầy đủ địa chỉ");
            return;
        }

        try {
            await userService.addAddress(newAddress);
            onReload();
            setNewAddress({
                street: "",
                ward: "",
                district: "",
                city: ""
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Xóa địa chỉ này?")) return;

        try {
            await userService.removeAddress(id);
            onReload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="address-list">
            <h3>Địa chỉ của tôi</h3>

            {/* EMPTY */}
            {!profile.addresses?.length && (
                <div className="empty">
                    Chưa có địa chỉ nào
                </div>
            )}

            {/* LIST */}
            {profile.addresses?.map(addr => (
                <div key={addr.id} className="address-item">
                    <div className="address-info">
                        <p>
                            {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                        </p>
                    </div>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(addr.id)}
                    >
                        Xóa
                    </button>
                </div>
            ))}

            {/* ADD */}
            <div className="address-add">
                <input
                    name="street"
                    placeholder="Số nhà, tên đường"
                    value={newAddress.street}
                    onChange={handleChange}
                />

                <input
                    name="ward"
                    placeholder="Phường / Xã"
                    value={newAddress.ward}
                    onChange={handleChange}
                />

                <input
                    name="district"
                    placeholder="Quận / Huyện"
                    value={newAddress.district}
                    onChange={handleChange}
                />

                <input
                    name="city"
                    placeholder="Tỉnh / Thành phố"
                    value={newAddress.city}
                    onChange={handleChange}
                />

                <button onClick={handleAdd}>
                    + Thêm địa chỉ
                </button>
            </div>
        </div>
    );
}