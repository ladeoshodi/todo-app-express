import { NextFunction, Request, Response } from "express";
import Task from "../models/task-model";

const taskController = {
  async getAllTasks(req: Request, res: Response) {
    const tasks = await Task.find({}).sort({
      isCompleted: -1,
      priority: 1,
      name: 1,
      _id: 1,
    });
    res.json(tasks);
  },
  async getSingleTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        throw { status: 404, message: `No task with id: ${id} found` };
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
      const { id } = req.params;
      const updatedData = req.body;

      // get the owner of the task item
      const taskToUpdate = await Task.findById(id);
      if (!taskToUpdate) {
        throw {
          status: 404,
          message: `No task with id: ${id} found to update`,
        };
      }

      // check that the logged in user owns the task to update
      if (!req.currentUser._id.equals(taskToUpdate.owner)) {
        throw {
          status: 401,
          message: `Unauthorised: you must own the task to be able to update it`,
        };
      }

      const updatedTask = await Task.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      res.status(200).json(updatedTask);
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
      const { id } = req.params;

      // get the owner of the task item
      const taskToDelete = await Task.findById(id);
      if (!taskToDelete) {
        throw {
          status: 404,
          message: `No task with id: ${id} found to delete`,
        };
      }

      // check that the logged in user owns the task to delete
      if (!req.currentUser._id.equals(taskToDelete.owner)) {
        throw {
          status: 401,
          message: `Unauthorised: you must own the task to be able to delete it`,
        };
      }

      await Task.findByIdAndDelete(id);

      res.status(204).send("deleted");
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
