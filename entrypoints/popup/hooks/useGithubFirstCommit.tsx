import { useEffect, useState } from "react";
import useGithubRepo from "./useGithubRepo";

interface Props {
  repo: string;
  owner: string;
  branch?: string;
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

export default function useGithubFirstCommit(
  props: Props,
): UseGithubFirstCommitResponse {
  const { repo, owner, branch = "main", options } = props;
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

  const fetchCommits = async (
    since: string | null,
    until: string | null,
  ): Promise<GithubCommit[]> => {
    try {
      const params = new URLSearchParams({ per_page: "100" });
      if (since) {
        params.append("since", since);
      }

      if (until) {
        params.append("until", until);
      }

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?${params.toString()}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          "X-Github-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching commits: ${response.statusText}`);
      }
      return response.json();
    } catch (err: any) {
      console.error("Error fetching commits:", err);
      throw err;
    }
  };

  const hasCommitsExistsBeforeRepoCreation = async (
    createdAt: string,
  ): Promise<boolean> => {
    const until = new Date(createdAt).toISOString();

    try {
      const commits = await fetchCommits(null, until);
      return commits.length > 0;
    } catch (err: any) {
      console.error("Error fetching commits before repo creation:", err);
      throw err;
    }
  };

  const daysInTime = (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  };

  const findFirstCommitCreatedBeforeRepoCreation = async (
    createdAt: string,
  ) => {
    let previousCommitsCount = 0;
    let allCommits: GithubCommit[] = [];

    const until = new Date(createdAt).toISOString();
    const dayBuffers = [2, 5, 10, 15, 20];
    for (const dayBuffer of dayBuffers) {
      const since = new Date(
        new Date(createdAt).getTime() - daysInTime(dayBuffer),
      ).toISOString();

      try {
        const commits = await fetchCommits(since, until);
        allCommits = commits;
        if (commits.length === previousCommitsCount && commits.length > 0) {
          break;
        }

        previousCommitsCount = commits.length;

        if (commits.length === 0) {
          break;
        }
      } catch (error) {
        console.error(
          `Error fetching commits for ${dayBuffer}-day buffer`,
          error,
        );
        throw error;
      }
    }

    if (allCommits.length === 0) {
      return null;
    }

    const sortedCommits = allCommits.sort((a: any, b: any) => {
      return (
        new Date(a.commit.author.date).getTime() -
        new Date(b.commit.author.date).getTime()
      );
    });

    return sortedCommits[0];
  };

  const findFirstCommitAfterRepoCreation = async (createdAt: string) => {
    let previousCommitsCount = 0;
    let allCommits: GithubCommit[] = [];

    const since = new Date(createdAt).toISOString();
    const dayBuffers = [2, 10, 20, 30];

    for (const dayBuffer of dayBuffers) {
      const until = new Date(
        new Date(createdAt).getTime() + daysInTime(dayBuffer),
      ).toISOString();

      try {
        const commits = await fetchCommits(since, until);

        allCommits = commits;

        if (commits.length === previousCommitsCount && commits.length > 0) {
          break;
        }

        previousCommitsCount = commits.length;
        if (commits.length > 0) {
          break;
        }
      } catch (error) {
        console.error(
          `Error fetching commits for ${dayBuffer}-day buffer after creation`,
          error,
        );
        throw error;
      }
    }

    if (allCommits.length === 0) {
      return null;
    }

    const sortedCommits = allCommits.sort((a: any, b: any) => {
      return (
        new Date(a.commit.author.date).getTime() -
        new Date(b.commit.author.date).getTime()
      );
    });

    return sortedCommits[0];
  };

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
        const hasCommitsBeforeCreation =
          await hasCommitsExistsBeforeRepoCreation(githubRepo.created_at);

        if (hasCommitsBeforeCreation) {
          const firstCommit = await findFirstCommitCreatedBeforeRepoCreation(
            githubRepo.created_at,
          );
          setFirstCommit(firstCommit);
        } else {
          const firstCommit = await findFirstCommitAfterRepoCreation(
            githubRepo.created_at,
          );
          setFirstCommit(firstCommit);
        }
      } catch (err: any) {
        console.error("Error fetching first commit:", err);
        setError(err.message);
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
