import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon
} from "@turf/turf";
import type { IBoundary } from "../models/BoundaryModel";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { geocode } from "../lib/geocoder";
import { sleep } from "../lib";

type PolyOrMultiPolyFeature = Feature<Polygon> | Feature<MultiPolygon>;
type PolyOrMultiPolyCollection =
  | FeatureCollection<Polygon>
  | FeatureCollection<MultiPolygon>;

const DefaultNeighborhoodFilePath = path.join(
  __dirname,
  "..",
  "data",
  "boundary_data",
  "seattle",
  "original_data",
  "seattle_neighborhood_boundaries.geojson"
);

const DefaultDistrictFilePath = path.join(
  __dirname,
  "..",
  "data",
  "boundary_data",
  "seattle",
  "original_data",
  "seattle_district_boundaries.geojson"
);

const DefaultOutputPath = path.join(
  __dirname,
  "..",
  "data",
  "boundary_data",
  "seattle",
  "transformed",
  "seattle_neighborhood_boundaries-converted.json"
);

const NeighborhoodNameAttribute = "S_HOOD";
const DistrictNameAttribute = "L_HOOD";

const processArgv = async () => {
  const argv = await yargs(process.argv.slice(2))
    .option("neighborhood-file", {
      alias: "f",
      type: "string",
      default: DefaultNeighborhoodFilePath,
      describe: "Path to the neighborhood file, e.g., /app/data/my_file.json"
    })
    .option("district-file", {
      alias: "d",
      type: "string",
      default: DefaultDistrictFilePath,
      describe: "Path to the district file, e.g., /app/data/my_file.json"
    })
    .option("output-path", {
      alias: "o",
      type: "string",
      default: DefaultOutputPath,
      describe: "Path to save the output file to"
    })
    .option("number", {
      alias: "n",
      type: "number",
      default: 100,
      describe: "Number per batch"
    })
    .option("sleep", {
      alias: "s",
      type: "number",
      default: 0,
      describe: "Amount of time to sleep in milliseconds between batches"
    })
    .alias("h", "help")
    .help("help")
    .usage(`Usage: $0 [options]`)
    .epilogue(
      "Convert City of Seattle Neighborhood Map Atlas Neighborhoods" +
        "or Districts FeatureCollection into an array of JSON Boundary objects"
    ).argv;

  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  return argv;
};

// The same name is used for some features in the neighborhood file as is used in the "district" file. In general, it
// seems that what the city refers to as a "district" is actually what most people would consider to be the neighborhood
// boundary, so we are removing the neighborhood bounadry in favor of using the so called "district" version in the
// other file. The S_HOOD attribute being the same as L_HOOD seems to always indicate that this is a duplicate of a
// district bounadry. The district file only uses L_HOOD for it's names, so I guess we can surmise that L_HOOD is the
// same as district for all intents and purposes.
const removeDuplicateNeighborhoodNames = (
  neighborhoodFeatures: PolyOrMultiPolyFeature[]
) => {
  return neighborhoodFeatures.filter(
    (feature) => feature?.properties?.S_HOOD !== feature?.properties?.L_HOOD
  );
};

const fixNeighborhoodProperties = (
  neighborhoodFeatures: PolyOrMultiPolyFeature[]
) => {
  for (const feature of neighborhoodFeatures) {
    // This boundary seems to actually be for a neighborhood called "Adams" that I've never heard of but which appears
    // on the map inside of Ballard
    if (
      feature?.properties?.S_HOOD === "Ballard" &&
      feature?.properties?.S_HOOD_ALT_NAMES === "Adams"
    ) {
      feature.properties.S_HOOD = "Adams";
      feature.properties.S_HOOD_ALT_NAMES = null;
    }
  }
  return neighborhoodFeatures;
};

const cleanUpNeighborhoodFile = (
  neighborhoodCollection: PolyOrMultiPolyCollection
) => {
  const neighborhoodFeaturesFixed = fixNeighborhoodProperties(
    neighborhoodCollection.features
  );
  return removeDuplicateNeighborhoodNames(neighborhoodFeaturesFixed);
};

const getName = (feature: PolyOrMultiPolyFeature) => {
  const nameAttribute = Object.prototype.hasOwnProperty.call(
    feature.properties,
    NeighborhoodNameAttribute
  )
    ? NeighborhoodNameAttribute
    : DistrictNameAttribute;
  return `${feature?.properties?.[nameAttribute]}, Seattle, WA, USA`;
};

const getPlaceId = async (name: string) =>
  (await geocode({ address: name })).data.results[0].place_id;

// We want all our own boundaries to be MultiPolygon for the sake of simplicity, so adding an extra [] for this
const getCoordinates = (
  feature: PolyOrMultiPolyFeature
): MultiPolygon["coordinates"] =>
  feature.geometry.type === "MultiPolygon"
    ? feature.geometry.coordinates
    : [feature.geometry.coordinates];

const convertFeatureToBoundary = async (
  feature: PolyOrMultiPolyFeature
): Promise<IBoundary> => {
  const name = getName(feature);
  const placeId = await getPlaceId(name);
  const coordinates = getCoordinates(feature);
  return {
    name,
    type: "neighborhood",
    geometry: {
      type: "MultiPolygon",
      coordinates
    },
    placeId
  };
};

const createBoundaries = async (features: PolyOrMultiPolyFeature[]) => {
  return await Promise.all(
    features.map(async (feature) => await convertFeatureToBoundary(feature))
  );
};

const createBoundariesInBatches = async (
  features: PolyOrMultiPolyFeature[],
  sleepTime: number,
  number: number
) => {
  const boundaries: IBoundary[] = [];
  for (let i = 0; i < features.length; i += number) {
    const boundaryBatch = features.slice(i, i + number);
    const createdBoundaryBatch = await createBoundaries(boundaryBatch);
    boundaries.push(...createdBoundaryBatch);
    console.log(`Sleeping ${sleepTime} ms between batches`);
    await sleep(sleepTime);
  }
  return boundaries;
};

const main = async () => {
  const argv = await processArgv();

  try {
    const neighborhoodCollection: PolyOrMultiPolyCollection = JSON.parse(
      fs.readFileSync(argv.neighborhoodFile, "utf-8")
    );

    console.log("Cleaning up neighborhood file");
    const neighborhoodFeatures = cleanUpNeighborhoodFile(
      neighborhoodCollection
    );

    console.log("Converting FeatureCollection files to boundaries...");
    const districtCollection: PolyOrMultiPolyCollection = JSON.parse(
      fs.readFileSync(argv.districtFile, "utf-8")
    );
    const boundaries = await createBoundariesInBatches(
      [...neighborhoodFeatures, ...districtCollection.features],
      argv.sleep,
      argv.number
    );
    fs.writeFileSync(argv.outputPath, JSON.stringify(boundaries, null, 2));
    console.log(`Successfully wrote output file to "${DefaultOutputPath}".`);

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
