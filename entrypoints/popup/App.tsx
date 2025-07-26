import "./App.css";
import useGithubRepo from "./hooks/useGithubRepo";
import useGithubTab from "./hooks/useGithubTab";

function App() {
  const { isLoading, error, isGithub, username, repo } = useGithubTab();
  console.log({ repo });

  const {
    repo: repoDetails,
    isLoading: isGithubRepoLoading,
    error: githubRepoFetchError,
  } = useGithubRepo({ username, repoName: repo });

  if (isLoading || isGithubRepoLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  console.log("repo", repoDetails);

  return (
    <>
      {isGithub ? (
        <div>
          <span>Username: {username}</span> <span> Repo: {repo} </span>
          <br />
          <span>Created At: {repoDetails?.created_at}</span>
        </div>
      ) : (
        "Not Github"
      )}
    </>
  );
}

export default App;
