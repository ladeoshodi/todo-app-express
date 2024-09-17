import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../models/task-model";
import { User } from "../models/user-model";

dotenv.config();
const DB_CONNECTION =
  process.env.NODE_ENV === "production"
    ? process.env.DB_CONNECTION || ""
    : "mongodb://localhost:27017/todo-app";

// check that DB_CONNECTION is not undefined
if (!DB_CONNECTION) {
  throw {
    status: 500,
    message: "DB_CONNECTION is not set",
  };
}

//initial user data
const userData = [
  {
    username: "adminuser",
    email: "admin@admin.com",
    password: "#Adm1n123",
  },
  {
    username: "ladetest1",
    email: "ladetest1@example.com",
    password: "#Passw0rd",
  },
  {
    username: "ladetest2",
    email: "ladetest2@example.com",
    password: "#Passw0rd",
  },
];

// ! This is a program to put data into the database.
async function seed() {
  const conn = await mongoose.connect(DB_CONNECTION);
  console.log("Connected to the database! 🔥");

  // delete all existing data
  console.log("Wiping database clean");
  await User.deleteMany({});
  await Task.deleteMany({});

  console.log("Creating users in the db");
  const users = await User.create(userData);

  // initial todo data
  const taskData = [
    {
      name: "Finish lab exercise",
      priority: "P1",
      isCompleted: false,
      status: "todo",
      owner: users[0],
    },
    {
      name: "Handle GET requests",
      priority: "P3",
      isCompleted: false,
      status: "done",
      owner: users[0],
      collaborators: [users[1], users[2]],
    },
    {
      name: "Handle POST requests",
      priority: "P3",
      isCompleted: false,
      status: "in progress",
      owner: users[1],
    },
  ];

  console.log("Creating tasks in the db");
  await Task.create(taskData);

  // update the user with the tasks
  console.log("Associating Tasks to Users");
  const adminTasks = await Task.find({ owner: users[0] });
  await User.findByIdAndUpdate(users[0]._id, { tasks: adminTasks });
  const sharedTasks = await Task.find({
    collaborators: { $exists: true, $ne: [] },
  });

  for (const task of sharedTasks) {
    for (const collaborator of task.collaborators) {
      await User.findByIdAndUpdate(collaborator, {
        $push: { tasks: task },
      });
    }
  }

  await mongoose.disconnect();
  console.log("Disconnected from the database... bye bye");
}

seed();
