import React from "react";
import "./CarDetailSpecs.scss";

const CarDetailSpecs = ({ car }) => {
    return (
        <div className="car-detail-specs">
            {/* Tiêu đề */}
            <h3 className="car-detail-specs__title">Thông số kỹ thuật</h3>

            {/* Content 2 cột */}
            <div className="car-detail-specs__content">
                {/* Bên trái: ảnh */}
                <div className="car-detail-specs__image">
                    <img src={car.image} alt={car.name} />
                </div>

                {/* Bên phải: thông số kỹ thuật */}
                <div className="car-detail-specs__info">

                    <div className="spec-row">
                        <span className="label">Công suất</span>
                        <span className="value">{car.power}</span>
                    </div>

                    <div className="spec-row">
                        <span className="label">Mô men xoắn cực đại</span>
                        <span className="value">{car.torque}</span>
                    </div>

                    <div className="spec-row">
                        <span className="label">Tăng tốc 0 - 100 km/h</span>
                        <span className="value">{car.acceleration}</span>
                    </div>

                    <div className="spec-row">
                        <span className="label">Tốc độ tối đa</span>
                        <span className="value">{car.topSpeed}</span>
                    </div>

                    <div className="spec-row">
                        <span className="label">Mức tiêu thụ kết hợp</span>
                        <span className="value">{car.fuel}</span>
                    </div>

                    <div className="spec-row">
                        <span className="label">Giá tiêu chuẩn</span>
                        <span className="value price">{car.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetailSpecs;