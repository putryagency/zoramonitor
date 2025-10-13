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
    const img =
      c.mediaContent?.downloadableUri ||
      c.creatorProfile?.avatar?.downloadableUri ||
      "https://placehold.co/200x200?text=No+Image";

    const profile = c.creatorProfile || {};
    const name = profile.displayName || profile.handle || "Unknown";
    const socials = profile.socialAccounts || {};

    // Build social links
    const socialHTML = [
      socials.twitter
        ? `<a href="https://twitter.com/${socials.twitter.username}" target="_blank">🐦 ${socials.twitter.username} (${socials.twitter.followerCount} followers)</a>`
        : "",
      socials.tiktok
        ? `<a href="https://www.tiktok.com/@${socials.tiktok.username}" target="_blank">🎵 ${socials.tiktok.username}</a>`
        : "",
      socials.instagram
        ? `<a href="https://instagram.com/${socials.instagram.username}" target="_blank">📸 ${socials.instagram.username}</a>`
        : "",
      socials.farcaster
        ? `<a href="https://warpcast.com/${socials.farcaster.username}" target="_blank">🪩 ${socials.farcaster.username}</a>`
        : "",
    ]
      .filter(Boolean)
      .join("<br>");

    const card = document.createElement("div");
    card.className = "creator-card";
    card.innerHTML = `
      <img src="${img}" class="avatar" />
      <h3>${name}</h3>
      <p>💰 Market Cap: $${parseFloat(c.marketCap || 0).toLocaleString()}</p>
      <div class="socials">${socialHTML || "<em>No social linked</em>"}</div>
      <a href="https://t.me/based_eth_bot?start=r_Agusdarurat/${c.address}" target="_blank" class="trade-btn">🚀 Trade Now</a>
    `;

    container.appendChild(card);
  });
}

setInterval(fetchCreators, 2000);
fetchCreators();
