// app.js — Realtime Zora New Creators Monitor

const statusEl = document.getElementById("status");
const container = document.getElementById("creators");

// Zora GraphQL endpoint (tanpa API key)
const ZORA_API = "https://api.zora.co/universal/graphql";

// GraphQL query untuk ambil creator baru
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
}
`;

// Fungsi ambil data dari Zora
async function fetchCreators() {
  try {
    statusEl.textContent = "🔄 Fetching new creators...";
    const res = await fetch(ZORA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const json = await res.json();
    const creators = json?.data?.exploreList?.edges?.map(e => e.node) || [];
    renderCreators(creators);
    statusEl.textContent = `✅ Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    statusEl.textContent = `❌ Error: ${err.message}`;
  }
}

// Fungsi tampilkan data ke HTML
function renderCreators(creators) {
  container.innerHTML = "";
  creators.forEach(c => {
    const img = c.mediaContent?.downloadableUri || "https://placehold.co/100x100";
    const display = c.creatorProfile?.displayName || c.creatorProfile?.handle || "Unknown";
    const twitter = c.creatorProfile?.socialAccounts?.twitter;
    const twText = twitter
      ? `@${twitter.username} (${twitter.followerCount} followers)`
      : "No Twitter linked";

    const card = document.createElement("div");
    card.className = "creator-card";
    card.innerHTML = `
      <img src="${img}" alt="${display}" class="avatar" />
      <div class="creator-info">
        <h3>${display}</h3>
        <p>${twText}</p>
        <p>💰 Market Cap: $${parseFloat(c.marketCap || 0).toLocaleString()}</p>
        <a href="https://basedbot.io/trade/${c.address}" target="_blank" class="trade-btn">Trade Now</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Jalankan realtime update tiap 2 detik
setInterval(fetchCreators, 2000);
fetchCreators();
