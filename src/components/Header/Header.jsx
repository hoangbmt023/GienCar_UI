import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Header_Menu } from "./HeaderMenu"; // QUAN TRỌNG
import "./Header.scss";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeItem, setActiveItem] = useState(0);

  const menu = Header_Menu?.[activeMenu];

  return (
    <header
  className={`header ${activeMenu !== null ? "header-open" : ""}`}
>

      {/* TOP NAV */}
      <div className="header-nav">
        {Header_Menu.map((menu, i) => (
          <div
            key={i}
            onMouseEnter={() => {
              setActiveMenu(i);
              setActiveItem(0);
            }}
            className="nav-item"
          >
            {menu.label}
          </div>
        ))}
      </div>

      {/* MEGA MENU */}
      {menu && (
        <div
          className="mega-menu"
          onMouseLeave={() => setActiveMenu(null)}
        >

          {/* PANEL 1 */}
          <motion.div
            initial={{ x: -160 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.35 }}
            className="panel-1"
          />

          {/* PANEL 2 */}
          <motion.div
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.45 }}
            className="panel-2"
          >

            {menu.children?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                onMouseEnter={() => setActiveItem(index)}
                className={`panel2-item ${
                  activeItem === index ? "active" : ""
                }`}
              >
                {item.label}
              </motion.div>
            ))}

          </motion.div>

          {/* PANEL 3 */}
          <motion.div
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.25,
            }}
            className="panel-3"
          >

            <motion.div
              key={activeItem}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.55,
              }}
              className="panel3-list"
            >

              {menu.children?.[activeItem]?.children?.map((sub, i) => (
                <NavLink
                  key={i}
                  to={`/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                  className="panel3-item"
                >
                  {sub}
                </NavLink>
              ))}

            </motion.div>

          </motion.div>

          {/* IMAGE */}
          <div
            className="panel-fill"
            onMouseEnter={() => setActiveMenu(null)}
            style={{
              backgroundImage: `url(${menu.image})`,
            }}
          />

        </div>
      )}
    </header>
  );
}