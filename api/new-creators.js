export default async function handler(req, res) {
  const ZORA_API = "https://api.zora.co/universal/graphql";

  const query = `
  {
    exploreList(listType: NEW_CREATORS, limit: 12) {
      edges {
        node {
          ... on GraphQLZora20CreatorToken {
            address
            marketCap
            createdAt
            mediaContent {
              ... on GraphQLMediaImage {
                downloadableUri
              }
            }
            creatorProfile {
              handle
              displayName
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
  }`;

  try {
    const response = await fetch(ZORA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
