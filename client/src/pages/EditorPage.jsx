import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { ACTIONS } from "../action";
import { useLocation, useNavigate } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const username = location.state?.username;
            if (!username) {
                navigate("/");
                return;
            }
            socketRef.current = await initSocket();
            // socketRef.current.emit(ACTIONS.JOIN, {
            //     roomId,
            //     username,
            // });
        };
        init();
    }, [navigate, location.state?.username]);

    const [clients, setClients] = useState([
        { socketId: 1, username: "yad ghh" },
        { socketId: 2, username: "yad ghh" },
        { socketId: 3, username: "yad ghh" },
        { socketId: 4, username: "yad ghh" },
        { socketId: 5, username: "yadghh" },
    ]);
    return (
        <div className=" w-screen h-screen text-white sm:flex">
            <div className="bg-gray-950 max-h-[50%] sm:w-56 sm:max-h-full p-3 flex flex-col items-center ">
                <div className="font-bold text-xl text-blue-600 py-3 border-b border-gray-700">
                    Realtime Code Editor
                </div>
                <div className="p-3 font-medium">Connected</div>
                <div className="flex-1 overflow-auto">
                    {clients.map((client) => (
                        <Avatar
                            key={client.socketId}
                            name={client.username}
                            size={50}
                            round="14px"
                            alt={client.username}
                            className="cursor-pointer m-1 "
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-3 w-full py-4 mt-4">
                    <button className="rounded p-2  bg-green-700 ">
                        Copy Room Id
                    </button>
                    <button className="rounded p-2 bg-red-600">Leave</button>
                </div>
            </div>
            <Editor />
        </div>
    );
};

export default EditorPage;
