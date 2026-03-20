import React from "react";
import "./CarDetailHeader.scss";

const CarDetailHeader = ({ car }) => {
    return (
        <div className="car-detail-header">
            {/* Tên + Giá */}
            <h1 className="car-detail-header__name">{car.name}</h1>
            <p className="car-detail-header__price">Giá tiêu chuẩn {car.price}</p>
            <small className="car-detail-header__note">{car.note}</small>

            {/* Thông số nhanh: Power | Acceleration | TopSpeed */}
            <div className="car-detail-header__stats">
                <div className="car-detail-header__stat">
                    <p className="car-detail-header__value">{car.power}</p>
                    <p className="car-detail-header__label">Công suất</p>
                </div>
                <div className="car-detail-header__stat">
                    <p className="car-detail-header__value">{car.acceleration}</p>
                    <p className="car-detail-header__label">Tăng tốc 0-100 km/h</p>
                </div>
                <div className="car-detail-header__stat">
                    <p className="car-detail-header__value">{car.topSpeed}</p>
                    <p className="car-detail-header__label">Tốc độ tối đa</p>
                </div>
            </div>
        </div>
    );
};

export default CarDetailHeader;