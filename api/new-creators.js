export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.zora.co/universal/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.ZORA_API_KEY, // taruh token kamu di Vercel ENV
      },
      body: JSON.stringify({
        hash: "c2b3a1f16014905782a54053dc5a0aa4",
        variables: { first: 5, listType: "MOST_RECENT_CREATORS" },
        operationName: "TabsQueriesProvider_ExploreQuery",
      }),
    });

    const json = await response.json();
    const creators = json?.data?.list?.nodes?.map(c => ({
      name: c.creator?.name || "Unknown",
      username: c.creator?.username || "anon",
      avatar: c.creator?.profileImage?.url || "/default.png",
      followers: c.creator?.followersCount || 0,
      tradeLink: `https://basedbot.io/trade/${c.creator?.address}`,
    })) || [];

    res.status(200).json(creators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch creators" });
  }
}
