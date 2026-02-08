import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/entities/ITask';

const TaskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    dueDate: {
        type: Date,
    },
    assignees: {
        type: [String],
        default: [],
    },
    attachments: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

TaskSchema.pre('save', async function () {
    if (this.isModified('status') && this.status === 'completed') {
        this.completedAt = new Date();
    }
});

export default mongoose.model<ITask>('Task', TaskSchema);
