import CarCard from "./CarCard";
import "./CarList.scss";

const CarList = ({ categories = [], onCompare }) => {
    if (!categories.length) return <p>Không có xe nào</p>;

    return (
        <div className="car-list-container">
            {categories.map((category) => (
                <div key={category.id} className="car-category">
                    {/* Tên danh mục */}
                    <h2 className="car-category__title">{category.name}</h2>

                    {/* Grid xe */}
                    <div className="car-list">
                        {category.cars.map((car) => (
                            <CarCard key={car.id} car={car} onCompare={onCompare} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarList;