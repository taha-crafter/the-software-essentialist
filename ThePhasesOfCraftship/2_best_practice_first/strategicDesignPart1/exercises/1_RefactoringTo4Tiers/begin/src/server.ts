import express, { Application as ExpressApp } from "express";
import { Server as HttpServer } from "http";

import StudetnsController from "./controllers/students";
import ClassesController from "./controllers/classes";
import AssignmentsController from "./controllers/assignments";

class Server {
  private readonly _instance: ExpressApp;

  get instance() {
    return this._instance;
  }

  constructor(
    private studentController: StudetnsController,
    private classesController: ClassesController,
    private assignmentsController: AssignmentsController
  ) {
    this._instance = express();
    this.addMiddleware();
    this.registerRouters();
  }

  registerRouters() {
    this._instance.use("/students", this.studentController.getRouter());
    this._instance.use("/classes", this.classesController.getRouter());
    this._instance.use("/assignments", this.assignmentsController.getRouter());
  }

  addMiddleware() {
    this._instance.use(express.json());
  }

  public start(port: number) {
    const server = this._instance.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });

    this.enableGracefulShutDown(server);
  }

  private enableGracefulShutDown(httpServer: HttpServer): void {
    const gracefulShutdown = () => {
      console.log("Received kill signal, shutting down gracefully");
      httpServer.close(() => {
        console.log("Closed out remaining connections");
        process.exit(0);
      });

      setTimeout(() => {
        console.error(
          "Couldn't close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  }
}

export default Server;
