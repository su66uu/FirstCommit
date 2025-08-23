import "./App.css";
import useGithubTab from "./hooks/useGithubTab";
import useGithubFirstCommit from "./hooks/useGithubFirstCommit";

function App() {
  const { isLoading, error, isGithub, username, repo } = useGithubTab();
  const {
    firstCommit,
    isLoading: isFirstCommitLoading,
    error: firstCommitError,
  } = useGithubFirstCommit({
    repo: repo || "",
    owner: username || "",
    options: {
      enabled: isGithub && !!username && !!repo,
    },
  });

  if (isLoading || isFirstCommitLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error || firstCommitError) {
    console.error("error", error);
    console.error("Error fetching the first commit", firstCommitError);
    return <div>error</div>;
  }

  if (!isGithub) {
    return <div>Not a Github tab</div>;
  }

  if (!firstCommit) {
    return <div>No commits found</div>;
  }

  return (
    <div className="App">
      <div className="commit-line">
        <span className="commit-label">Commit</span>
        <a
          href={firstCommit.html_url}
          target="_blank"
          className="commit-hash"
        >
          {firstCommit.sha}
        </a>
      </div>
      <div className="author-line">
        <span className="author-label">Author: </span>
        <span className="author-info">
          {firstCommit.commit.author.name} &lt;{firstCommit.commit.author.email}&gt;
        </span>
      </div>
      <div className="date-line">
        <span className="date-label">Date:   </span>
        <span className="date-info">
          {new Date(firstCommit.commit.author.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          })}
        </span>
      </div>
      <div className="message-container">
        <div className="message-text">{firstCommit.commit.message}</div>
      </div>
    </div>
  );
}

export default App;
