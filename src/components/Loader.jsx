import React from "react";

export const AnimatedDots = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-green-600"></div>
          <h1 className="text-xl text-green-600 font-medium">Please Wait .......</h1>
        </div>
      </div>
    );
  };
  
  export default AnimatedDots;