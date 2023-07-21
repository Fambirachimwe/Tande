import 'dotenv/config';
import Load from '../models/load.js'
import express from 'express';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        // Find all loads in the database
        const loads = await Load.find({});
        // Send a success response with the loads array
        res.status(200).json({ success: true, data: loads });
    } catch (err) {
        // Send an error response with the error message
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a load by id
router.get('/:id', async (req, res) => {
    try {
        // Get the id parameter from the request
        const id = req.params.id;
        // Find the load with the given id in the database
        const load = await Load.findById(id);
        // Check if the load exists
        if (load) {
            // Send a success response with the load object
            res.status(200).json({ success: true, data: load });
        } else {
            // Send a not found response with a message
            res.status(404).json({ success: false, error: 'Load not found' });
        }
    } catch (err) {
        // Send an error response with the error message
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get loads within a perimeter location
router.get('/near/:lng/:lat/:radius', async (req, res) => {
    try {
        // Get the latitude, longitude and radius parameters from the request
        const lat = parseFloat(req.params.lat);
        const lng = parseFloat(req.params.lng);
        const radius = parseFloat(req.params.radius);
        // Validate the parameters
        if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
            // Send a bad request response with a message
            res.status(400).json({ success: false, error: 'Invalid parameters' });
            return;
        }
        // Convert the radius from kilometers to meters
        const radiusInMeters = radius * 1000;
        // Find the loads that are within the given radius from the given location using geoNear aggregation
        const loads = await Load.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    maxDistance: radiusInMeters,
                    spherical: true,
                    key: "pickupLocation"
                },
            },
        ]);
        // Send a success response with the loads array
        res.status(200).json({ success: true, data: loads });
    } catch (err) {
        // Send an error response with the error message
        res.status(500).json({ success: false, error: err.message });
    }
});

// Post a load
router.post('/', async (req, res) => {
    try {
        // Get the load data from the request body
        const { pickupLocation, dropOffLocation, weight, volume, type, shipper, contents, price } = req.body;
        // Validate the required fields
        if (!pickupLocation || !dropOffLocation || !weight || !volume || !type || !shipper) {
            // Send a bad request response with a message
            res.status(400).json({ success: false, error: 'Missing required fields' });
            return;
        }
        // Create a new load object using the load model
        const load = new Load({
            pickupLocation,
            dropOffLocation,
            weight,
            volume,
            type,
            shipper,
            contents,
            price
        });
        // Save the load to the database
        await load.save();
        // Send a success response with the load object and a message
        res.status(201).json({ success: true, data: load, message: 'Load created successfully' });
    } catch (err) {
        // Send an error response with the error message
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update a load by id
router.put('/:id', async (req, res) => {
    try {
        // Get the id parameter from the request
        const id = req.params.id;
        // Get the update data from the request body
        const update = req.body;
        // Find and update the load with the given id in the database using findOneAndUpdate method with new and runValidators options set to true
        const load = await Load.findOneAndUpdate({ _id: id }, update, { new: true, runValidators: true });
        // Check if the load exists
        if (load) {
            // Send a success response with the load object and a message
            res.status(200).json({ success: true, data: load, message: 'Load updated successfully' });
        } else {
            // Send a not found response with a message
            res.status(404).json({ success: false, error: 'Load not found' });
        }
    } catch (err) {
        // Send an error response with the error message
        res.status(500).json({ success: false, error: err.message });
    }
});


// delete load 
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const load = await Load.findById(id);
    if (load) {
        res.status(201).json({
            sucess: true,
            message: "Load deleted successfully"
        })
    } else {
        res.status(404).json({ success: false, error: 'Load not found' });
    }

})




export default router;

// https://api.mapbox.com/directions/v5/mapbox/driving/-17.8277,31.0534;-20.15,28.5833?access_token=pk.eyJ1IjoidHJpenlkZWJvaSIsImEiOiJja3dkYjYycWUwaWF3Mm5xdnZzZGU1dThqIn0.cQMcvDY9mZVqhQXscEIv8g

// https://api.mapbox.com/directions/v5/mapbox/driving/-122.3321,47.6062;-122.6765,45.5231?access_token={your_access_token}

// https://api.mapbox.com/directions/v5/mapbox/driving/-17.8277,31.0534;-20.15,28.5833?access_token=sk.eyJ1IjoidHJpenlkZWJvaSIsImEiOiJjbGtheXVycXYwYzFtM2Rtc2Fsend4aXBtIn0.qnwLBYhaFcRWNDvSdT_lsA

// https://api.mapbox.com/directions/v5/mapbox/driving/31.105019,-17.794854;28.607388,-20.155975?access_token=sk.eyJ1IjoidHJpenlkZWJvaSIsImEiOiJjbGtheXVycXYwYzFtM2Rtc2Fsend4aXBtIn0.qnwLBYhaFcRWNDvSdT_lsA