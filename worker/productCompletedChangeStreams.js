const moment = require('moment')

const Products = require('../models/products')
const ProductStatistics = require('../models/productStatistics')


const run = async () => {
    Products.watch({ fullDocument: 'updateLookup' }).on('change', async (event) => {
        try {
            const { operationType, fullDocument, updateDescription } = event

            const { _id: productId, price } = fullDocument
            console.log('ok', operationType);

            if (
                ['insert'].includes(operationType)
            ) {
                await ProductStatistics.create({
                    product: productId,
                    price: price,
                    capturedTime: moment(),
                })
            } else if (
                ['update'].includes(operationType) &&
                updateDescription?.updatedFields?.price
            ) {
                await ProductStatistics.findOneAndUpdate(
                    //trong cung 1 ngay gia nho hon thi k lmj gia lon hon thi ms cap nhat
                    {
                        product: productId,
                        // price: { $lt: price },//tìm tất cả sp có giá nhỏ hơn sp truyền zô
                        capturedTime: {
                            $gte: moment().startOf('day'),//ngày lớn hơn or= ngày hiện tại
                        },
                    },
                    {
                        $set: {
                            price,
                            capturedTime: moment(),
                        },
                    },
                    { upsert: operationType === 'update' }
                )
            }

        } catch (error) {
            console.log(error)
        }
    })
}

exports.run = run