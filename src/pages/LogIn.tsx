import React from 'react';
import GoogleButton from 'react-google-button';
import { UseAuth } from '../context/AuthContext';

export default function logIn(){
    const { googleSignIn } = UseAuth();
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