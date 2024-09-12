import { Router } from "express";
import todoController from "../controller/todo-controller";
import secureRoute from "../middleware/secureRoute";

const todoRouter = Router();

// GET all todos
todoRouter.get("/", todoController.getAllTodoItems);

// GET a single todo
todoRouter.get("/:todoId", todoController.getSingleTodoItem);

// Create a new todo task
todoRouter.post("/", secureRoute, todoController.createNewTodoItem);

// Edit a todo task
todoRouter.put("/:todoId", secureRoute, todoController.editTodoItem);

// Delete a todo task
todoRouter.delete("/:todoId", secureRoute, todoController.deleteTodoItem);

export default todoRouter;
