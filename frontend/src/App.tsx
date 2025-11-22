import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { useAuth } from "@/context/auth.context";

const appRouter = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

const App = () => {
  const authContext = useAuth();
  return <RouterProvider router={appRouter} context={{ auth: authContext }} />;
};

export default App;
