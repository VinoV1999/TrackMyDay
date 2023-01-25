import React from 'react';
import GoogleButton from 'react-google-button';
import { UserAuth } from '../context/authContext';

export default function logIn(){
    const { googleSignIn, googlesignOut, user} = UserAuth();
    const handleGoolgeSignIn = async () =>{
        try {
            await googleSignIn();        
        } catch (error) {
            console.log("Error in Login: ",error);
        }
    }
    return (
        <div className='logInBtn'>
            <GoogleButton onClick={handleGoolgeSignIn}/>
        </div>
    );
}