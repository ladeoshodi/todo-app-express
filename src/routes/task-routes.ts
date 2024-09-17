import { Router } from "express";
import taskController from "../controllers/task-controller";
import subtaskController from "../controllers/subtask-controller";
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
 *          subtasks:
 *            type: array
 *            description: List of subtasks for a task
 *            items:
 *              $ref: "#/components/schemas/Subtask"
 *     Subtask:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of Task
 *         isCompleted:
 *           type: boolean
 *           description: Indicate if task has been completed or not
 *           default: false
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
 * /tasks/{taskId}:
 *   get:
 *     summary: List a single task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
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
taskRouter.get("/:taskId", taskController.getSingleTask);

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
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
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
taskRouter.put("/:taskId", sanitizeRoute, secureRoute, taskController.editTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
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
  "/:taskId",
  sanitizeRoute,
  secureRoute,
  taskController.deleteTask
);

// subtasks routes
/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: Create a new subtask
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Subtask"
 *     responses:
 *       201:
 *         description: A created subtask
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */

taskRouter.post(
  "/:taskId/subtasks",
  sanitizeRoute,
  secureRoute,
  subtaskController.createNewSubTask
);

/**
 * @swagger
 * /tasks/{taskId}/subtasks/{subtaskId}:
 *   put:
 *     summary: Edit a subtask
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The subtask Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Subtask"
 *     responses:
 *       201:
 *         description: A created subtask
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Task"
 */
taskRouter.put(
  "/:taskId/subtasks/:subtaskId",
  sanitizeRoute,
  secureRoute,
  subtaskController.editSubTask
);

/**
 * @swagger
 * /tasks/{taskId}/subtasks/{subtaskId}:
 *   delete:
 *     summary: Delete a subtask
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The task Id
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The subtask Id
 *     responses:
 *       204:
 *         description: No content
 */
taskRouter.delete(
  "/:taskId/subtasks/:subtaskId",
  sanitizeRoute,
  secureRoute,
  subtaskController.deleteSubtask
);

export default taskRouter;
