import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./views/App";
import EventsView from "./views/EventsView";
import PlayersView from "./views/PlayersView";
import RoleView from "./views/RoleView";
import RolesView from "./views/RolesView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", loader: () => redirect("/events") },
      { path: "events", element: <EventsView /> },
      { path: "players", element: <PlayersView /> },
      { path: "roles", element: <RolesView /> },
      { path: "roles/:type", element: <RoleView /> },
    ],
  },
]);
