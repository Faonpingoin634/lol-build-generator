const HISTORY_KEY = "lol-build-history";
const HISTORY_MAX = 5;

export default class BuildController {
  constructor(apiService, buildGenerator, view) {
    this.apiService = apiService;
    this.buildGenerator = buildGenerator;
    this.view = view;

    this.view.refreshButton.addEventListener("click", () => this.refreshBuild());
    this.view.shareButton.addEventListener("click", () => this.shareBuild());
  }

  async start() {
    this.view.showLoading();
    try {
      await this.apiService.initialize();
      this.view.renderHistory(this._loadHistory());
      this.refreshBuild();
    } catch (error) {
      this.view.showError(
        "Impossible de charger les données. Vérifiez votre connexion et rechargez la page.",
      );
    }
  }

  refreshBuild() {
    const selectedRole = this.view.roleSelect.value;
    const championTypeFilter = this.view.championTypeSelect.value;

    let role = selectedRole;
    let displayRole;

    if (selectedRole === "aleatoire") {
      const availableRoles = ["top", "jungle", "mid", "adc", "support"];
      role = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      const roleName = role.charAt(0).toUpperCase() + role.slice(1);
      displayRole = `Rôle : ${roleName} (Aléatoire)`;
    } else {
      const roleText =
        this.view.roleSelect.options[this.view.roleSelect.selectedIndex].text;
      displayRole = `Rôle : ${roleText}`;
    }

    this.view.roleDisplay.innerText = displayRole;

    const newBuild = this.buildGenerator.generateFullBuild(role, championTypeFilter);
    this.view.renderBuild(newBuild, this.apiService.getCurrentPatch());

    this._saveToHistory(newBuild, role, this.apiService.getCurrentPatch());
    this.view.renderHistory(this._loadHistory());
  }

  async shareBuild() {
    try {
      const canvas = await html2canvas(this.view.captureZone, {
        backgroundColor: "#1a1a1a",
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "mon-build-lol.png";
      link.click();
    } catch (error) {
      this.view.showError(
        "La capture d'écran a échoué. Réessayez dans quelques instants.",
      );
    }
  }

  _saveToHistory(build, role, currentPatch) {
    const champion = build.championAndSpells.champion;
    const entry = {
      role,
      championName: champion.name,
      championId: champion.id,
      patch: currentPatch,
      items: build.inventory.map((item) => ({
        name: item.name,
        imageFile: item.image.full,
        price: item.gold.total,
      })),
      timestamp: Date.now(),
    };

    const history = this._loadHistory();
    history.unshift(entry);
    if (history.length > HISTORY_MAX) history.pop();

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_) {
      // localStorage unavailable, history not saved
    }
  }

  _loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }
}
