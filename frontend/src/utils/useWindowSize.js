import { useEffect, useState } from "react";

export const useWindowSize = () => {
    // Initialize state with the current window size
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        // Function to update the window size
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        // Add event listener for window resize
        window.addEventListener("resize", updateSize);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener("resize", updateSize);
    }, []); // Empty dependency array ensures this runs only once on mount

    // Return the width and height as an object
    return {
        width: size[0],
        height: size[1],
    };
};