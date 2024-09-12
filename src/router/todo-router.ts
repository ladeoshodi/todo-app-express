import { Router } from "express";
import todoController from "../controller/todo-controller";

const todoRouter = Router();

// GET all todos
todoRouter.get("/", todoController.getAllTodoItems);

// GET a single todo
todoRouter.get("/:todoId", todoController.getSingleTodoItem);

// Create a new todo task
todoRouter.post("/", todoController.createNewTodoItem);

// Edit a todo task
todoRouter.put("/:todoId", todoController.editTodoItem);

// Delete a todo task
todoRouter.delete("/:todoId", todoController.deleteTodoItem);

export default todoRouter;
