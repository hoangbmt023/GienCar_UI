import logo from '@/assets/logo/logo_nobackground.png'

export default function Logo({ size = 'md' }) {
    const sizes = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-14',
    }

    return (
        <img
            src={logo}
            alt="GienCar"
            className={`${sizes[size]} w-auto`}
        />
    )
}
