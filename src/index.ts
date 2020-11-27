import express from 'express';
import { buildHandler } from './api/ApiHandler';

import Blocks from './geography/Blocks';
import Initializer from './Initializer';
import Neighbourhoods from './geography/Neighbourhoods';
import Properties from './property/Properties';
import Streets from './geography/Streets';
import GeographyService from './geography/GeographyService';
import PropertyService from './property/PropertyService';
import ConstructionWorker from './workers/ConstructionWorker';
import Worker from './workers/Worker';
import SellerAgentWorker from './workers/SellerAgentWorker';
import ListingService from './property/ListingService';
import Listings from './property/Listings';
import LandTitleRegistry from './property/LandTitleRegistry';

const PORT = 18237;

const neighbourhoods = new Neighbourhoods();
const streets = new Streets();
const blocks = new Blocks();
const properties = new Properties();
const listings = new Listings();

const geographySvc = new GeographyService(neighbourhoods, streets, blocks);
const propertySvc = new PropertyService(properties, geographySvc);
const listingSvc = new ListingService(listings);
const landTitleRegistry = new LandTitleRegistry();

const initializer = new Initializer(geographySvc, propertySvc);

const constructionWorker: Worker = new ConstructionWorker(geographySvc, propertySvc);
const sellerAgentWorker: Worker = new SellerAgentWorker(propertySvc, listingSvc, landTitleRegistry);

async function main() {
  // Load initial data
  await initializer.init();

  const app = express();
  app.post('/graphql', buildHandler(geographySvc, propertySvc, listingSvc));

  constructionWorker.startLoop();
  sellerAgentWorker.startLoop();

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();
