    import { ToastContainer } from "react-toastify";
    import AppRoutes from '@/routes/AppRoutes'
    import { useEffect } from "react";
    import { chatSocket } from "./services/chatSocket";

    function App() {
        useEffect(() => {
        chatSocket.connect((msg) => {
            console.log("📩 Global message:", msg);
            // TODO: push vào global state (Context / Redux)
        });

        return () => {
            chatSocket.disconnect();
        };
    }, []);

        return (
            <>
                <AppRoutes />
                <ToastContainer />
            </>
        )
    }

    export default App
    // gắn ở mọi trang
    // import { useState } from "react";
    // import { ToastContainer } from "react-toastify";
    // import AppRoutes from '@/routes/AppRoutes';
    // import ChatBox from '@/components/ChatBox/ChatBox';

    // function App() {
    //     const [openChat, setOpenChat] = useState(false);

    //     return (
    //         <>
    //             <AppRoutes />

    //             {/* Nút mở chat */}
    //             <button
    //                 className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full shadow-lg z-50"
    //                 onClick={() => setOpenChat(true)}
    //             >
    //                 Tư vấn
    //             </button>

    //             {/* ChatBox */}
    //             {openChat && (
    //                 <ChatBox onClose={() => setOpenChat(false)} />
    //             )}

    //             <ToastContainer />
    //         </>
    //     );
    // }

    // export default App;