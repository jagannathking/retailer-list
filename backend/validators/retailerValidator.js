const { z } = require('zod');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const CategoriesEnum = z.enum(['GROCERY', 'MEDICINE', 'ELECTRONICS', 'CLOTHING', 'OTHER']);

const listRetailersSchema = z.object({
    search: z.string().optional(),
    category: z.string().optional().transform((val) => val ? val.split(',') : undefined), // Allow comma-separated categories
    lat: z.preprocess(
        (val) => (val ? parseFloat(String(val)) : undefined),
        z.number().min(-90).max(90).optional()
    ),
    lng: z.preprocess(
        (val) => (val ? parseFloat(String(val)) : undefined),
        z.number().min(-180).max(180).optional()
    ),
    radiusKm: z.preprocess(
        (val) => (val ? parseFloat(String(val)) : undefined),
        z.number().positive().optional()
    ),
    page: z.preprocess(
        (val) => (val ? parseInt(String(val), 10) : 1),
        z.number().int().positive().default(1)
    ),
    limit: z.preprocess(
        (val) => (val ? parseInt(String(val), 10) : parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10)),
        z.number().int().positive().default(parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10))
    ),
}).refine(data => (data.lat === undefined) === (data.lng === undefined), {
    message: 'Both latitude and longitude must be provided together, or neither',
    path: ['lat', 'lng'],
}).refine(data => !(data.radiusKm !== undefined && (data.lat === undefined || data.lng === undefined)), {
    message: 'Radius requires latitude and longitude',
    path: ['radiusKm'],
});


const getRetailerSchema = z.object({
    id: z.string().refine(uuidValidate, { message: "Invalid UUID format" }),
});

const createRetailerSchema = z.object({
    name: z.string().min(1).max(120),
    category: CategoriesEnum,
    phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: "Invalid E.164 phone number format" }),
    address: z.string().min(1),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

module.exports = {
    listRetailersSchema,
    getRetailerSchema,
    createRetailerSchema,
};