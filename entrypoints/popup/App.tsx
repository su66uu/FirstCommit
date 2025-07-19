import "./App.css";
import useGithubTab from "./hooks/useGithubTab";

function App() {
  const { isLoading, error, isGithub, username, repo } = useGithubTab();

  if (isLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      {isGithub ? (
        <div>
          <span>Username: {username}</span> <span> Repo: {repo} </span>
        </div>
      ) : (
        "Not Github"
      )}
    </>
  );
}

export default App;
