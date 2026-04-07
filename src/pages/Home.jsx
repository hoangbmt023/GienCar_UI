import { useEffect, useState } from "react";

import "../components/Authenticator/Home.scss";
import HeroVideo from "../components/HeroVideo/HeroVideo";
import HeroContent from "../components/HeroContent/HeroContent";
import HeroGrid from "../components/HeroGrid/HeroGrid";
import SplashScreen from "../components/SplashScreen/SplashScreen";
import ChatBoxContainer from "@/components/ChatBox/ChatBoxContainer";
// import LogoutButton from "../components/Commons/LogoutButton/LogoutButton";

export default function Home() {
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
=======
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // thời gian splash (khớp animation)
>>>>>>> f74db32 (fix: Implement service chatSocket and ui chatbox (#15))

    return () => clearTimeout(timer);
  }, []);

<<<<<<< HEAD
    // Nếu đang loading thì chỉ hiện logo
    if (loading) {
        return <SplashScreen />;
    }

    // Sau khi splash xong thì render Home
    return (
        <main className="home">
            <HeroVideo />
=======
  // 👉 Nếu đang loading thì chỉ hiện logo
  if (loading) {
    return <SplashScreen />;
  }

  // 👉 Sau khi splash xong thì render Home
  return (
    <main className="home">
      <HeroVideo />
>>>>>>> f74db32 (fix: Implement service chatSocket and ui chatbox (#15))

      {/* <LogoutButton /> */}

<<<<<<< HEAD
            <HeroContent />
            <HeroGrid />

            {/* ChatBoxContainer - Quản lý Chat + FloatingButton */}
            <ChatBoxContainer />
        </main>
    );
=======
      <HeroContent />
      <HeroGrid />

      {/* ChatBoxContainer - Quản lý Chat + FloatingButton */}
      <ChatBoxContainer />
    </main>
  );
>>>>>>> f74db32 (fix: Implement service chatSocket and ui chatbox (#15))
}
