import { QueryClientProvider } from "@tanstack/react-query";
import styles from "./App.module.css";
import { createLocalClient } from "./client/local";
import EventScreen from "./components/EventScreen";

const client = createLocalClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <section className={styles.wrapper}>
        <EventScreen />
      </section>
    </QueryClientProvider>
  );
}

export default App;
