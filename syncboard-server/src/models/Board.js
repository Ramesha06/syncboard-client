import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Board title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner ID is required'],
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id ? ret._id.toString() : ret.id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

boardSchema.index({ members: 1 });

const Board = mongoose.model('Board', boardSchema);

export default Board;
