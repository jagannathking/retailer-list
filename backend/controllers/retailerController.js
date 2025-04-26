const Retailer = require('../models/Retailer');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

// Helper function to catch async errors
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

exports.createRetailer = catchAsync(async (req, res, next) => {
    const { name, category, phoneNumber, address, latitude, longitude } = req.body;

    const newRetailer = await Retailer.create({
        _id: uuidv4(), // Generate UUID for the new retailer
        name,
        category,
        phoneNumber,
        address,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude], // Store as [lng, lat]
        },
    });

    // Exclude location field if transforming in the model's toJSON isn't enough
    const result = newRetailer.toJSON(); // Use the transformation defined in the model
    // delete result.location; // Optionally remove raw location field

    res.status(201).json({
        status: 'success',
        data: {
            retailer: result,
        },
    });
});


exports.listRetailers = catchAsync(async (req, res, next) => {
    const { search, category, lat, lng, radiusKm, page, limit } = req.query;

    let query;
    const pagination = { page, limit };

    if (lat !== undefined && lng !== undefined) {
        // Geospatial Query using Aggregation Pipeline
        const maxDistanceMeters = radiusKm ? radiusKm * 1000 : undefined; 
        const geoNearStage = {
            $geoNear: {
                near: { type: 'Point', coordinates: [lng, lat] },
                distanceField: 'distance', 
                maxDistance: maxDistanceMeters,
                spherical: true,
                // We need to apply other filters *after* $geoNear or within its 'query' option
                // Let's apply them in a $match stage after for simplicity
            }
        };

        const matchStage = { $match: {} };
        if (search) {
            // Using regex for case-insensitive search (alternative to text index)
            matchStage.$match.name = { $regex: search, $options: 'i' };
            // If using text index: matchStage.$match.$text = { $search: search };
        }
        if (category && category.length > 0) {
            matchStage.$match.category = { $in: category };
        }

        // Add projection stage if you want to reshape the output or add distance in km
        const addFieldsStage = {
            $addFields: {
                distanceKm: { $divide: ['$distance', 1000] } 
            }
        };

        const skipStage = { $skip: (page - 1) * limit };
        const limitStage = { $limit: limit };
        const sortStage = { $sort: { distance: 1 } }; // Sort by distance (implicit in $geoNear, but can be explicit)


        // Pipeline for fetching data
        const pipeline = [
            geoNearStage,
            matchStage,
            addFieldsStage, 
            sortStage, 
            skipStage,
            limitStage,
        ];

        // Pipeline for counting total matching documents (needs geoNear + match only)
        const countPipeline = [
            geoNearStage,
            matchStage,
            { $count: 'total' }
        ];

        const [results, countResult] = await Promise.all([
            Retailer.aggregate(pipeline),
            Retailer.aggregate(countPipeline)
        ]);

        const total = countResult.length > 0 ? countResult[0].total : 0;
        pagination.total = total;
        pagination.pages = Math.ceil(total / limit);

        // Manually apply toJSON transformations as aggregate bypasses Mongoose middleware
        const retailers = results.map(doc => {
            doc.id = doc._id;
            // doc.latitude = doc.location.coordinates[1]; // Add lat/lng if needed
            // doc.longitude = doc.location.coordinates[0];
            delete doc._id;
            delete doc.__v;
            delete doc.location; // Remove original location object
            delete doc.distance; // Remove distance in meters if only km is needed
            return doc;
        });

        res.status(200).json({
            status: 'success',
            pagination,
            data: {
                retailers,
            },
        });

    } else {
        // Standard Query (no lat/lng provided)
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
            // If using text index: filter.$text = { $search: search };
        }
        if (category && category.length > 0) {
            filter.category = { $in: category };
        }

        // Use find() and countDocuments()
        const total = await Retailer.countDocuments(filter);
        const retailers = await Retailer.find(filter)
            .sort({ createdAt: -1 }) // Default sort if no distance
            .skip((page - 1) * limit)
            .limit(limit);

        pagination.total = total;
        pagination.pages = Math.ceil(total / limit);

        res.status(200).json({
            status: 'success',
            pagination,
            data: {
                retailers,
            },
        });
    }
});


exports.getRetailer = catchAsync(async (req, res, next) => {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
        return next(new AppError('No retailer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            retailer,
        },
    });
});

exports.getWhatsappLink = catchAsync(async (req, res, next) => {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
        return next(new AppError('No retailer found with that ID', 404));
    }

    if (!retailer.phoneNumber) {
        return next(new AppError('Retailer does not have a phone number', 400));
    }

    // Remove '+' and any non-digit characters for the link
    const number = retailer.phoneNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Hi'); 
    const link = `https://wa.me/${number}?text=${text}`;

    res.status(200).json({
        link: link
    });
});