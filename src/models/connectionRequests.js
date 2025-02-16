const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['interested', 'accepted', 'rejected', "ignored"],
            message: '{VALUE} is incorrect status type'
        }
    },
},
    { 
        timestamps: true 
    }
)

connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this
    const {senderId, receiverId} = connectionRequest
    const existingRequest = 
        await ConnectionRequest.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
    if (existingRequest) {
        throw new Error("Connection request already exists")
    }
    if (senderId.equals(receiverId)) {
        throw new Error("You can not send request to yourself")
    }
    next()
})

connectionRequestSchema.index({ senderId: 1, receiverId: 1 })

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest