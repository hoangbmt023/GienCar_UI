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
    const cars = [...selectedCars, ...Array(emptySlots)];

    return (
        <div className="car-compare mb-6">

            {selectedCars.length === 0 ? (
                <div className="car-compare__compact">
                    <p className="font-semibold mb-2">
                        Chọn tối đa 3 dòng xe để so sánh:
                    </p>

                    <div className="car-compare__compact-list">
                        {Array(maxCompare).fill(0).map((_, idx) => (
                            <button
                                key={idx}
                                className="car-compare__compact-item"
                                onClick={scrollToList}
                            >
                                + Chọn dòng xe
                            </button>
                        ))}
                    </div>
                </div>
            ) : (

                <div className="car-compare__table">

                    {/* HEADER */}
                    <div></div>
                    {cars.map((car, idx) => (
                        <div key={idx} className="car-compare__header">
                            {car ? (
                                <>
                                    <div
                                        className="car-compare__btn-remove"
                                        onClick={() => removeCar(idx)}
                                    >
                                        ×
                                    </div>

                                    <img src={car.image} alt={car.name} />
                                    <h3>{car.name}</h3>
                                </>
                            ) : (
                                <button
                                    className="car-compare__empty-slot"
                                    onClick={scrollToList}
                                >
                                    + Chọn xe
                                </button>
                            )}
                        </div>
                    ))}

                    {/* SPEC ROWS */}
                    {specKeys.map((key, i) => (
                        <>
                            <div key={`label-${i}`} className="car-compare__label">
                                {defaultSpecs[i]}
                            </div>

                            {cars.map((car, idx) => (
                                <div
                                    key={`${key}-${idx}`}
                                    className="car-compare__value"
                                >
                                    {car ? (car[key] ?? "-") : "-"}
                                </div>
                            ))}
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarCompare;