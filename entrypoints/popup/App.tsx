import "./App.css";
import useGithubTab from "./hooks/useGithubTab";

function App() {
  const { isLoading, error, isGithub } = useGithubTab();

  if (isLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return <>{isGithub ? "This is Github" : "Not Github"}</>;
}

export default App;
