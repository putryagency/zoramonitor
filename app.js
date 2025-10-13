const statusEl = document.getElementById("status");
const container = document.getElementById("creators");

async function fetchCreators() {
  try {
    statusEl.textContent = "🔄 Updating...";
    const res = await fetch("/api/new-creators", { cache: "no-store" });
    const json = await res.json();

    const creators = json?.data?.exploreList?.edges?.map(e => e.node) || [];
    renderCreators(creators);
    statusEl.textContent = `✅ Last update: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    statusEl.textContent = `❌ Error: ${err.message}`;
  }
}

function renderCreators(creators) {
  container.innerHTML = "";
  creators.forEach(c => {
    const img = c.mediaContent?.downloadableUri || "https://placehold.co/200";
    const display = c.creatorProfile?.displayName || c.creatorProfile?.handle || "Unknown";
    const twitter = c.creatorProfile?.socialAccounts?.twitter;
    const twText = twitter
      ? `@${twitter.username} (${twitter.followerCount} followers)`
      : "No Twitter linked";

    const card = document.createElement("div");
    card.className = "creator-card";
    card.innerHTML = `
      <img src="${img}" class="avatar" />
      <h3>${display}</h3>
      <p>${twText}</p>
      <p>💰 Market Cap: $${parseFloat(c.marketCap || 0).toLocaleString()}</p>
      <a href="https://basedbot.io/trade/${c.address}" target="_blank" class="trade-btn">Trade Now</a>
    `;
    container.appendChild(card);
  });
}

setInterval(fetchCreators, 2000);
fetchCreators();
