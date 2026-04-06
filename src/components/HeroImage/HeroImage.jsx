import "./HeroImage.scss";

const HeroImage = ({ car }) => {
    return (
        <div className="hero-image">
            <img src={car.image} alt={car.name} className="hero-image__img" />
            <div className="hero-image__overlay">
                <div className="hero-image__info">
                    <h1 className="hero-image__title">{car.name}</h1>
                    <div className="hero-image__stats">
                        <div className="hero-image__stat">
                            <span className="hero-image__value">{car.price}</span>
                            <span className="hero-image__label">Giá tiêu chuẩn</span>
                        </div>
                        <div className="hero-image__stat">
                            <span className="hero-image__value">{car.power}</span>
                            <span className="hero-image__label">Công suất</span>
                        </div>
                        <div className="hero-image__stat">
                            <span className="hero-image__value">{car.acceleration}</span>
                            <span className="hero-image__label">Tăng tốc từ 0–100 km/h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroImage;