import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    // create unique roomId
    const createNewRoomId = () => {
        const id = uuidv4();
        setRoomId(id);
        toast.success("New Room Id Created");
    };

    //Join New Room
    const joinRoom = (e) => {
        e.preventDefault();
        if (!roomId || !username) {
            toast.error("Enter valid username or roomId");
            return;
        }

        // redirect
        navigate(`/editor/${roomId}`, { state: { username } });
    };

    return (
        <div className="bg-gray-900 flex justify-center items-center w-screen h-screen">
            <form
                onSubmit={joinRoom}
                className="flex flex-col  bg-gray-800 p-5 rounded max-w-[90%]"
            >
                <h1 className="text-blue-400 font-bold text-2xl p-4 text-center">
                    Realtime Code Editor
                </h1>
                <label htmlFor="roomId" className="text-white font-thin py-1 ">
                    Paste invitation ROOM ID
                </label>
                <input
                    type="text"
                    id="roomId"
                    name="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-3 py-1 rounded "
                    placeholder="ROOM ID"
                />
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-3 py-1 rounded mt-3"
                    placeholder="Username"
                />
                <button
                    className="w-20 mt-3 self-end bg-green-400 px-2 py-1 rounded hover:bg-green-600 duration-200 ease-in-out active:bg-green-700"
                    type="submit"
                >
                    JOIN
                </button>
                <p className="text-white pt-3">
                    If you {"don't"} have invite then create{" "}
                    <span
                        onClick={createNewRoomId}
                        className="font-semibold text-blue-600 cursor-pointer hover:text-blue-500"
                    >
                        New Room
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Home;
