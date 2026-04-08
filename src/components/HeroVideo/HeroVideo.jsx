import { useState, useEffect, useRef } from "react";
import { homeService } from "@/services/homeService";
import "./HeroVideo.scss";

function HeroVideo() {

    const [videos, setVideos] = useState([]);
    const [current, setCurrent] = useState(0);
    const [activeVideo, setActiveVideo] = useState(0); // 0 hoặc 1

    const videoRef1 = useRef(null);
    const videoRef2 = useRef(null);

    // ================= API =================
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await homeService.getBanners("HERO_CAR");

                const banners = res.data.data
                    .sort((a, b) => a.order - b.order)
                    .map(item => ({
                        id: item.id,
                        // tối ưu cloudinary luôn
                        src: item.videoUrl.replace("/upload/", "/upload/q_auto,f_auto,vc_auto/"),
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

    // ================= PRELOAD =================
    useEffect(() => {
        if (!videos.length) return;

        videos.forEach(v => {
            const vid = document.createElement("video");
            vid.src = v.src;
            vid.preload = "auto";
        });
    }, [videos]);

    // ================= AUTO SLIDE =================
    useEffect(() => {
        if (!videos.length) return;

        const timer = setTimeout(() => {
            changeVideo((current + 1) % videos.length);
        }, 8000);

        return () => clearTimeout(timer);

    }, [current, videos]);

    // ================= CHANGE VIDEO =================
    const changeVideo = (index) => {
        if (index === current) return;

        const nextVideo =
            activeVideo === 0 ? videoRef2.current : videoRef1.current;

        if (nextVideo) {
            nextVideo.src = videos[index].src;

            nextVideo.onloadeddata = () => {
                nextVideo.currentTime = 0;
                nextVideo.play().catch(() => { });
            };
        }

        setCurrent(index);
        setActiveVideo(prev => (prev === 0 ? 1 : 0));
    };

    // ================= INIT FIRST VIDEO =================
    useEffect(() => {
        if (!videos.length) return;

        if (videoRef1.current) {
            videoRef1.current.src = videos[0].src;
            videoRef1.current.play();
        }
    }, [videos]);

    if (!videos.length) return null;

    return (
        <section className="hero-video">

            {/* VIDEO 1 */}
            <video
                ref={videoRef1}
                autoPlay
                muted
                playsInline
                preload="auto"
                className={`hero-video__media ${activeVideo === 0 ? "active" : "prev"}`}
            />

            {/* VIDEO 2 */}
            <video
                ref={videoRef2}
                autoPlay
                muted
                playsInline
                preload="auto"
                className={`hero-video__media ${activeVideo === 1 ? "active" : "prev"}`}
            />

            {/* TEXT */}
            <div className="hero-video__content">
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