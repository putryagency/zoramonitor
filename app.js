async function fetchCreators() {
  const statusEl = document.getElementById("status");
  const container = document.getElementById("creators");
  
  try {
    statusEl.textContent = "🔄 Fetching new creators...";
    const res = await fetch("/api/new-creators");
    if (!res.ok) throw new Error("API error: " + res.status);
    
    const data = await res.json();
    container.innerHTML = "";
    
    if (data.length === 0) {
      container.innerHTML = "<p>No new creators yet...</p>";
    } else {
      data.forEach(c => {
        const div = document.createElement("div");
        div.className = "creator";
        div.innerHTML = `
          <img src="${c.avatar}" alt="${c.name}">
          <strong>${c.name}</strong> (@${c.username})<br>
          Followers: ${c.followers}<br>
          <button onclick="window.open('${c.tradeLink}', '_blank')">Trade Now</button>
        `;
        container.appendChild(div);
      });
    }

    statusEl.textContent = "✅ Updated " + new Date().toLocaleTimeString();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Error fetching creators";
  }
}

setInterval(fetchCreators, 1000);
fetchCreators();
