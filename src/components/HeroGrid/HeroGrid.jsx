import { useEffect, useState } from "react";
import { homeService } from "@/services/homeService";
import "./HeroGrid.scss";

function HeroGrid() {

    const [items, setItems] = useState([]);

    // gọi API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await homeService.getBanners("FEATURED_CAR");

                const banners = res.data.data
                    .sort((a, b) => a.order - b.order)
                    .map(item => ({
                        id: item.id,
                        img: item.imageUrl,
                        title: item.title,
                        content: item.description,
                        link: {
                            label: item.ctaText,
                            url: item.ctaLink
                        }
                    }));

                setItems(banners);

            } catch (error) {
                console.error("Lỗi lấy featured banner:", error);
            }
        };

        fetchBanners();
    }, []);

    // animation scroll
    useEffect(() => {

        if (!items.length) return;

        const elements = document.querySelectorAll(".product-item");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();

    }, [items]);

    if (!items.length) return null;

    return (
        <section className="product-grid">

            {items.map((item) => (
                <div className="product-item" key={item.id}>

                    <img
                        src={item.img}
                        alt={item.title}
                        className="product-item__image"
                    />

                    <div className="product-item__content">

                        <div className="product-item__title">
                            {item.title}
                        </div>

                        <div className="product-item__text">
                            {item.content}
                        </div>

                        <a
                            href={item.link.url}
                            className="product-item__link"
                        >
                            {item.link.label}
                        </a>

                    </div>

                </div>
            ))}

        </section>
    );
}

export default HeroGrid;