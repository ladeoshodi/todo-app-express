import mongoose from "mongoose";
import dotenv from "dotenv";
import Todo from "../models/todo-model";
import { User } from "../models/user-model";

dotenv.config();
const DB_CONNECTION =
  process.env.PROD_DB_CONNECTION || "mongodb://localhost:27017/todo-app";

// initial todo data
const todoData = [
  { name: "Finish lab exercise", priority: "high", isCompleted: false },
  { name: "Handle GET requests", priority: "high", isCompleted: false },
  { name: "Handle POST requests", priority: "high", isCompleted: false },
];

//initial user data
const userData = [
  {
    username: "ladetest1",
    email: "ladetest1@email.com",
    password: "testpassword",
  },
  {
    username: "ladetest2",
    email: "ladetest2@email.com",
    password: "testpassword",
  },
];

// ! This is a program to put data into the database.
async function seed() {
  const conn = await mongoose.connect(DB_CONNECTION);
  console.log("Connected to the database! 🔥");

  // delete all existing data
  console.log("Wiping database clean");
  await Todo.deleteMany({});
  await User.deleteMany({});

  console.log("Adding initial data");
  await Todo.create(todoData);
  await User.create(userData);

  await mongoose.disconnect();
  console.log("Disconnected from the database... bye bye");
}

seed();
