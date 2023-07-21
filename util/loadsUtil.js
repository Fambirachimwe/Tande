import Load from '../models/load.js'


const ACCEPTANCE_TIME_LIMIT = 15;

// // Define a function to accept a load by id and driver id
export const acceptLoad = async (loadId, driverId) => {
    try {
        // Find the load with the given id in the database
        const load = await Load.findById(loadId);

        if (load && load.status === 'available') {
            // Update the load with the driver id and the accepted flag set to true
            await Load.updateOne({ _id: loadId }, { driver: driverId, accepted: true });
            return 'Load accepted successfully';
        } else {
            return 'Load not found or not available';
        }
    } catch (err) {
        return `An error occurred: ${err.message}`;
    }
};


// Define a function to set a clock time to check if the driver has still accepted the load
// The function takes one parameter: loadId, which is a string of object id
export const checkLoadAcceptance = async (loadId) => {

    // run a cron job in a separate thread  to check the timer 

    try {
        // Find the load with the given id in the database
        const load = await Load.findById(loadId);
        // Check if the load exists and is accepted by a driver
        if (load && load.accepted && load.driver && load.status === 'available') {
            // Get the current time and the load creation time as Date objects
            const currentTime = new Date();
            const driverAcceptenceTime = new Date(load.acceptedAt);
            // Calculate the difference between the current time and the load creation time in minutes
            const timeDiff = Math.floor((currentTime - driverAcceptenceTime) / (1000 * 60));
            // Check if the time difference is greater than the acceptance time limit
            if (timeDiff > ACCEPTANCE_TIME_LIMIT) {
                // Update the load with the driver id and the accepted flag set to null
                await Load.updateOne({ _id: loadId }, { driver: null, accepted: null, acceptedAt: null });
                // Log a message with the expired time
                console.log(`Load acceptance expired after ${timeDiff} minutes`);

                return {
                    expired: true,
                    time: timeDiff
                }
            }
            else {
                return {
                    expired: false,
                    time: timeDiff
                }
            }
        }
    } catch (err) {
        // Log an error message with the error details
        console.error(`An error occurred: ${err.message}`);
    }
};



