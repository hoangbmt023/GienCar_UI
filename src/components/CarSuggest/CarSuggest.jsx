import { useState } from "react";
import "./CarSuggest.scss";

const CarSuggest = ({ cars = [] }) => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 4; // số xe hiển thị cùng lúc
    const itemWidth = 800; // width cố định mỗi item
    const gap = 16; // px gap

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setStartIndex((prev) =>
            Math.min(prev + 1, cars.length - visibleCount)
        );
    };

    return (
        <div className="car-suggest">
            <button
                className="car-suggest__arrow car-suggest__arrow--left"
                onClick={handlePrev}
                disabled={startIndex === 0}
            >
                &#8249;
            </button>

            <div className="car-suggest__list-wrapper">
                <div
                    className="car-suggest__list"
                    style={{
                        transform: `translateX(-${startIndex * (itemWidth + gap)}px)`,
                    }}
                >
                    {cars.map((car) => (
                        <div key={car.id} className="car-suggest__item">
                            <div className="car-suggest__inner">
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="car-suggest__img"
                                />
                                <div className="car-suggest__overlay">
                                    <p className="car-suggest__name">{car.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="car-suggest__arrow car-suggest__arrow--right"
                onClick={handleNext}
                disabled={startIndex >= cars.length - visibleCount}
            >
                &#8250;
            </button>
        </div>
    );
};

export default CarSuggest;