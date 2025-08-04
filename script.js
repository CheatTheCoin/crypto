// ==== CHEAT SIGNAL LOGIC FUNCTION ====
function getCheatSignal(btc, gold, eth, sol) {
  if (btc <= -2) {
    if (gold >= 1.5) {
      return {
        title: "STRONG BUY",
        color: "green",
        text: "Whales moving to safety. BTC is on sale. Smart money buys while others panic.",
      };
    } else {
      return {
        title: "BUY",
        color: "green",
        text: "Market is shaking out weak hands. Good chance to stack sats calmly.",
      };
    }
  } else {
    if (gold >= 1.5) {
      return {
        title: "WARNING",
        color: "yellow",
        text: "Big players are parking money in gold. They might dump BTC soon – wait for the shake.",
      };
    } else if (eth >= 1.5 && sol >= 1.5) {
      return {
        title: "ALTCOIN BUY/HOLD",
        color: "blue",
        text: "Altcoins are waking up. ETH and SOL are moving while BTC chills.",
      };
    } else {
      return {
        title: "HOLD",
        color: "gray",
        text: "No big moves. Best move is patience – stay calm and hold.",
      };
    }
  }
}

// ==== NOTIFICATION PERMISSION ====
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let lastSignalTitle = "";

// ==== FUNCTION TO ADD SIGNAL TO HISTORY ====
function addSignalToHistory(signal) {
  let history = JSON.parse(localStorage.getItem("cheatSignalHistory")) || [];
  const timestamp = new Date().toLocaleString();
  history.unshift({ time: timestamp, title: signal.title, color: signal.color });
  if (history.length > 20) history.pop();
  localStorage.setItem("cheatSignalHistory", JSON.stringify(history));
  renderHistory(history);
}

// ==== RENDER HISTORY (LIMIT TO 3 DISPLAYED) ====
function renderHistory(history) {
  const container = document.getElementById("signal-history");
  container.innerHTML = "";
  history.slice(0, 3).forEach((s) => {
    const div = document.createElement("div");
    div.style.background = s.color;
    div.style.padding = "8px";
    div.style.margin = "5px 0";
    div.style.borderRadius = "6px";
    div.textContent = `${s.time} – ${s.title}`;
    container.appendChild(div);
  });
}

// ==== FETCH DATA AND UPDATE DASHBOARD ====
function fetchData() {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,pax-gold&vs_currencies=usd&include_24hr_change=true")
    .then((res) => res.json())
    .then((data) => {
      const btcChange = data.bitcoin.usd_24h_change;
      const goldChange = data["pax-gold"].usd_24h_change;
      const ethChange = data.ethereum.usd_24h_change;
      const solChange = data.solana.usd_24h_change;

      // Update Prices
      document.getElementById("btc-price").textContent = `$${data.bitcoin.usd.toLocaleString()}`;
      document.getElementById("btc-change").textContent = `${btcChange.toFixed(2)}%`;
      document.getElementById("btc-change").style.color = btcChange >= 0 ? "lightgreen" : "red";

      document.getElementById("eth-price").textContent = `$${data.ethereum.usd.toLocaleString()}`;
      document.getElementById("eth-change").textContent = `${ethChange.toFixed(2)}%`;
      document.getElementById("eth-change").style.color = ethChange >= 0 ? "lightgreen" : "red";

      document.getElementById("sol-price").textContent = `$${data.solana.usd.toLocaleString()}`;
      document.getElementById("sol-change").textContent = `${solChange.toFixed(2)}%`;
      document.getElementById("sol-change").style.color = solChange >= 0 ? "lightgreen" : "red";

      document.getElementById("gold-price").textContent = `$${data["pax-gold"].usd.toLocaleString()}`;
      document.getElementById("gold-change").textContent = `${goldChange.toFixed(2)}%`;
      document.getElementById("gold-change").style.color = goldChange >= 0 ? "lightgreen" : "red";

      // Get signal
      const signal = getCheatSignal(btcChange, goldChange, ethChange, solChange);

      // Update Signal Box with CHEAT logo
      const box = document.getElementById("cheat-signal-box");
      box.innerHTML = `
        <div style="background:${signal.color}; padding:15px; border-radius:10px; margin-bottom:15px;">
          <img src="icons/cheat-icon-192.png" style="width:48px; margin-bottom:8px;" alt="CHEAT Logo" />
          <h2>${signal.title}</h2>
          <p>${signal.text}</p>
          <p style="font-size:12px; font-style:italic; margin-top:5px;">
            Never buy more than 20–30% at once. Keep funds for more dips.
          </p>
        </div>
      `;

      // Check if signal changed
      if (signal.title !== lastSignalTitle) {
        lastSignalTitle = signal.title;
        addSignalToHistory(signal);

        if (Notification.permission === "granted" && signal.title !== "HOLD") {
          new Notification(`CHEAT Signal: ${signal.title}`, { body: signal.text });
        }
      }
    });
}

// Fetch every 60 seconds
setInterval(fetchData, 60000);
fetchData();

// Render history on load
renderHistory(JSON.parse(localStorage.getItem("cheatSignalHistory")) || []);
