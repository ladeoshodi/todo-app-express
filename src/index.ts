import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import todoRouter from "./routes/todo-routes";
import userRouter from "./routes/user-routes";
import swaggerJSdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// enable use of .env variables
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION =
  process.env.NODE_ENV === "production"
    ? process.env.DB_CONNECTION || ""
    : "mongodb://localhost:27017/todo-app";

// check that DB_CONNECTION is not undefined
if (!DB_CONNECTION) {
  throw {
    status: 500,
    message: "DB_CONNECTION is not set",
  };
}

// create an instance of Express
const app = express();

// Middlewares
// Allow for JSON in request body
app.use(express.json());

// route all api calls to the API router
app.use("/api/todos", todoRouter);
app.use("/api/user", userRouter);

// swagger doc definition
const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "To-Do API with Swagger",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Lade Oshodi",
      url: "https://github.com/ladeoshodi",
    },
  },
  components: {
    securitySchemes: {
      Authorization: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ Authorization: [] }],
  servers: [
    { url: "http://localhost:3000/api", description: "Development server" },
  ],
};
const options = {
  swaggerDefinition,
  apis: ["src/routes/*.ts"],
};

const specs = swaggerJSdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// error handling
app.use((e: any, req: Request, res: Response, next: NextFunction) => {
  if (e.status >= 400 && e.status <= 499) {
    res.status(e.status).json(e.message);
  } else {
    console.error(e);
    res.status(500).send("An error occured, please try again later");
  }
});

// Setup server
async function start() {
  await mongoose.connect(DB_CONNECTION);
  console.log("Connected to the database:", DB_CONNECTION);

  // listen for incoming requests
  app.listen(PORT, () => {
    console.log(`Express server running on PORT: ${PORT}`);
  });
}

start();
