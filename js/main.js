import RiotApiService from './services/RiotApiService.js';
import BuildGenerator from './models/BuildGenerator.js';
import BuildView from './views/BuildView.js';
import BuildController from './controllers/BuildController.js';

const apiService = new RiotApiService();
const buildGenerator = new BuildGenerator(apiService);
const view = new BuildView();
const controller = new BuildController(apiService, buildGenerator, view);

controller.demarrer();