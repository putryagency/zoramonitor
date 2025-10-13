export default async function handler(req, res) {
  const ZORA_API = "https://api.zora.co/universal/graphql";

  // Format universal body HARUS JSON string dengan hash & variables
  const body = {
    hash: "c2b3a1f16014905782a54053dc5a0aa4", // ini hash query resmi Zora Explore
    variables: {
      first: 22,
      listType: "NEW_CREATORS",
    },
    operationName: "TabsQueriesProvider_ExploreQuery",
  };

  try {
    const response = await fetch(ZORA_API, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    // Coba parse JSON
    try {
      const data = JSON.parse(text);
      if (data.errors) {
        console.error("Zora GraphQL error:", data.errors);
        return res.status(400).json({ error: data.errors });
      }
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(data);
    } catch {
      console.error("Non-JSON response:", text);
      return res.status(400).send(text);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: error.message });
  }
}
