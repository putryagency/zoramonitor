export default async function handler(req, res) {
  const ZORA_API = "https://api.zora.co/universal/graphql";

  // Query dari explorer (listType: NEW_CREATORS)
  const body = {
    query: `
      query TabsQueriesProvider_ExploreQuery($first: Int, $listType: ExploreListType!) {
        exploreList(first: $first, listType: $listType) {
          edges {
            node {
              __typename
              ... on GraphQLZora20CreatorToken {
                address
                createdAt
                marketCap
                mediaContent {
                  ... on GraphQLMediaImage {
                    downloadableUri
                  }
                }
                creatorProfile {
                  displayName
                  handle
                  socialAccounts {
                    twitter {
                      username
                      followerCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      first: 10,
      listType: "NEW_CREATORS",
    },
    operationName: "TabsQueriesProvider_ExploreQuery",
  };

  try {
    const response = await fetch(ZORA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.errors) {
        console.error("Zora GraphQL error:", data.errors);
        return res.status(400).json({ error: data.errors });
      }
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(data);
    } catch {
      // Jika response bukan JSON valid
      console.error("Non-JSON response:", text);
      return res.status(400).send(text);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
}
