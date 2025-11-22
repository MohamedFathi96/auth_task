import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_autherized")({
  beforeLoad: ({ context }) => {
    if (!context.auth?.accessToken) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: () => <Outlet />,
});
