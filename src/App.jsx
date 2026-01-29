import Header from '@/components/Header/Header'
import AppRoutes from '@/routes/AppRoutes'

function App() {
    return (
        <>
            <Header />
            <main className="pt-16">
                <AppRoutes />
            </main>
        </>
    )
}

export default App
