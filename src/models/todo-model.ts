import mongoose from "mongoose";

// Make a Schema for the structure of the data
const todoSchema = new mongoose.Schema({
  name: { type: String, required: [true, "A Todo Item name is required"] },
  priority: String,
  isCompleted: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
