import { useState } from "react";
import "./App.css";

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isGithub, setIsGithub] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <h1>Hello</h1>
    </>
  );
}

export default App;
