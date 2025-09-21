import React from "react";
import GoogleButton from "react-google-button";
import { UseAuth } from "../context/AuthContext";

export default function LogIn() {
  const { googleSignIn } = UseAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error in Login: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-800 via-brand-600 to-brand-400 p-6">
      <div className="bg-light rounded-3xl shadow-2xl max-w-lg w-full p-10 flex flex-col items-center text-center">
        
        {/* App Logo / Brand Mark */}
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-brand-500 text-light font-bold text-xl shadow-lg mb-6">
          JF
        </div>

        {/* App Name */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-800 tracking-tight mb-4">
          Just Focus
        </h1>

        {/* Motivational Quote */}
        <p className="text-lg md:text-xl font-medium text-brand-900 leading-relaxed">
          “The only thing you can’t revert back is the{" "}
          <span className="text-brand-600">time you waste</span>. <br />
          <span className="text-brand-400">So just focus!</span>
        </p>

        {/* Divider */}
        <div className="my-8 w-24 border-t-4 border-brand-300 rounded-full" />

        {/* Call-to-action */}
        <button onClick={handleGoogleSignIn} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-light font-semibold rounded-xl shadow-md transition-all transform hover:scale-105">
          Get Started
        </button>

        {/* Footer Note */}
        <p className="mt-6 text-sm text-brand-700 italic">
          Stay productive. Stay positive.
        </p>
      </div>
    </div>
  );
}