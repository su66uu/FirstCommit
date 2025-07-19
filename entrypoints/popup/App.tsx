import "./App.css";
import useIsGithubTab from "./hooks/useCurrentTab";

function App() {
  const { isLoading, error, isGithub } = useIsGithubTab();

  if (isLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return <>{isGithub ? "This is Github" : "Not Github"}</>;
}

export default App;
