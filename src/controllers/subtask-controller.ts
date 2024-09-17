import { Request, Response } from "express";
import Task from "../models/task-model";

const subtaskController = {
  async createNewSubTask(req: Request, res: Response) {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw {
        status: 404,
        message: "Task not found",
      };
    }
    if (
      req.currentUser._id.equals(task.owner) ||
      task.collaborators.includes(req.currentUser._id)
    ) {
      task.subtasks.push(req.body);
      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } else {
      throw {
        status: 401,
        message:
          "Unauthorised: you must either own or be a collaborator on the task to update it",
      };
    }
  },
  async editSubTask(req: Request, res: Response) {
    const { taskId, subtaskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      throw {
        status: 404,
        message: "Task not found",
      };
    }

    const subtask = task.subtasks.id(subtaskId);

    if (!subtask) {
      throw {
        status: 404,
        message: "Subtask not found",
      };
    }

    if (
      req.currentUser._id.equals(task.owner) ||
      task.collaborators.includes(req.currentUser._id)
    ) {
      subtask.set(req.body);
      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } else {
      throw {
        status: 401,
        message:
          "Unauthorised: you must either own or be a collaborator on the task to update a subtask",
      };
    }
  },

  async deleteSubtask(req: Request, res: Response) {
    const { taskId, subtaskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      throw {
        status: 404,
        message: "Task not found",
      };
    }

    const subtask = task.subtasks.id(subtaskId);

    if (!subtask) {
      throw {
        status: 404,
        message: "Subtask not found",
      };
    }

    if (
      req.currentUser._id.equals(task.owner) ||
      task.collaborators.includes(req.currentUser._id)
    ) {
      subtask.deleteOne();
      await task.save();
      res.status(204).end();
    } else {
      throw {
        status: 401,
        message:
          "Unauthorised: you must either own or be a collaborator on the task to delete a subtask",
      };
    }
  },
};

export default subtaskController;
