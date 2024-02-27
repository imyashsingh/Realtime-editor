import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor/:roomId" element={<EditorPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
