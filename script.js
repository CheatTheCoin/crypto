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

// ==== FETCH DATA AND UPDATE DASHBOARD ====
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,pax-gold&vs_currencies=usd&include_24hr_change=true")
  .then((res) => res.json())
  .then((data) => {
    const btcChange = data.bitcoin.usd_24h_change;
    const goldChange = data["pax-gold"].usd_24h_change;
    const ethChange = data.ethereum.usd_24h_change;
    const solChange = data.solana.usd_24h_change;

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

    const signal = getCheatSignal(btcChange, goldChange, ethChange, solChange);
    const box = document.getElementById("cheat-signal-box");
    box.innerHTML = `
      <div style="background:${signal.color}; padding:15px; border-radius:10px; margin-bottom:15px;">
        <h2>${signal.title}</h2>
        <p>${signal.text}</p>
        <p style="font-size:12px; font-style:italic; margin-top:5px;">Never buy more than 20–30% at once. Keep funds for more dips.</p>
      </div>
    `;
  });
