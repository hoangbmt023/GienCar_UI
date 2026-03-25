import { useState, useEffect } from "react";
import { homeService } from "@/services/homeService";
import "./HeroVideo.scss";

function HeroVideo() {

    const [videos, setVideos] = useState([]);
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);

    // gọi API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await homeService.getBanners("HERO_CAR");

                const banners = res.data.data
                    .sort((a, b) => a.order - b.order)
                    .map(item => ({
                        id: item.id,
                        src: item.videoUrl,
                        title: item.title,
                        content: item.description,
                        link: {
                            label: item.ctaText,
                            url: item.ctaLink
                        }
                    }));

                setVideos(banners);

            } catch (error) {
                console.error("Lỗi lấy banner:", error);
            }
        };

        fetchBanners();
    }, []);

    // auto slide
    useEffect(() => {

        if (!videos.length) return;

        const timer = setTimeout(() => {
            setPrev(current);
            setCurrent((prevIndex) => (prevIndex + 1) % videos.length);
        }, 8000);

        return () => clearTimeout(timer);

    }, [current, videos]);

    const changeVideo = (index) => {
        if (index === current) return;
        setPrev(current);
        setCurrent(index);
    };

    // loading
    if (!videos.length) return null;

    return (
        <section className="hero-video">

            {/* VIDEO CURRENT */}
            <video
                key={videos[current].id}
                autoPlay
                muted
                playsInline
                className="hero-video__media active"
            >
                <source src={videos[current].src} type="video/mp4" />
            </video>

            {/* VIDEO PREVIOUS */}
            {prev !== null && videos[prev] && (
                <video
                    key={`prev-${videos[prev].id}`}
                    autoPlay
                    muted
                    playsInline
                    className="hero-video__media prev"
                >
                    <source src={videos[prev].src} type="video/mp4" />
                </video>
            )}

            {/* TEXT */}
            <div key={`content-${videos[current].id}`} className="hero-video__content">
                <div className="text-slide active">

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
                {videos.map((item, index) => (
                    <div
                        key={item.id}
                        className={`dot ${index === current ? "active" : ""}`}
                        onClick={() => changeVideo(index)}
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

export default HeroVideo;