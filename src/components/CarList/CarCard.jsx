import "./CarCard.scss";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, onCompare }) => {
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate(`/models/${car.slug}`, {
            state: { car }
        });
    };

    return (
        <div className="car-card">
            <div className="car-card__image">
                <img src={car.image} alt={car.name} />
            </div>

            <div className="car-card__content">
                <h3 className="car-card__title">{car.name}</h3>
                <p className="car-card__price">{car.price}</p>

                <div className="car-card__actions">
                    <button
                        className="car-card__btn-primary"
                        onClick={handleExplore}
                    >
                        Khám phá
                    </button>

                    <button
                        className="car-card__btn-secondary"
                        onClick={() => onCompare(car)}
                    >
                        So sánh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCard;