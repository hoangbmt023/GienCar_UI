import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
// import Racing from '@/pages/Racing'
// import SportsCars from '@/pages/SportsCars'
// import Collections from '@/pages/Collections'
// import Experiences from '@/pages/Experiences'
// import AboutUs from '@/pages/AboutUs'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            {/* <Route path="/racing" element={<Racing />} />
            <Route path="/sports-cars" element={<SportsCars />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/about-us" element={<AboutUs />} /> */}
        </Routes>
    )
}
