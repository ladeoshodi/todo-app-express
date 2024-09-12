import { NextFunction, Request, Response } from "express";
import Todo from "../models/todo-model";

const todoController = {
  getAllTodoItems: async (req: Request, res: Response) => {
    const todoItems = await Todo.find({}).sort({
      isCompleted: -1,
      priority: 1,
      name: 1,
      _id: 1,
    });
    res.json(todoItems);
  },
  getSingleTodoItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { todoId } = req.params;
      const todoItem = await Todo.findById(todoId);
      if (!todoItem) {
        throw { status: 404, message: `No todo item with id: ${todoId} found` };
      }
      res.json(todoItem);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  createNewTodoItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newItem = await Todo.create(req.body);
      res.status(201).json(newItem);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  editTodoItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { todoId } = req.params;
      const updatedData = req.body;
      const updatedItem = await Todo.findByIdAndUpdate(todoId, updatedData, {
        new: true,
      });
      if (!updatedItem) {
        throw {
          status: 404,
          message: `No todo item with id: ${todoId} found to update`,
        };
      }
      res.status(200).json(updatedItem);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  deleteTodoItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { todoId } = req.params;
      const deletedItem = await Todo.findByIdAndDelete(todoId);
      if (!deletedItem) {
        throw {
          status: 404,
          message: `No todo item with id: ${todoId} found to delete`,
        };
      }
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

export default todoController;
