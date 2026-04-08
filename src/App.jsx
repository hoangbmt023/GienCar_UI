import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from '@/routes/AppRoutes'
import { useEffect } from "react";
import { chatSocket } from "./services/chatSocket";

function App() {
    useEffect(() => {

        chatSocket.connect((msg) => {
            console.log("Global message:", msg);

            // ✅ CHỈ hiện khi có message thật
            if (msg?.content) {
                toast.info(`📩 ${msg.content}`);
            }
        });

        return () => {
            chatSocket.disconnect();
        };
    }, []);

    return (
        <>
            <AppRoutes />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                pauseOnHover
                theme="colored"
                style={{ zIndex: 9999 }}
            />
        </>
    )
}

export default App;
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