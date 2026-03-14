import { useState, useEffect } from "react";
import homeVideo1 from "../../assets/video/home-video1.mp4";
import homeVideo2 from "../../assets/video/home-video2.mp4";
import homeVideo3 from "../../assets/video/home-video3.mp4";
import "./HeroVideo.scss";

function HeroVideo() {

    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);

    const videos = [
        {
            src: homeVideo1,
            title: "Racing",
            content: "CONTENT A",
            link: {
                label: "Discover",
                url: "/racing"
            }
        },
        {
            src: homeVideo2,
            title: "Sports cars",
            content: "START YOUR ENGINE",
            link: {
                label: "Discover",
                url: "/sports"
            }
        },
        {
            src: homeVideo3,
            title: "Collections",
            content: "NEW ARRIVALS",
            link: {
                label: "Discover",
                url: "/collections"
            }
        }
    ];

    useEffect(() => {

        const timer = setTimeout(() => {

            setPrev(current);
            setCurrent((prevIndex) => (prevIndex + 1) % videos.length);

        }, 8000);

        return () => clearTimeout(timer);

    }, [current]);

    const changeVideo = (index) => {

        if (index === current) return;

        setPrev(current);
        setCurrent(index);

    };

    return (
        <section className="hero-video">

            {/* VIDEO CURRENT */}
            <video
                key={current}
                autoPlay
                muted
                playsInline
                className="hero-video__media active"
            >
                <source src={videos[current].src} type="video/mp4" />
            </video>

            {/* VIDEO PREVIOUS */}
            {prev !== null && (
                <video
                    key={prev}
                    autoPlay
                    muted
                    playsInline
                    className="hero-video__media prev"
                >
                    <source src={videos[prev].src} type="video/mp4" />
                </video>
            )}

            {/* TEXT CONTENT */}
            <div key={current} className="hero-video__content">
                <div key={current} className="text-slide active">

                    <h3 className="hero-video__title">
                        {videos[current].title}
                    </h3>

                    <h1 className="hero-video__text">
                        {videos[current].content}
                    </h1>

                    <a
                        href={videos[current].link.url}
                        className="hero-video__link"
                    >
                        {videos[current].link.label}
                    </a>
                </div>
            </div>

            {/* DOTS */}
            <div className="hero-video__dots">
                {videos.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === current ? "active" : ""}`}
                        onClick={() => changeVideo(index)}
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

export default HeroVideo;