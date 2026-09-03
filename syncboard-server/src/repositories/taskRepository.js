import Task from '../models/Task.js';

class TaskRepository {
  async findAll() {
    return Task.find();
  }

  async findById(id) {
    return Task.findById(id);
  }

  async findByBoardId(boardId) {
    return Task.find({ boardId });
  }

  async create(taskData) {
    return Task.create(taskData);
  }

  async update(id, updatedFields) {
    return Task.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
  }

  async delete(id) {
    const deletedTask = await Task.findByIdAndDelete(id);
    return deletedTask !== null;
  }

  async count() {
    return Task.countDocuments();
  }

  async reset() {
    await Task.deleteMany({});
  }
}

export default new TaskRepository();