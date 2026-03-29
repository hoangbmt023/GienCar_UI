import "./CarCard.scss";

const CarCard = ({ car, onCompare }) => {
    return (
        <div className="car-card">
            <div className="car-card__image">
                <img src={car.image} alt={car.name} />
            </div>

            <div className="car-card__content">
                <h3 className="car-card__title">{car.name}</h3>
                <p className="car-card__price">{car.price}</p>

                <div className="car-card__actions">
                    <button className="car-card__btn-primary">
                        Khám phá
                    </button>
                    <button className="car-card__btn-secondary" onClick={() => onCompare(car)}>
                        So sánh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCard;