import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./views/App";
import ErrorView from "./views/ErrorView";
import EventsView from "./views/EventsView";
import GuideView from "./views/GuideView";
import PlayersView from "./views/PlayersView";
import RolesView from "./views/RolesView";
import RoleView from "./views/RoleView";
import SettingsView from "./views/SettingsView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorView />,
    children: [
      { path: "", loader: () => redirect("/game") },
      { path: "game", element: <EventsView /> },
      { path: "players", element: <PlayersView /> },
      { path: "roles", element: <RolesView /> },
      { path: "roles/:type", element: <RoleView /> },
      { path: "settings", element: <SettingsView /> },
      { path: "guide", element: <GuideView /> },
    ],
  },
]);
