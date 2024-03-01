import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import toast from "react-hot-toast";
import { ACTIONS } from "../action";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            const username = location.state?.username;
            if (!username || !roomId) {
                navigate("/");
                return;
            }

            socketRef.current = await initSocket();
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setClients(clients);

                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [navigate, location.state?.username, roomId]);

    const onCodeChange = (code) => {
        codeRef.current = code;
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied to your clipboard");
        } catch (err) {
            toast.error("Could not copy the Room ID");
            console.error(err);
        }
    };

    const leaveRoom = () => {
        navigate("/");
    };

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
                    <button
                        onClick={copyRoomId}
                        className="rounded p-2  bg-green-700 "
                    >
                        Copy Room Id
                    </button>
                    <button
                        onClick={leaveRoom}
                        className="rounded p-2 bg-red-600"
                    >
                        Leave
                    </button>
                </div>
            </div>
            <Editor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={onCodeChange}
            />
        </div>
    );
};

export default EditorPage;
