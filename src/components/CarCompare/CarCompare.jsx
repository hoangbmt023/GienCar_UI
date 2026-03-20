import { useState } from "react";
import "./CarCompare.scss";

const defaultSpecs = [
    "Giá",
    "Công suất",
    "Tăng tốc 0–100 km/h",
    "Tốc độ tối đa",
    "Tiêu thụ nhiên liệu kết hợp",
    "Lượng khí thải CO2",
    "Cao",
    "Rộng",
    "Dài",
    "Chiều dài cơ sở",
];

const CarCompare = ({ selectedCars = [], removeCar, scrollToList }) => {
    const maxCompare = 3;
    const emptySlots = maxCompare - selectedCars.length;

    return (
        <div className="car-compare mb-6">
            {selectedCars.length === 0 && (
                <p className="mb-2 font-semibold">
                    Chọn tối đa 3 dòng xe để so sánh:
                </p>
            )}

            <div className="car-compare__grid">
                {/* Cột A */}
                <div className="car-compare__specs">
                    {defaultSpecs.map((spec, idx) => (
                        <div key={idx}>{spec}</div>
                    ))}
                </div>

                {/* Xe đã chọn + slot trống */}
                {[...selectedCars, ...Array(emptySlots)].map((car, idx) => (
                    <div key={idx} className="car-compare__slot">
                        {car ? (
                            <>
                                <div
                                    className="car-compare__btn-remove"
                                    onClick={() => removeCar(idx)}
                                >
                                    ×
                                </div>
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="car-compare__car-img"
                                />
                                <h3 className="car-compare__car-name">{car.name}</h3>
                                <div className="car-compare__car-specs">
                                    <div>{car.price}</div>
                                    <div>{car.power || "257 kW (350 mã lực)"}</div>
                                    <div>{car.acceleration || "4,4 giây"}</div>
                                    <div>{car.topSpeed || "285 km/h"}</div>
                                    <div>{car.fuel || "10 l/100km"}</div>
                                    <div>{car.co2 || "235 g/km"}</div>
                                    <div>{car.height || "1.295 mm"}</div>
                                    <div>{car.width || "1.801 mm"}</div>
                                    <div>{car.length || "4.379 mm"}</div>
                                    <div>{car.wheelbase || "2.475 mm"}</div>
                                </div>
                                <button className="car-compare__btn-explore">Khám phá</button>
                            </>
                        ) : (
                            <button
                                className="car-compare__empty-slot"
                                onClick={scrollToList}
                            >
                                + Chọn dòng xe
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarCompare;