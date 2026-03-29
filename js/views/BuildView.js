export default class BuildView {
  constructor() {
    this.championZone = document.getElementById("champion-zone");
    this.runesZone = document.getElementById("runes-zone");
    this.inventoryContainer = document.getElementById("inventory");
    this.tooltip = document.getElementById("tooltip");
    this.refreshButton = document.getElementById("btn-refresh");
    this.roleSelect = document.getElementById("select-role");
    this.championTypeSelect = document.getElementById("select-champion-type");
    this.shareButton = document.getElementById("btn-share");
    this.captureZone = document.getElementById("capture-zone");
    this.roleDisplay = document.getElementById("role-display");
    this.errorMessage = document.getElementById("error-message");
    this.historySection = document.getElementById("history-section");

    this._initTooltips();
  }

  showLoading() {
    this.championZone.innerHTML = "Chargement...";
    this.runesZone.innerHTML = "";
    this.inventoryContainer.innerHTML = "Chargement des objets...";
    this.errorMessage.style.display = "none";
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
    this.championZone.innerHTML = "";
    this.runesZone.innerHTML = "";
    this.inventoryContainer.innerHTML = "";
  }

  renderBuild(fullBuild, currentPatch) {
    this.errorMessage.style.display = "none";
    this._renderChampion(fullBuild.championAndSpells, currentPatch);
    this._renderRunes(fullBuild.runes);
    this._renderInventory(fullBuild.inventory, currentPatch);
  }

  renderHistory(history) {
    if (!history || history.length === 0) {
      this.historySection.style.display = "none";
      return;
    }

    this.historySection.style.display = "block";
    const baseUrl = "https://ddragon.leagueoflegends.com/cdn";

    this.historySection.innerHTML = `
      <h2 class="text-lol-gold text-base uppercase tracking-wide mb-2.5 text-center">Derniers builds</h2>
      <ul class="list-none p-0 m-0">
        ${history
          .map(
            (entry, index) => `
          <li class="bg-lol-card rounded-lg border border-[#333] mb-2 cursor-pointer transition-colors hover:border-lol-gold focus:border-lol-gold focus:outline-none"
              data-index="${index}" aria-expanded="false" tabindex="0" role="button"
              aria-label="Voir le build de ${entry.championName}">
            <div class="flex items-center gap-2 px-3 py-2">
              <figure class="m-0">
                <img src="${baseUrl}/${entry.patch}/img/champion/${entry.championId}.png"
                     alt="${entry.championName}"
                     class="w-9 h-9 rounded-full border border-lol-gold" />
              </figure>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-white">${entry.championName}</span>
                <span class="text-xs text-lol-gold">${entry.role.toUpperCase()}</span>
              </div>
              <span class="ml-auto text-lol-gold text-base" aria-hidden="true">▾</span>
            </div>
            <div class="history-items-panel flex flex-wrap gap-1.5 px-3 pt-2.5 pb-3 border-t border-[#333]" hidden>
              ${entry.items
                .map(
                  (item) => `
                <figure class="m-0 text-center w-[52px]">
                  <img src="${baseUrl}/${entry.patch}/img/item/${item.imageFile}"
                       alt="${item.name}"
                       title="${item.name} — ${item.price} PO"
                       class="w-11 h-11 border border-lol-gold rounded block" />
                  <figcaption class="text-[0.55rem] text-lol-muted mt-0.5 leading-tight line-clamp-2">${item.name}</figcaption>
                </figure>
              `,
                )
                .join("")}
            </div>
          </li>
        `,
          )
          .join("")}
      </ul>
    `;

    this.historySection.querySelectorAll("li[role='button']").forEach((card) => {
      const toggle = () => {
        const expanded = card.getAttribute("aria-expanded") === "true";
        card.setAttribute("aria-expanded", String(!expanded));
        card.querySelector(".history-items-panel").hidden = expanded;
        card.querySelector("span[aria-hidden]").textContent = expanded ? "▾" : "▴";
      };
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  _renderChampion({ champion, spells }, currentPatch) {
    this.championZone.innerHTML = `
      <img src="https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${champion.id}.png"
           class="w-20 h-20 border-2 border-lol-gold rounded-full cursor-pointer sprite-tooltip"
           alt="Portrait de ${champion.name}"
           data-title="${champion.name}"
           data-desc="${champion.blurb.replace(/"/g, "&quot;")}">
      <div class="flex flex-col gap-1">
        <img src="https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${spells[0].id}.png"
             class="w-9 h-9 border border-lol-gold rounded cursor-pointer sprite-tooltip"
             alt="Sort ${spells[0].name}"
             data-title="${spells[0].name}"
             data-desc="${spells[0].description}">
        <img src="https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${spells[1].id}.png"
             class="w-9 h-9 border border-lol-gold rounded cursor-pointer sprite-tooltip"
             alt="Sort ${spells[1].name}"
             data-title="${spells[1].name}"
             data-desc="${spells[1].description}">
      </div>
      <h2 class="ml-2.5">${champion.name}</h2>
    `;
  }

  _renderRunes(runes) {
    const baseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";
    const createRuneImg = (rune, isKeystone) => {
      const sizeClass = isKeystone
        ? "w-12 h-12 border-2 border-lol-gold"
        : "w-8 h-8 border border-[#888888]";
      return `<img src="${baseUrl}${rune.icon}"
                   class="${sizeClass} rounded-full bg-black cursor-pointer sprite-tooltip"
                   alt="Rune ${rune.name}"
                   data-title="${rune.name}"
                   data-desc="${rune.longDesc.replace(/"/g, "&quot;")}">`;
    };

    const primary = runes.primaryTree;
    const secondary = runes.secondaryTree;

    this.runesZone.innerHTML = `
      <div class="flex flex-col items-center gap-2">
        <img src="${baseUrl}${primary.data.icon}" class="w-6 h-6 mb-1" alt="Arbre ${primary.data.name}">
        ${createRuneImg(primary.runes[0], true)}
        ${createRuneImg(primary.runes[1], false)}
        ${createRuneImg(primary.runes[2], false)}
        ${createRuneImg(primary.runes[3], false)}
      </div>
      <div class="flex flex-col items-center gap-2 mt-8">
        <img src="${baseUrl}${secondary.data.icon}" class="w-6 h-6 mb-1" alt="Arbre ${secondary.data.name}">
        ${createRuneImg(secondary.runes[0], false)}
        ${createRuneImg(secondary.runes[1], false)}
      </div>
    `;
  }

  _renderInventory(inventory, currentPatch) {
    this.inventoryContainer.innerHTML = "";
    inventory.forEach((item) => {
      const img = document.createElement("img");
      img.src = `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${item.image.full}`;
      img.className = "w-16 h-16 border-2 border-lol-gold m-1 rounded cursor-pointer transition-transform hover:scale-110 hover:border-lol-gold-light sprite-tooltip";
      img.alt = `Objet : ${item.name}`;
      img.dataset.title = item.name;
      img.dataset.price = `Prix : ${item.gold.total} PO`;
      img.dataset.desc = item.description;
      this.inventoryContainer.appendChild(img);
    });
  }

  _initTooltips() {
    document.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("sprite-tooltip")) {
        this.tooltip.style.display = "block";
        this.tooltip.innerHTML = `<h4>${e.target.dataset.title}</h4>${e.target.dataset.price ? `<div class="price">${e.target.dataset.price}</div>` : ""}<div>${e.target.dataset.desc}</div>`;
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (this.tooltip.style.display === "block") {
        this.tooltip.style.left = e.pageX + 15 + "px";
        this.tooltip.style.top = e.pageY + 15 + "px";
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("sprite-tooltip")) {
        this.tooltip.style.display = "none";
      }
    });
  }
}
