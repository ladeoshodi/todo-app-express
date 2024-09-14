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
 *            description: Priority of the task (1 = low, 2 = medium, 3 = high)
 *            enum: [1, 2, 3]
 *          isCompleted:
 *            type: boolean
 *            description: Indicate if task is completed or not
 *            default: false
 *          user:
 *             type: string
 *             description: Ref to a User
 */

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: Todo API
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: List all todo items
 *     tags: [Todo]
 *     responses:
 *       200:
 *         description: The list of todo items
 *         content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/Todo"
 */
// GET all todos
todoRouter.get("/", todoController.getAllTodoItems);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: List a single todo item
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo Id
 *     responses:
 *       200:
 *         description: A single todo item
 *         content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 */
// GET a single todo
todoRouter.get("/:todoId", todoController.getSingleTodoItem);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo item
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       201:
 *         description: A created todo item
 *         content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 */
// Create a new todo task
todoRouter.post(
  "/",
  sanitizeRoute,
  secureRoute,
  todoController.createNewTodoItem
);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo item
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 *     responses:
 *       200:
 *         description: An updated todo item
 *         content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Todo"
 */
// Edit a todo task
todoRouter.put(
  "/:todoId",
  sanitizeRoute,
  secureRoute,
  todoController.editTodoItem
);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo item
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo Id
 *     responses:
 *       204:
 *         description: Delete Successful
 */
// Delete a todo task
todoRouter.delete(
  "/:todoId",
  sanitizeRoute,
  secureRoute,
  todoController.deleteTodoItem
);

export default todoRouter;
