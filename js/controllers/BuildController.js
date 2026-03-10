export default class BuildController {
  constructor(apiService, buildGenerator, view) {
    this.apiService = apiService;
    this.buildGenerator = buildGenerator;
    this.view = view;

    this.view.boutonRelancer.addEventListener("click", () =>
      this.relancerLeBuild(),
    );
    this.view.boutonPartager.addEventListener("click", () =>
      this.partagerLeBuild(),
    );
  }

  async demarrer() {
    this.view.afficherChargement();
    await this.apiService.initialiser();
    this.relancerLeBuild();
  }

  relancerLeBuild() {
    const roleChoisi = this.view.selectRole.value;

    if (roleChoisi === "aleatoire") {
      const rolesPossibles = ["top", "jungle", "mid", "adc", "support"];
      const roleSecret =
        rolesPossibles[Math.floor(Math.random() * rolesPossibles.length)];
      const nouveauBuild = this.buildGenerator.genererBuildComplet(roleSecret);

      const nomRole = roleSecret.charAt(0).toUpperCase() + roleSecret.slice(1);
      this.view.affichageRole.innerText = `Rôle : ${nomRole} (Aléatoire)`;

      this.view.afficherBuild(nouveauBuild, this.apiService.getPatchActuel());
    } else {
      const texteRole =
        this.view.selectRole.options[this.view.selectRole.selectedIndex].text;
      this.view.affichageRole.innerText = `Rôle : ${texteRole}`;

      const nouveauBuild = this.buildGenerator.genererBuildComplet(roleChoisi);
      this.view.afficherBuild(nouveauBuild, this.apiService.getPatchActuel());
    }
  }

  async partagerLeBuild() {
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
      console.error(error);
    }
  }
}