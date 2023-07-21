
import "dotenv/config";
import axios from 'axios';

export const getDistanceMatix = async (origin, destination) => {
    const result = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?access_token=${process.env.mapboxAccessToken}`);
    const { duration, distance } = result.data.routes[0];
    return { duration, distance };
}

export const totalTripPrice = async (truckRate, origin, destination) => {
    const cost = truckRate * (await getDistanceMatix(origin, destination)).distance;
    return cost;
};