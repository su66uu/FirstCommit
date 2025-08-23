export const getCommitsNumber = async (
  author: string,
  repo: string,
  branch: string,
) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${author}/${repo}/commits?sha=${branch}&per_page=1&page=1`,
      {
        method: "HEAD",
        headers: {
          Accept: "application/vnd.github+json",
          "X-Github-Api-Version": "2022-11-28",
        },
      },
    );

    const linkHeader = response.headers.get("Link");
    const lastLink = linkHeader?.match(/<[^>]+>; rel="last"/);

    if (lastLink) {
      const totalPages = parseInt(lastLink[0].match(/&page=(\d+)/)![1], 10);
      return totalPages;
    } else {
      return 1;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFirstCommit = async (owner: string, repo: string, branch: string) => {
  try {
    // This request gives the total number of commits in the branch
    const commitsCount = await getCommitsNumber(owner, repo, branch);
    if (commitsCount === 0) {
      return null;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1&page=${commitsCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          "X-Github-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching commits: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

