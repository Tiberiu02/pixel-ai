import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { imagesRouter } from "./images";
import { tasksRouter } from "./tasks";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  images: imagesRouter,
  tasks: tasksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
