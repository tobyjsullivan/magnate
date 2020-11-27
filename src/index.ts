import express from 'express';
import ApiHandlerFactory from './api/ApiHandler';
import Blocks from './geography/Blocks';
import Initializer from './Initializer';
import Neighbourhoods from './geography/Neighbourhoods';
import Lots from './property/Lots';
import Streets from './geography/Streets';
import GeographyService from './geography/GeographyService';
import PropertyService from './property/PropertyService';
import ConstructionWorker from './workers/ConstructionWorker';
import Worker from './workers/Worker';
import SellerAgentWorker from './workers/SellerAgentWorker';
import ListingService from './property/ListingService';
import Listings from './property/Listings';
import LandTitleRegistry from './property/LandTitleRegistry';
import EntityResultFactory from './api/EntityResultFactory';
import PlayerService from './players/PlayerService';
import Players from './players/Players';

const PORT = 18237;

const neighbourhoods = new Neighbourhoods();
const streets = new Streets();
const blocks = new Blocks();
const lots = new Lots();
const listings = new Listings();
const players = new Players();

const geographySvc = new GeographyService(neighbourhoods, streets, blocks);
const propertySvc = new PropertyService(lots, geographySvc);
const listingSvc = new ListingService(listings);
const playerSvc = new PlayerService(players);
const landTitleRegistry = new LandTitleRegistry();

const entityResultFactory = new EntityResultFactory(geographySvc, propertySvc, playerSvc, landTitleRegistry);
const apiHandlerFactory = new ApiHandlerFactory(geographySvc, propertySvc, listingSvc, playerSvc, entityResultFactory);

const initializer = new Initializer(geographySvc, playerSvc);

const constructionWorker: Worker = new ConstructionWorker(geographySvc, propertySvc);
const sellerAgentWorker: Worker = new SellerAgentWorker(propertySvc, listingSvc, landTitleRegistry);

async function main() {
  // Load initial data
  await initializer.init();

  const app = express();
  app.post('/graphql', apiHandlerFactory.buildHandler());

  constructionWorker.startLoop();
  sellerAgentWorker.startLoop();

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();
