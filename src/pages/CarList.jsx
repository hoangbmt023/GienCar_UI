import { useState } from "react";
import CarCompare from "../components/CarCompare/CarCompare";
import CarList from "../components/CarList/CarList";

const CarListPage = () => {
    const [selectedCars, setSelectedCars] = useState([]);

    const carCategories = [
        {
            id: 1,
            name: "Sedan",
            cars: [
                { id: 1, name: "Toyota Camry", price: "1 tỷ", image: "https://source.unsplash.com/400x300/?car&sig=1" },
                { id: 2, name: "Honda Civic", price: "800 triệu", image: "https://source.unsplash.com/400x300/?car&sig=2" },
                { id: 3, name: "Mazda 3", price: "750 triệu", image: "https://source.unsplash.com/400x300/?car&sig=3" },
                { id: 4, name: "Hyundai Elantra", price: "720 triệu", image: "https://source.unsplash.com/400x300/?car&sig=4" },
                { id: 5, name: "Kia K3", price: "690 triệu", image: "https://source.unsplash.com/400x300/?car&sig=5" },
            ],
        },
        {
            id: 2,
            name: "SUV",
            cars: [
                { id: 6, name: "Toyota Corolla Cross", price: "860 triệu", image: "https://source.unsplash.com/400x300/?car&sig=6" },
                { id: 7, name: "Ford Ranger", price: "950 triệu", image: "https://source.unsplash.com/400x300/?car&sig=7" },
                { id: 8, name: "VinFast VF 8", price: "1 tỷ 100 triệu", image: "https://source.unsplash.com/400x300/?car&sig=8" },
            ],
        },
        {
            id: 3,
            name: "Electric",
            cars: [
                { id: 9, name: "Tesla Model 3", price: "1 tỷ 400 triệu", image: "https://source.unsplash.com/400x300/?car&sig=9" },
                { id: 10, name: "VinFast VF 9", price: "1 tỷ 800 triệu", image: "https://source.unsplash.com/400x300/?car&sig=10" },
            ],
        },
    ];

    const handleCompare = (car) => {
        if (selectedCars.length >= 3) return;
        if (!selectedCars.find((c) => c.id === car.id)) {
            setSelectedCars([...selectedCars, car]);
        }
    };

    const removeCar = (idx) => {
        const newCars = [...selectedCars];
        newCars.splice(idx, 1);
        setSelectedCars(newCars);
    };

    const scrollToList = () => {
        const el = document.getElementById("car-list-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-1 max-w-[1300px] mx-auto">
            <CarCompare
                selectedCars={selectedCars}
                removeCar={removeCar}
                scrollToList={scrollToList}
            />
            <h1 className="text-2xl font-bold mb-6">Danh sách xe</h1>
            <CarList categories={carCategories} onCompare={handleCompare} />
        </div>
    );
};

export default CarListPage;