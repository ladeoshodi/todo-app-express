import { Router } from "express";
import taskController from "../controllers/task-controller";
import secureRoute from "../middleware/secureRoute";
import sanitizeRoute from "../middleware/sanitizeRoute";

const taskRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *         - status
 *       properties:
 *          name:
 *            type: string
 *            description: Name of Task
 *          owner:
 *             type: string
 *             description: Ref to a User
 *          status:
 *            type: string
 *            description: Status of task
 *            enum: [todo, in progress, done]
 *            default: todo
 *          priority:
 *            type: string
 *            description: Priority of task (P0 = Critical, P1 = High, P2 = Medium, P3 = Low)
 *            enum: [P0, P1, P2, P3]
 *            default: P3
 *          isCompleted:
 *            type: boolean
 *            description: Indicate if task has been completed or not
 *            default: false
 *          collaborators:
 *            type: array
 *            description: Ref to multiple Users
 *            items:
 *              type: string
 */

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task API
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List all Tasks
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: The list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Task"
 */
// GET all tasks
taskRouter.get("/", taskController.getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: List a single task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *     responses:
 *       200:
 *         description: A single task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */
// GET a single task
taskRouter.get("/:id", taskController.getSingleTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Task"
 *     responses:
 *       201:
 *         description: A created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */
// Create a new task
taskRouter.post("/", sanitizeRoute, secureRoute, taskController.createNewTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Task"
 *     responses:
 *       200:
 *         description: An updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */
// Edit a task
taskRouter.put("/:id", sanitizeRoute, secureRoute, taskController.editTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *     responses:
 *       204:
 *         description: No content
 */
// Delete a task
taskRouter.delete(
  "/:id",
  sanitizeRoute,
  secureRoute,
  taskController.deleteTask
);

export default taskRouter;
