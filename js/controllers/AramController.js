import BuildController from './BuildController.js';

export default class AramController extends BuildController {
  refreshBuild() {
    const championTypeFilter = this.view.championTypeSelect.value;
    this.view.roleDisplay.innerText = "Mode : ARAM";

    const newBuild = this.buildGenerator.generateFullBuild("aram", championTypeFilter);
    this.view.renderBuild(newBuild, this.apiService.getCurrentPatch());

    this._saveToHistory(newBuild, "aram", this.apiService.getCurrentPatch());
    this.view.renderHistory(this._loadHistory());
  }
}
