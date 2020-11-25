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

const PORT = 18237;

async function main() {
  const neighbourhoods = new Neighbourhoods();
  const streets = new Streets();
  const blocks = new Blocks();
  const properties = new Properties();

  const geographySvc = new GeographyService(neighbourhoods, streets, blocks);
  const propertySvc = new PropertyService(properties, geographySvc);

  // Load initial data
  const initializer = new Initializer(geographySvc, propertySvc);
  await initializer.init();

  const app = express();
  app.post('/graphql', buildHandler(geographySvc, propertySvc));

  const constructionWorker: Worker = new ConstructionWorker(geographySvc, propertySvc);
  constructionWorker.startLoop();

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();
