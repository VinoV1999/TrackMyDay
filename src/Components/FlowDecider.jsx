import React from "react";
import { UserAuth } from '../context/authContext';
import HomePage from "./HomePage";
import LogIn from "./LogIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompareEfforts from "./CompareEfforts";
import ViewEfforts from "./ViewEfforts";
import NavigationBar from "./NavigaitonBar";

export default function flowDecider(){
    const {user} = UserAuth();
    return(
        <div className="continer">
            <BrowserRouter>
                {user &&<NavigationBar/>}
                <Routes>
                    <Route path="/" element={user?<HomePage/>:<LogIn/>}/>
                    <Route path="/view" element={user?<ViewEfforts/>:<LogIn/>}/>
                    <Route path="/compare" element={user?<CompareEfforts/>:<LogIn/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}