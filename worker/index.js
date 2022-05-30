const orderCompletedChangeStreams = require('./orderCompletedChangeStreams')
const productCompletedChangeStreams = require('./productCompletedChangeStreams')
exports.run = () => {
    orderCompletedChangeStreams.run()
    productCompletedChangeStreams.run()
}