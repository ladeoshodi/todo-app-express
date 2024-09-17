import { NextFunction, Request, Response } from "express";
import Task from "../models/task-model";
import { User } from "../models/user-model";

const taskController = {
  async getAllTasks(req: Request, res: Response) {
    const tasks = await Task.find({})
      .sort({
        status: 1,
        priority: 1,
      })
      .populate("owner")
      .populate("collaborators");
    res.json(tasks);
  },
  async getSingleTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId)
        .populate("owner")
        .populate("collaborators");
      if (!task) {
        throw { status: 404, message: `No task with id: ${taskId} found` };
      }
      res.json(task);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  async createNewTask(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.owner = req.currentUser._id;
      const newTask = await Task.create(req.body);
      await User.findByIdAndUpdate(req.currentUser._id, {
        $push: { tasks: newTask },
      });
      res.status(201).json(newTask);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  async editTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const updatedData = req.body;

      // get the task to update
      const taskToUpdate = await Task.findById(taskId);
      if (!taskToUpdate) {
        throw {
          status: 404,
          message: `No task with id: ${taskId} found to update`,
        };
      }

      // check that the logged in user owns or is a collaborator on the task to update
      if (
        req.currentUser._id.equals(taskToUpdate.owner) ||
        taskToUpdate.collaborators.includes(req.currentUser._id)
      ) {
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
          new: true,
        })
          .populate("owner")
          .populate("collaborators");

        if (updatedData.collaborators) {
          for (const collaborator of updatedData.collaborators) {
            await User.findByIdAndUpdate(collaborator, {
              $push: { tasks: updatedTask },
            });
          }
        }

        res.status(200).json(updatedTask);
      } else {
        throw {
          status: 401,
          message: `Unauthorised: you must own or be a collaborator on the task to update it`,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;

      // get the owner of the task item
      const taskToDelete = await Task.findById(taskId);
      if (!taskToDelete) {
        throw {
          status: 404,
          message: `No task with id: ${taskId} found to delete`,
        };
      }

      // check that the logged in user owns the task to delete
      if (!req.currentUser._id.equals(taskToDelete.owner)) {
        throw {
          status: 401,
          message: `Unauthorised: you must own the task to be able to delete it`,
        };
      }

      await Task.findByIdAndDelete(taskId);

      res.status(204).end();
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
};

export default taskController;
