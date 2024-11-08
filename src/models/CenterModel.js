import mongoose from 'mongoose';
import Counter from './CounterModel.js';

const CenterSchema = new mongoose.Schema({
    centreId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        nullable: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

CenterSchema.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'center' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        this.centreId = counter.sequence_value;
    }
    next();
});

const Center = mongoose.model('Center', CenterSchema);

export default Center;