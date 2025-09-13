import React from 'react';
import { UserAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default function NavigationBar() {
    const { googlesignOut, user } = UserAuth();

    const handleGoolgeSignOUt = async () => {
        try {
            await googlesignOut();
        } catch (error) {
            console.log("Error in log Out : ", error);
        }
    }
    return (
        <div className='navBar'>
            <h2 className='header'>Track My Day</h2>
            <div className="profile">
            <ul>
                <li> <Link to="/">Home</Link></li>
                <li> <Link to="/view">View</Link></li>
                <li> <Link to="/compare">Compare</Link></li>
            </ul>
            <FontAwesomeIcon onClick={handleGoolgeSignOUt} className='UserProfile' icon={faSignOutAlt} />
        </div>
        </div>
    )
}