import { useState } from "react";
import { motion } from "framer-motion";

const Header_Menu = [

    {
        label: "Racing",
        children: [
            {
                label: "Formula 1",
                children: [
                    "Home",
                    "SF-26",
                    "Team",
                    "News",
                    "Races",
                    "Partners",
                    "Hospitality",
                    "Media Galleries",
                    "History",
                ],
            },
            { label: "Endurance", children: ["Overview", "Cars", "Drivers"] },
            { label: "Hypersail", children: ["Overview"] },
            { label: "Esports", children: ["Overview", "Drivers"] },
            { label: "Driver Academy", children: ["Overview"] },
        ],
    },

    {
        label: "Sports Cars",
        children: [
            {
                label: "Models",
                children: [
                    "SF90 Stradale",
                    "296 GTB",
                    "Roma",
                    "812 Competizione",
                    "Daytona SP3",
                ],
            },
            {
                label: "Configuration",
                children: [
                    "Car Configurator",
                    "Build Your Ferrari",
                ],
            },
            {
                label: "Ownership",
                children: [
                    "Services",
                    "Maintenance",
                    "Warranty",
                ],
            },
        ],
    },

    {
        label: "Collections",
        children: [
            {
                label: "Clothing",
                children: [
                    "Men",
                    "Women",
                    "Kids",
                ],
            },
            {
                label: "Accessories",
                children: [
                    "Caps",
                    "Bags",
                    "Shoes",
                    "Watches",
                ],
            },
            {
                label: "Limited",
                children: [
                    "Special Editions",
                    "Collaborations",
                ],
            },
        ],
    },

    {
        label: "Experiences",
        children: [
            {
                label: "Driving",
                children: [
                    "Driving Experience",
                    "Corso Pilota",
                ],
            },
            {
                label: "Museums",
                children: [
                    "Maranello Museum",
                    "Modena Museum",
                ],
            },
            {
                label: "Events",
                children: [
                    "Ferrari Events",
                    "Track Days",
                ],
            },
        ],
    },

    {
        label: "About Us",
        children: [
            {
                label: "Company",
                children: [
                    "History",
                    "Brand",
                    "Innovation",
                ],
            },
            {
                label: "Careers",
                children: [
                    "Jobs",
                    "Internships",
                ],
            },
            {
                label: "Media",
                children: [
                    "Press",
                    "Newsroom",
                ],
            },
        ],
    },

];

export default function Header() {

    const [activeMenu, setActiveMenu] = useState(null);
    const [activeItem, setActiveItem] = useState(0);

    const menu = Header_Menu?.[activeMenu];

    return (
        <header className="bg-black text-white">

            {/* TOP NAV */}

            <div
                className="h-16 flex items-center px-12 gap-12 uppercase tracking-widest"
                onMouseLeave={() => setActiveMenu(null)}
            >
                {Header_Menu.map((menu, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => {
                            setActiveMenu(i);
                            setActiveItem(0);
                        }}
                        className="cursor-pointer"
                    >
                        {menu.label}
                    </div>
                ))}
            </div>

            {/* {/*
            <div className="h-16 flex items-center px-12 uppercase tracking-widest">

                <div className="flex gap-12">
                    {Header_Menu.map((menu, i) => (
                        <div key={i} className="cursor-pointer">
                            {menu.label}
                        </div>
                    ))}
                </div>

                <GlobalSearch />

                <div className="ml-auto">
                    <AvatarHeader />
                </div>

            </div>
            */}

            {menu && (

                <div className="fixed inset-0 top-16 flex bg-black overflow-hidden">

                    {/* PANEL 1 */}

                    <motion.div
                        initial={{ x: -160 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="w-[90px]"
                        style={{ background: "#111" }}
                    />



                    {/* PANEL 2 */}

                    <motion.div
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.45 }}
                        className="w-[300px] pt-14 pl-16"
                        style={{
                            background:
                                "linear-gradient(90deg,#121212 0%,#0f0f0f 60%,#0b0b0b 100%)"
                        }}
                    >

                        <div className="flex flex-col gap-4 text-[20px] text-gray-400">

                            {menu.children.map((item, index) => (

                                <motion.div
                                    key={index}
                                    initial={{ y: 60, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                    onMouseEnter={() => setActiveItem(index)}
                                    className={`cursor-pointer ${activeItem === index ? "text-white" : ""
                                        }`}
                                >
                                    {item.label}
                                </motion.div>

                            ))}

                        </div>

                    </motion.div>



                    {/* PANEL 3 */}

                    <motion.div
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: 0.25
                        }}
                        className="w-[300px] pt-14 pl-16"
                        style={{
                            background:
                                "linear-gradient(90deg,#111 0%,#0d0d0d 60%,#090909 100%)"
                        }}
                    >

                        <motion.div
                            key={activeItem}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                duration: 0.35,
                                delay: 0.55
                            }}
                            className="flex flex-col gap-3 text-[17px] text-gray-300"
                        >

                            {menu.children[activeItem].children.map((sub, i) => (
                                <div key={i} className="hover:text-white cursor-pointer">
                                    {sub}
                                </div>
                            ))}

                        </motion.div>

                    </motion.div>



                    {/* BLACK AREA */}

                    <div className="flex-1 bg-black"></div>

                </div>

            )}

        </header>
    );
}