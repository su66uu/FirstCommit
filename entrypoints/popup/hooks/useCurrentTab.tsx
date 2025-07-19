import { useState, useEffect } from "react";

export default function useIsGithubTab() {
  const [isGithub, setIsGithub] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);

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

        if (tabs && tabs.length > 0 && tabs[0].url) {
          const url = tabs[0].url;
          if (url.toLowerCase().includes("github.com")) {
            setIsGithub(true);
            setGithubUrl(url);
          } else {
            setIsGithub(false);
            setGithubUrl(null);
          }
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
  };
}
