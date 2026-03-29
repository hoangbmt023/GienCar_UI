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

const specKeys = [
    "price",
    "power",
    "acceleration",
    "topSpeed",
    "fuel",
    "co2",
    "height",
    "width",
    "length",
    "wheelbase",
];

const CarCompare = ({ selectedCars = [], removeCar, scrollToList }) => {
    const maxCompare = 3;
    const emptySlots = maxCompare - selectedCars.length;

    return (
        <div className="car-compare mb-6">
            {selectedCars.length === 0 && (
                <p className="mt-2 mb-2 font-semibold">
                    Chọn tối đa 3 dòng xe để so sánh:
                </p>
            )}

            <div className="car-compare__grid">
                {/* Cột thông số */}
                <div className="car-compare__specs">
                    {defaultSpecs.map((spec, idx) => (
                        <div key={idx}>{spec}</div>
                    ))}
                </div>

                {/* Xe + slot trống */}
                {[...selectedCars, ...Array(emptySlots)].map((car, idx) => (
                    <div key={idx} className="car-compare__slot">
                        {car ? (
                            <>
                                {/* Remove */}
                                <div
                                    className="car-compare__btn-remove"
                                    onClick={() => removeCar(idx)}
                                >
                                    ×
                                </div>

                                {/* Image */}
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="car-compare__car-img"
                                />

                                {/* Name */}
                                <h3 className="car-compare__car-name">
                                    {car.name}
                                </h3>

                                {/* Specs */}
                                <div className="car-compare__car-specs">
                                    {specKeys.map((key, i) => (
                                        <div key={i} data-label={defaultSpecs[i]}>
                                            {car[key] || "-"}
                                        </div>
                                    ))}
                                </div>

                                {/* Button */}
                                <button className="car-compare__btn-explore">
                                    Khám phá
                                </button>
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