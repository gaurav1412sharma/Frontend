import React from "react";
import './App.css';
import Sidebar from "./components/sidebar/sidebar"; // Corrected import path
import Clock from "./components/clock/clock"; // Corrected import path
import HeadingLogo from "./components/HeadingLogo/HeadingLogo"; // Corrected import path
import Bargraph from "./components/Bargraph/Bargraph"; // Corrected import path
import RightSidebar from "./components/RightSideBar/RightSideBar";

const App = () => {
    return (
        <div>
            <Sidebar />
            <Clock />
            <HeadingLogo />
            <Bargraph />
            <RightSidebar />
        </div>
    );
};

export default App;
