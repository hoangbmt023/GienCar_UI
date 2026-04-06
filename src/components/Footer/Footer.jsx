import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { menuService } from "@/services/menuService";
import env from "@/config/Config";
import "./FooterLayout.scss";

export default function Footer() {

  const [menus, setMenus] = useState([]);

  const BASE_URL = env.FE_URL;

  // 🔥 Transform dữ liệu từ backend
  const transformFooter = (data) => {
    if (!Array.isArray(data)) return [];

    return data
      .sort((a, b) => a.order - b.order) // sort theo order
      .map(menu => ({
        id: menu.id,
        label: menu.name,

        url: menu.url
          ? menu.url.startsWith("http")
            ? menu.url
            : `${BASE_URL}${menu.url}`
          : "#",

        target: menu.target?.[0] || "_self",

        children: (menu.children || [])
          .sort((a, b) => a.order - b.order)
          .map(child => ({
            id: child.id,
            label: child.name,

            url: child.url
              ? child.url.startsWith("http")
                ? child.url
                : `${BASE_URL}${child.url}`
              : "#",

            target: child.target?.[0] || "_self",
          }))
      }));
  };

  // 🔥 Call API
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await menuService.getMenus({
          type: "FOOTER",
          locale: "EN"
        });

        const rawData = res.data.data;

        setMenus(transformFooter(rawData));

      } catch (err) {
        console.error("Load footer lỗi:", err);
      }
    };

    fetchFooter();
  }, []);

  return (
    <footer className="footer">

      {/* 🔥 NEWSLETTER (giữ nguyên UI cũ) */}
      <div className="footer-news">
        <h2>Newsletter</h2>
        <p>
          Stay up to date with the latest news from the world of Ferrari.
        </p>

        <button className="subscribe-btn">
          SUBSCRIBE
        </button>
      </div>

      {/* 🔥 FOOTER MENU (dynamic từ API) */}
      <div className="footer-menu">

        {menus.map((menu) => {

          const isExternal = menu.target === "_blank";

          return (
            <div key={menu.id} className="footer-col">

              {/* TITLE */}
              {isExternal ? (
                <a href={menu.url} target="_blank" rel="noopener noreferrer">
                  <h4>{menu.label}</h4>
                </a>
              ) : (
                <NavLink to={menu.url}>
                  <h4>{menu.label}</h4>
                </NavLink>
              )}

              {/* CHILDREN */}
              <ul>
                {menu.children.map((child) => {

                  const isChildExternal = child.target === "_blank";

                  if (isChildExternal) {
                    return (
                      <li key={child.id}>
                        <a
                          href={child.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {child.label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={child.id}>
                      <NavLink to={child.url}>
                        {child.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

            </div>
          );
        })}

      </div>

    </footer>
  );
}