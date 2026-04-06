import { useState, useEffect } from "react";
import { homeService } from "@/services/homeService";
import "./HeroContent.scss";

function HeroContent() {

    const [images, setImages] = useState([]);
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);

    // gọi API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await homeService.getBanners("CONTENT_CAR");

                const banners = res.data.data
                    .sort((a, b) => a.order - b.order)
                    .map(item => ({
                        id: item.id,
                        src: item.imageUrl,
                        title: item.title,
                        description: item.description,
                        link: {
                            label: item.ctaText,
                            url: item.ctaLink
                        }
                    }));

                setImages(banners);

            } catch (error) {
                console.error("Lỗi lấy content banner:", error);
            }
        };

        fetchBanners();
    }, []);

    // auto slide
    useEffect(() => {

        if (!images.length) return;

        const timer = setTimeout(() => {
            setPrev(current);
            setCurrent((prevIndex) => (prevIndex + 1) % images.length);
        }, 8000);

        return () => clearTimeout(timer);

    }, [current, images]);

    const changeImage = (index) => {
        if (index === current) return;
        setPrev(current);
        setCurrent(index);
    };

    if (!images.length) return null;

    return (
        <section className="hero-content">

            {/* TEXT */}
            <div key={`content-${images[current].id}`} className="hero-content__text">

                <h1 className="hero-content__title">
                    {images[current].title}
                </h1>

                <p className="hero-content__description">
                    {images[current].description}
                </p>

                <a
                    href={images[current].link?.url}
                    className="hero-content__link"
                >
                    {images[current].link?.label}
                </a>

            </div>

            {/* IMAGE */}
            <div className="hero-content__image">

                {/* CURRENT */}
                <img
                    key={images[current].id}
                    src={images[current].src}
                    className="hero-content__media active"
                    alt={images[current].title}
                />

                {/* PREV */}
                {prev !== null && images[prev] && (
                    <img
                        key={`prev-${images[prev].id}`}
                        src={images[prev].src}
                        className="hero-content__media prev"
                        alt={images[prev].title}
                    />
                )}

            </div>

            {/* DOTS */}
            <div className="hero-content__dots">
                {images.map((item, index) => (
                    <div
                        key={item.id}
                        className={`dot ${index === current ? "active" : ""}`}
                        onClick={() => changeImage(index)}
                    >
                        <svg className="dot-svg" viewBox="0 0 36 36">
                            <circle className="dot-bg" cx="18" cy="18" r="16" fill="none" />
                            <circle className="dot-progress" cx="18" cy="18" r="16" fill="none" />
                        </svg>
                    </div>
                ))}
            </div>

        </section>
    );
}

export default HeroContent;