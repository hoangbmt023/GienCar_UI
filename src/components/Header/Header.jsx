import { Header_Menu } from './HeaderMenu'
import { NavLink } from 'react-router-dom'
import Logo from '@/components/Commons/Logo/Logo'

export default function Header() {
    return (
        <header className="w-full h-16 bg-white border-b">
            <div className="mx-auto max-w-7xl h-full px-8 flex items-center gap-12">

                {/* Logo */}
                <NavLink to="/home" className="flex items-center">
                    <Logo size="sm" />
                </NavLink>

                {/* Navigation */}
                <nav className="flex items-center gap-10 uppercase text-sm tracking-widest">
                    {Header_Menu.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `font-medium transition${isActive ? 'text-black' : 'text-slate-600 hover:text-black'}`}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

            </div>
        </header>
    )
}