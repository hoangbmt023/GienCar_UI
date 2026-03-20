import HeroImage from "../components/HeroImage/HeroImage";
import testImage from "../assets/images/testimage.jpg";
import CarSuggest from "../components/CarSuggest/CarSuggest";
import car1 from "../assets/images/car1.jpg";
import car2 from "../assets/images/car2.jpg";
import car3 from "../assets/images/car3.jpg";
import car4 from "../assets/images/car4.jpg";
import car5 from "../assets/images/car5.jpg";
import car6 from "../assets/images/car6.jpg";

export default function CarDetail() {
    const cars = [
        { id: 0, name: "Test Car", image: testImage },
        { id: 1, name: "Toyota Camry", image: car1 },
        { id: 2, name: "Honda Civic", image: car2 },
        { id: 3, name: "BMW X5", image: car3 },
        { id: 4, name: "Audi A4", image: car4 },
        { id: 5, name: "Mercedes GLE", image: car5 },
        { id: 6, name: "Porsche 911", image: car6 }
    ];

    return (
        <div>
            <HeroImage car={cars[0]} />
            <CarSuggest cars={cars} />
        </div>
    )
}