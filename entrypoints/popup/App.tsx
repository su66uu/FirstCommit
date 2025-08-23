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
    return (
      <div className="loading-container">
        <div className="loading-text">
          <div className="loading-dots">Fetching</div>
        </div>
      </div>
    );
  }

  if (error || firstCommitError) {
    let errorMessage = "Unknown error occurred";
    if (error) {
      errorMessage =
        typeof error === "string"
          ? error
          : (error as any)?.message || String(error);
    } else if (firstCommitError) {
      errorMessage =
        typeof firstCommitError === "string"
          ? firstCommitError
          : (firstCommitError as any)?.message || String(firstCommitError);
    }

    console.error("Error:", error || firstCommitError);
    return (
      <div className="error-container">
        <div className="error-text">
          <div className="error-title">{errorMessage}</div>
          <div className="error-suggestion">
            Make sure you're on a GitHub repository page with commit history.
          </div>
        </div>
      </div>
    );
  }

  if (!isGithub) {
    return (
      <div className="error-container">
        <div className="error-text">
          <div className="error-title">
            This doesn't seem to be a GitHub repository page
          </div>
          <div className="error-suggestion">
            Navigate to a GitHub repository page to view the first commit.
          </div>
        </div>
      </div>
    );
  }

  if (!firstCommit) {
    return (
      <div className="error-container">
        <div className="error-text">
          <div className="error-title">
            Sorry, I couldn't find the first commit :(
          </div>
        </div>
        <div className="error-suggestion">
          This repository might be empty or have an unusual commit history.
        </div>
      </div>
    );
  }

  return (
    <div className="firstcommit">
      <div className="header-block">
        <div className="commit-line">
          <span className="commit-label">Commit</span>
          <a href={firstCommit.html_url} target="_blank" className="commit-hash">
            {firstCommit.sha}
          </a>
        </div>
        <div className="author-line">
          <span className="author-label">Author: </span>
          <span className="author-info">
            {firstCommit.commit.author.name} &lt;{firstCommit.commit.author.email}
            &gt;
          </span>
        </div>
        <div className="date-line">
          <span className="date-label">Date: </span>
          <span className="date-info">
            {new Date(firstCommit.commit.author.date).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
              },
            )}
          </span>
        </div>
      </div>
      <div className="message-container">
        <div className="message-text">{firstCommit.commit.message}</div>
      </div>
    </div>
  );
}

export default App;
