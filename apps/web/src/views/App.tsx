import { Outlet } from "react-router-dom";
import { DialogTarget } from "../hooks/useDialog";
import Layout from "./Layout";

function App() {
  return (
    <Layout>
      <DialogTarget>
        <Outlet />
      </DialogTarget>
    </Layout>
  );
}

export default App;
