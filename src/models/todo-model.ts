import { timeStamp } from "console";
import mongoose from "mongoose";

// Make a Schema for the structure of the data
const todoSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A Todo Item name is required"] },
    priority: {
      type: Number,
      enum: {
        values: [1, 2, 3],
        message:
          "Must be set to either 1, 2 or 3 equivalent to low, medium or high",
      },
      default: 1,
    },
    isCompleted: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // owner of the document
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

async function initialiseDBIndex() {
  await Todo.init();
}

initialiseDBIndex();

export default Todo;
