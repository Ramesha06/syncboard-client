import mongoose from 'mongoose';

const TASK_STATUSES = ['todo', 'in_progress', 'done'];

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        assignee: {
            type: String,
            trim: true,
        },
        assigneeInitials: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: TASK_STATUSES,
            default: 'todo',
        },
        dueDate: {
            type: Date,
        },
        // Referencing (not embedding): tasks grow indefinitely, so embedding
        // them inside a Board document would risk the 16MB document limit and
        // hurt query performance. Referencing also allows pagination + indexes.
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board',
            required: [true, 'Board ID is required'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
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

// Speeds up the board-scoped list queries taskService/taskRepository run
// (findByBoardId), and status is the most common filter on top of that.
taskSchema.index({ boardId: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;