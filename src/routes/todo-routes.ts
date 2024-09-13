import { Router } from "express";
import todoController from "../controllers/todo-controller";
import secureRoute from "../middleware/secureRoute";
import sanitizeRoute from "../middleware/sanitizeRoute";

const todoRouter = Router();

// GET all todos
todoRouter.get("/", todoController.getAllTodoItems);

// GET a single todo
todoRouter.get("/:todoId", todoController.getSingleTodoItem);

// Create a new todo task
todoRouter.post(
  "/",
  sanitizeRoute,
  secureRoute,
  todoController.createNewTodoItem
);

// Edit a todo task
todoRouter.put(
  "/:todoId",
  sanitizeRoute,
  secureRoute,
  todoController.editTodoItem
);

// Delete a todo task
todoRouter.delete(
  "/:todoId",
  sanitizeRoute,
  secureRoute,
  todoController.deleteTodoItem
);

export default todoRouter;
