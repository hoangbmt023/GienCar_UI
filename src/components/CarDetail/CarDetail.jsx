import React from "react";
import CarDetailHeader from "./CarDetailHeader";
import CarDetailSpecs from "./CarDetailSpecs";
import "./CarDetail.scss";

const CarDetail = ({ car }) => {
    return (
        <div className="car-detail">
            <CarDetailHeader car={car} />
            <CarDetailSpecs car={car} />
        </div>
    );
};

export default CarDetail;