async function fetchPrices() {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold,ethereum,solana&vs_currencies=usd&include_24hr_change=true";
  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      bitcoin: { price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
      paxg: { price: data["pax-gold"].usd, change: data["pax-gold"].usd_24h_change },
      ethereum: { price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
      solana: { price: data.solana.usd, change: data.solana.usd_24h_change }
    };
  } catch (err) {
    console.error("Villa:", err);
    return null;
  }
}

function updateElement(container, value) {
  const priceEl = container.querySelector(".price");
  const changeEl = container.querySelector(".change");
  if (!value) {
    priceEl.textContent = "N/A";
    changeEl.textContent = "";
    return;
  }
  priceEl.textContent = `$${value.price.toLocaleString()}`;
  changeEl.textContent = `${value.change.toFixed(2)}%`;
  changeEl.style.color = value.change >= 0 ? "#4caf50" : "#f44336";
}

async function updateDashboard() {
  const prices = await fetchPrices();
  if (!prices) return;
  const keys = ["bitcoin", "paxg", "ethereum", "solana"];
  const assets = document.querySelectorAll("#dashboard .asset");
  keys.forEach((key, i) => updateElement(assets[i], prices[key]));
}

updateDashboard();
setInterval(updateDashboard, 300000);
