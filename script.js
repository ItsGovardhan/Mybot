const BOT_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1565576697028419584&permissions=1649539214400&integration_type=0&scope=bot+applications.commands";

const commandExamples = {
  giveaways: [
    { command: '.giveaway create 1d "Nitro" 1', description: "Start a one-day giveaway with one winner.", tag: "CREATE" },
    { command: ".giveaway end <message_id>", description: "End a giveaway early and draw its winner.", tag: "END" },
    { command: ".giveaway reroll <message_id> [winners]", description: "Pick a fresh winner for a finished giveaway.", tag: "REROLL" },
  ],
  community: [
    { command: "/messages user", description: "Check your message stats or look up a member.", tag: "SLASH" },
    { command: "/messages leaderboard", description: "See the server's top 10 chatters.", tag: "SLASH" },
    { command: ".messages lb [daily|weekly|monthly|total]", description: "Browse the message leaderboard by period.", tag: "PREFIX" },
    { command: ".messages add @member 100 [all|daily|weekly|monthly|total]", description: "Add messages to a member's counters.", tag: "STAFF" },
    { command: ".messages remove @member 100 [all|daily|weekly|monthly|total]", description: "Remove messages from a member's counters.", tag: "STAFF" },
  ],
};

const commandList = document.querySelector("#command-list");
const commandTabs = document.querySelectorAll(".command-tab");
const toast = document.querySelector("#toast");
let toastTimeout;

function renderCommands(category) {
  commandList.replaceChildren(...commandExamples[category].map(({ command, description, tag }) => {
    const row = document.createElement("div");
    row.className = "command-row";

    const code = document.createElement("code");
    code.textContent = command;

    const detail = document.createElement("p");
    detail.textContent = description;

    const label = document.createElement("span");
    label.className = "command-tag";
    label.textContent = tag;

    row.append(code, detail, label);
    return row;
  }));
}

commandTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    commandTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderCommands(tab.dataset.category);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 4500);
}

document.querySelectorAll(".invite-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (!BOT_INVITE_URL) {
      showToast("Add your Discord bot invite URL in website/script.js, in the BOT_INVITE_URL setting at the top.");
      return;
    }

    let inviteUrl;
    try {
      inviteUrl = new URL(BOT_INVITE_URL);
    } catch {
      showToast("The bot invite URL in website/script.js is not a valid URL.");
      return;
    }

    if (inviteUrl.protocol !== "https:" || !["discord.com", "discordapp.com"].includes(inviteUrl.hostname)) {
      showToast("Use an HTTPS Discord OAuth2 invite URL in website/script.js.");
      return;
    }

    window.open(inviteUrl.href, "_blank", "noopener,noreferrer");
  });
});

const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const sections = document.querySelectorAll("#home, #features, #commands, #terms, #policy");
const navLinks = document.querySelectorAll(".nav-link");
const observer = new IntersectionObserver((entries) => {
  const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!current) return;
  navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${current.target.id}`));
}, { rootMargin: "-15% 0px -70% 0px", threshold: [0, .1, .5] });
sections.forEach((section) => observer.observe(section));

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
if (commandList) renderCommands("giveaways");
