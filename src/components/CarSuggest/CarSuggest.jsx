import { useRef, useState, useEffect } from "react";
import "./CarSuggest.scss";

const CarSuggest = ({ cars = [] }) => {
    const listRef = useRef();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const checkScroll = () => {
        if (!listRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
        setCanScrollPrev(scrollLeft > 0);
        setCanScrollNext(scrollLeft + clientWidth < scrollWidth);
    };

    const handlePrev = () => {
        if (listRef.current) {
            listRef.current.scrollBy({
                left: -listRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    const handleNext = () => {
        if (listRef.current) {
            listRef.current.scrollBy({
                left: listRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    // Kiểm tra scroll mỗi khi người dùng scroll
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll);
        checkScroll(); // check lần đầu
        return () => el.removeEventListener("scroll", checkScroll);
    }, []);

    return (
        <div className="car-suggest relative">
            <button
                className="car-suggest__arrow car-suggest__arrow--left"
                onClick={handlePrev}
                disabled={!canScrollPrev} // disable khi không thể scroll
            >
                &#8249;
            </button>

            <div className="car-suggest__list-wrapper" ref={listRef}>
                <div className="car-suggest__list">
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
                disabled={!canScrollNext}
            >
                &#8250;
            </button>
        </div>
    );
};

export default CarSuggest;