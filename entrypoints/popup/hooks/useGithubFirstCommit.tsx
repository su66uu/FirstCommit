import { useEffect, useState } from "react";
import useGithubRepo from "./useGithubRepo";
import { getFirstCommit } from "../github";

interface Props {
  repo: string;
  owner: string;
  options?: {
    enabled?: boolean;
  };
}

export interface GithubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    login: string;
  };
}

interface UseGithubFirstCommitResponse {
  isLoading: boolean;
  firstCommit: GithubCommit | null;
  error: string | null;
}

const DEFAULT_BRANCH = "main";

export default function useGithubFirstCommit(
  props: Props,
): UseGithubFirstCommitResponse {
  const { repo, owner, options } = props;
  const enabled = options?.enabled ?? true;
  const [isLoading, setIsLoading] = useState(false);
  const [firstCommit, setFirstCommit] = useState<GithubCommit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    repo: githubRepo,
    isLoading: repoLoading,
    error: repoError,
  } = useGithubRepo(
    {
      username: enabled && repo && owner ? owner : null,
      repoName: enabled && repo && owner ? repo : null,
    },
    {
      enabled: enabled && !!repo && !!owner,
    },
  );
  const branch = githubRepo?.default_branch || DEFAULT_BRANCH;

  function handleError(err: any) {
    console.error("Error fetching first commit:", err);
    switch (err.status) {
      case 403:
        setError("API rate limit exceeded. Please try again later.");
        break;
      case 404:
        setError("Repository or branch not found.");
        break;
      default:
        setError(err.message || "An unknown error occurred.");
    }
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!repo || !owner) {
      return;
    }

    if (repoLoading) {
      return;
    }

    if (!githubRepo) {
      return;
    }

    const fetchFirstCommit = async () => {
      try {
        const defaultBranch = githubRepo.default_branch || DEFAULT_BRANCH;
        const firstCommit = await getFirstCommit(owner, repo, defaultBranch);
        setFirstCommit(firstCommit);
      } catch (err: any) {
        console.error("Error fetching first commit:", err);
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    setError(null);
    setFirstCommit(null);

    fetchFirstCommit();
  }, [repo, owner, branch, githubRepo, repoLoading]);

  if (!enabled) {
    return {
      isLoading: false,
      firstCommit: null,
      error: null,
    };
  }

  if (!repo || !owner) {
    return {
      isLoading: false,
      firstCommit: null,
      error: "Repository and owner must be provided.",
    };
  }

  return {
    isLoading: isLoading || repoLoading,
    firstCommit,
    error: repoError || error,
  };
}
