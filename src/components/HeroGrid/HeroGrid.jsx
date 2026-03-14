import { useEffect } from "react";
import car1 from "../../assets/images/car1.jpg";
import car2 from "../../assets/images/car2.jpg";
import car3 from "../../assets/images/car3.jpg";
import car4 from "../../assets/images/car4.jpg";
import car5 from "../../assets/images/car5.jpg";
import car6 from "../../assets/images/car6.jpg";
import "./HeroGrid.scss";

function HeroGrid() {

    const items = [
        {
            img: car1,
            title: "Racing",
            content: "TRACK PERFORMANCE",
            link: { label: "Discover", url: "/racing" }
        },
        {
            img: car2,
            title: "Sports Cars",
            content: "PURE DRIVING EXPERIENCE",
            link: { label: "Discover", url: "/sports" }
        },
        {
            img: car3,
            title: "Collections",
            content: "NEW ARRIVALS",
            link: { label: "Discover", url: "/collections" }
        },
        {
            img: car4,
            title: "Technology",
            content: "INNOVATION & POWER",
            link: { label: "Discover", url: "/technology" }
        },
        {
            img: car5,
            title: "Lifestyle",
            content: "ELEVATE YOUR STYLE",
            link: { label: "Discover", url: "/lifestyle" }
        },
        {
            img: car6,
            title: "Heritage",
            content: "LEGACY OF SPEED",
            link: { label: "Discover", url: "/heritage" }
        }
    ];

    useEffect(() => {

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

    }, []);

    return (
        <section className="product-grid">

            {items.map((item, index) => (
                <div className="product-item" key={index}>

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