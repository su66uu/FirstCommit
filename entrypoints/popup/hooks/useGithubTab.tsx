import { useState, useEffect } from "react";

export default function useGithubTab() {
  const [isGithub, setIsGithub] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);

  function parseGithubUrl(url: string) {
    const githubUri = url.replace("https://github.com/", "");
    if (!githubUri) {
      return {
        username: "",
        repo: "",
      };
    }

    const splits = githubUri.split("/");
    return {
      username: splits[0],
      repo: splits[1],
    };
  }

  useEffect(() => {
    const checkCurrentTab = async () => {
      setError(null);
      try {
        setIsLoading(true);
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        setIsLoading(false);

        if (!tabs) {
          setIsGithub(false);
          setGithubUrl(null);
          return;
        }

        if (
          tabs &&
          tabs.length > 0 &&
          tabs[0].url &&
          tabs[0].url.toLowerCase().includes("github.com")
        ) {
          const url = tabs[0].url;
          setIsGithub(true);
          setGithubUrl(url);
          const { username, repo } = parseGithubUrl(url);
          setUsername(username);
          setRepo(repo);
        } else {
          setIsGithub(false);
          setGithubUrl(null);
        }
      } catch (error: any) {
        console.error("Unable to fetch the current tab details", error.message);
        setError(error);
      }
    };

    checkCurrentTab();
  }, []);

  return {
    isLoading,
    isGithub,
    error,
    githubUrl,
    username,
    repo,
  };
}
