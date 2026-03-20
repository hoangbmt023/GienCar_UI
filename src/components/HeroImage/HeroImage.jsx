import "./HeroImage.scss";

const HeroImage = ({ car }) => {
    return (
        <div className="hero-image">
            <img src={car.image} alt={car.name} className="hero-image__img" />
            <div className="hero-image__overlay">
                <div className="hero-image__info">
                    <h1 className="hero-image__title">{car.name}</h1>
                    <p className="hero-image__price">{car.price}</p>

                    <div className="hero-image__specs">
                        <span>350 PS (257 kW)</span>
                        <span>4,4 giây (4,2 giây với Gói Sport Chrono)</span>
                        <span>285 km/h</span>
                    </div>

                    <div className="hero-image__labels">
                        <span>Giá tiêu chuẩn</span>
                        <span>Công suất</span>
                        <span>Tăng tốc từ 0–100 km/h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroImage;