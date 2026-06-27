import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                <p className="mt-5 text-gray-600 font-medium">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;