import RiotApiService from './services/RiotApiService.js';
import BuildGenerator from './models/BuildGenerator.js';
import BuildView from './views/BuildView.js';
import AramController from './controllers/AramController.js';

const apiService = new RiotApiService();
const buildGenerator = new BuildGenerator(apiService);
const view = new BuildView();
const controller = new AramController(apiService, buildGenerator, view);

controller.start();
