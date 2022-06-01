const moment = require('moment')

const Products = require('../models/products')
const ProductStatistics = require('../models/productStatistics')


const run = async () => {
    Products.watch({ fullDocument: 'updateLookup' }).on('change', async (event) => {
        try {
            const { operationType, fullDocument, updateDescription } = event

            const { _id: productId, price } = fullDocument
            if (
                ['insert', 'update'].includes(operationType) ||
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
            // if (
            //     ['insert'].includes(operationType)
            // ) {
            //     await ProductStatistics.create({
            //         product: productId,
            //         price: price,
            //         capturedTime: moment(),
            //     })
            // }

            // if (
            //     ['update'].includes(operationType) &&
            //     updateDescription?.updatedFields?.price
            // ) {
            //     await ProductStatistics.findOneAndUpdate(
            //         {
            //             product: productId,
            //             price: { $lt: price },//nhỏ hơn
            //             capturedTime: {
            //                 $gte: moment().startOf('day'),//lớn hơn hoặc bằng
            //             },
            //         },
            //         {
            //             $set: {
            //                 price,
            //                 capturedTime: moment(),
            //             },
            //         },
            //         { upsert: operationType === 'update' }
            //     )
            // }

        } catch (error) {
            console.log(error)
        }
    })
}

exports.run = run