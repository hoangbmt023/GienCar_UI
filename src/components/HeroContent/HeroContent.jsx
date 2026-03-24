import { useState, useEffect } from "react";
import heroImage1 from "../../assets/images/hero-image1.jpg";
import heroImage2 from "../../assets/images/hero-image2.jpg";
import heroImage3 from "../../assets/images/hero-image3.jpg";
import "./HeroContent.scss";

function HeroContent() {

    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);

    const images = [
        {
            src: heroImage1,
            title: "Premium Products",
            description:
                "Discover our latest collection designed with modern aesthetics and premium quality.",
        },
        {
            src: heroImage2,
            title: "Innovative Design",
            description:
                "Crafted with cutting-edge technology and timeless design for everyday excellence.",
        },
        {
            src: heroImage3,
            title: "Elevated Lifestyle",
            description:
                "Experience products that combine performance, elegance, and durability.",
        },
    ];

    useEffect(() => {

        const timer = setTimeout(() => {

            setPrev(current);
            setCurrent((prevIndex) => (prevIndex + 1) % images.length);

        }, 8000);

        return () => clearTimeout(timer);

    }, [current]);

    const changeImage = (index) => {

        if (index === current) return;

        setPrev(current);
        setCurrent(index);

    };

    return (
        <section className="hero-content">

            {/* LEFT TEXT */}
            <div key={current} className="hero-content__text">

                <h1 className="hero-content__title">
                    {images[current].title}
                </h1>

                <p className="hero-content__description">
                    {images[current].description}
                </p>

                <a
                    href={images[current].link?.url || "#"} // thêm link trong dữ liệu
                    className="hero-content__link"
                >
                    {images[current].link?.label || "Read More"}
                </a>

            </div>

            {/* RIGHT IMAGE SLIDER */}
            <div className="hero-content__image">

                {/* IMAGE CURRENT */}
                <img
                    key={current}
                    src={images[current].src}
                    className="hero-content__media active"
                    alt={images[current].label}
                />

                {/* IMAGE PREVIOUS */}
                {prev !== null && (
                    <img
                        key={prev}
                        src={images[prev].src}
                        className="hero-content__media prev"
                        alt={images[prev].label}
                    />
                )}

            </div>

            {/* DOTS */}
            <div className="hero-content__dots">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === current ? "active" : ""}`}
                        onClick={() => changeImage(index)}
                    >
                        <svg className="dot-svg" viewBox="0 0 36 36">

                            <circle
                                className="dot-bg"
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                            />

                            <circle
                                className="dot-progress"
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                            />

                        </svg>
                    </div>
                ))}
            </div>

        </section>
    );
}

export default HeroContent;