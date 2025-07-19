import { useState } from "react";
import "./App.css";

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isGithub, setIsGithub] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCurrentTab = async () => {
      setCurrentUrl(null);
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
          setCurrentUrl(url);
          setIsGithub(url.toLowerCase().includes("github.com"));
        } else {
          setCurrentUrl("No active tab URL found.");
          setIsGithub(false);
        }
      } catch (error: any) {
        console.error("Unable to fetch the current tab details", error.message);
      }
    };

    checkCurrentTab();
  }, []);

  if (isLoading) {
    return <div>Loading tab information...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return <>{isGithub ? "This is Github" : "Not Github"}</>;
}

export default App;
