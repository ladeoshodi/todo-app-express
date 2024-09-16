import mongoose from "mongoose";
import dotenv from "dotenv";
import Todo from "../models/todo-model";
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
const adminUser = {
  username: "adminuser",
  email: "admin@email.com",
  password: "#Adm1n123",
};

// ! This is a program to put data into the database.
async function seed() {
  const conn = await mongoose.connect(DB_CONNECTION);
  console.log("Connected to the database! 🔥");

  // delete all existing data
  console.log("Wiping database clean");
  await User.deleteMany({});
  await Todo.deleteMany({});

  console.log("Adding initial data");
  const owner = await User.create(adminUser);

  // initial todo data
  const todoData = [
    { name: "Finish lab exercise", priority: 3, isCompleted: false, owner },
    { name: "Handle GET requests", priority: 2, isCompleted: false, owner },
    {
      name: "Handle POST requests",
      priority: 1,
      isCompleted: false,
      owner,
    },
  ];

  await Todo.create(todoData);

  await mongoose.disconnect();
  console.log("Disconnected from the database... bye bye");
}

seed();
