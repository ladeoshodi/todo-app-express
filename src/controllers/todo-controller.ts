import { NextFunction, Request, Response } from "express";
import Todo from "../models/todo-model";

const todoController = {
  async getAllTodoItems(req: Request, res: Response) {
    const todoItems = await Todo.find({}).sort({
      isCompleted: -1,
      priority: 1,
      name: 1,
      _id: 1,
    });
    res.json(todoItems);
  },
  async getSingleTodoItem(req: Request, res: Response, next: NextFunction) {
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
  async createNewTodoItem(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.owner = req.currentUser._id;
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
  async editTodoItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { todoId } = req.params;
      const updatedData = req.body;

      // get the owner of the todo item
      const itemToUpdate = await Todo.findById(todoId);
      if (!itemToUpdate) {
        throw {
          status: 404,
          message: `No todo item with id: ${todoId} found to update`,
        };
      }

      // check that the logged in user owns the document to update
      if (!req.currentUser._id.equals(itemToUpdate.owner)) {
        throw {
          status: 401,
          message: `Unauthorised: you must own the item to be able to update it`,
        };
      }

      const updatedItem = await Todo.findByIdAndUpdate(todoId, updatedData, {
        new: true,
      });

      res.status(200).json(updatedItem);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  async deleteTodoItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { todoId } = req.params;

      // get the owner of the todo item
      const itemToDelete = await Todo.findById(todoId);
      if (!itemToDelete) {
        throw {
          status: 404,
          message: `No todo item with id: ${todoId} found to delete`,
        };
      }

      // check that the logged in user owns the document to delete
      if (!req.currentUser._id.equals(itemToDelete.owner)) {
        throw {
          status: 401,
          message: `Unauthorised: you must own the item to be able to delete it`,
        };
      }

      await Todo.findByIdAndDelete(todoId);

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
