import "./App.css";
import useGithubRepo from "./hooks/useGithubRepo";
import useGithubTab from "./hooks/useGithubTab";

function App() {
  const { isLoading, error, isGithub, username, repo } = useGithubTab();
  const {
    repo: repoDetails,
    isLoading: isGithubRepoLoading,
    error: githubRepoFetchError,
  } = useGithubRepo({ username, repoName: repo });

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
