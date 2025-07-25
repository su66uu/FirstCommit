interface Props {
  username: string | null;
  repoName: string | null;
}

interface GithubRepo {
  id: number;
  name: string;
  owner: {
    login: string;
    id: number;
  };
  descrinption: string;
  html_url: string;
  stargazers_count: number;
  created_at: string;
}

interface UseGithubResponse {
  repo: GithubRepo | null;
  isLoading: boolean;
  error: string | null;
}

export default function useGithubRepo(props: Props): UseGithubResponse {
  const { username, repoName } = props;
  const [repo, setRepo] = useState<GithubRepo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || !repoName) {
      setError("Please provide a valid username and repository name.");
      setRepo(null);
      return;
    }

    const fetchRepo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/repos/${username}/{repoName}`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.github+json",
              "X-Github-Api-Version": "2022-11-28",
            },
          },
        );

        if (!response.ok && response.status === 403) {
          const rateLimitRemaining = response.headers.get(
            "x-ratelimit-remaining",
          );
          if (rateLimitRemaining === "0") {
            throw new Error(
              "Github API rate limit exceeded for unauthenticated requests. Try again later.",
            );
          }
        }

        if (!response.ok && response.status === 404) {
          throw new Error(
            `Repository ${username}/${repoName} not found or is not public.`,
          );
        }

        const data: GithubRepo = await response.json();
        setRepo(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching repository details.",
        );
        setRepo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepo();
  }, [username, repoName]);


  return { repo, isLoading, error }
}
