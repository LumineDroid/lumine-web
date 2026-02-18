import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import Team from "./pages/Team";
import Download from "./pages/Download";
import DownloadDetail from "./pages/DownloadDetail";
import Stats from "./pages/Stats";

const App = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        <>
            {loading && <Loader />}
            <Navbar />
            <main className="bg-pattern pt-20 px-4">
                {" "}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/changelog" element={<Blog />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/download" element={<Download />} />
                    <Route
                        path="/download/devices/:codename/:variant"
                        element={<DownloadDetail />}
                    />
                    <Route
                        path="/download/devices/:codename"
                        element={<DownloadDetail />}
                    />
                    <Route path="/stats" element={<Stats />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

export default App;
