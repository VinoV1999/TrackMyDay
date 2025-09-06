import FlowDecider from "./routes/FlowDecider";
import "./index.css"
import { AuthContextProvider } from "./context/AuthContext";
import { TaskContextProvider } from "./context/TaskContext";

function App() {
  return (
    <AuthContextProvider>
      <TaskContextProvider>
        <FlowDecider/>
      </TaskContextProvider>
    </AuthContextProvider>
  );
}

export default App;
