import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import MainPage from "../layout/MainPage";
import { UseTask } from "../context/TaskContext";
import { useEffect } from "react";
// import CompareEfforts from "../Components/CompareEfforts";
// import ViewEfforts from "../Components/ViewEfforts";
// import NavigationBar from "../Components/NavigaitonBar";

const PageWrapper: React.FC<{child: React.ReactNode}> = ({child}) => {

    return(
        <MainPage>{child}</MainPage>
    )
} 

export default function FlowDecider(){
    const {user} = UseAuth();
    const { initClient } = UseTask();

    useEffect(()=>{
        if(user){
            initClient(user.uid);
        }
    },[user])

    return(
        <div className="">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={user?<PageWrapper child={<Home/>} />:<LogIn/>}/>
                    {/* <Route path="/view" element={user?<ViewEfforts/>:<LogIn/>}/>
                    <Route path="/compare" element={user?<CompareEfforts/>:<LogIn/>}/> */}
                </Routes>
            </BrowserRouter>
        </div>
    );
}