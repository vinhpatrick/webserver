const moment = require('moment')

const Products = require('../models/products')
const ProductStatistics = require('../models/productStatistics')

const run = async = () => {
    Products.watch({ fullDocument: 'updateLookup' }).on('change', async (event) => {
        try {
            const { operationType, fullDocument, updateDescription } = event
            const { _id: productId, price } = fullDocument
            if (
                ['inert', 'update'].includes(operationType) ||
                updateDescription?.updatedFields.price
            )
                await ProductStatistics.findOneAndUpdate(
                    {
                        product: productId,
                        price: { $lt: price },
                        capturedTime: {
                            $gte: moment().startOf('day'),
                        },
                    },
                    {
                        $set: {
                            price,
                            capturedTime: moment(),
                        },
                    },
                    { upsert: operationType === 'insert' }
                )
        } catch (error) {
            console.error(error)
        }
    })
}
exports.run = run
