import { timeStamp } from "console";
import mongoose from "mongoose";

// Make a Schema for the structure of the data
const todoSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A Todo Item name is required"] },
    priority: String,
    isCompleted: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

async function initialiseDBIndex() {
  await Todo.init();
}

initialiseDBIndex();

export default Todo;
