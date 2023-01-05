import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { imagesRouter } from "./images";
import { tasksRouter } from "./tasks";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  images: imagesRouter,
  tasks: tasksRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
