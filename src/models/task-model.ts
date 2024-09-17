import mongoose from "mongoose";

// subtask schema
const subtask = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A Subtask name is needed"] },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Make a Schema for the structure of the data
const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "A Task name is required"] },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // owner of the document
    status: {
      type: String,
      enum: {
        values: ["todo", "in progress", "done"],
        message: "Must be set to either 'todo', 'in progress' or 'done'",
      },
      default: "todo",
      required: [true, "A status is required"],
    },
    priority: {
      type: String,
      enum: {
        values: ["P0", "P1", "P2", "P3"],
        message:
          "Must be set to a priority between P0 - P3. P0 - Critical, P1 - High, P2 - Medium, P3 - Low",
      },
      default: "P3",
    },
    isCompleted: { type: Boolean, default: false },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        set: (v: string) => (v === "" ? null : v),
      },
    ],
    subtasks: [subtask],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

async function initialiseDBIndex() {
  await Task.init();
}

initialiseDBIndex();

export default Task;
