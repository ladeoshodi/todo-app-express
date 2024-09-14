import { Router } from "express";
import todoController from "../controllers/todo-controller";
import secureRoute from "../middleware/secureRoute";
import sanitizeRoute from "../middleware/sanitizeRoute";

const todoRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - name
 *         - user
 *       properties:
 *          name:
 *            type: string
 *            description: Name of Todo task
 *          priority:
 *            type: integer
 *            description: Priority of the task
 *            enum: [1, 2, 3]
 *          isCompleted:
 *            type: boolean
 *            description: Indicate if task is completed or not
 *            default: false
 *          user:
 *             type: string
 *             description: Ref to a User
 */

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
