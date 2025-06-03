import type { IBoundary } from "../models/BoundaryModel";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import {
  type GeneratedListingGeocodeData,
  generateRandomGeospatialDataForPoly
} from "../lib/random_data";

const VerificationMax = 10;

const DefaultOutputPath = path.join(
  __dirname,
  "..",
  "data",
  "seed_data",
  "development",
  "dev_listing_geocode_data.json"
);

const DefaultFilePath = path.join(
  __dirname,
  "..",
  "data",
  "seed_data",
  "development",
  "dev_boundaries.json"
);

const processArgv = async () => {
  const argv = await yargs(process.argv.slice(2))
    .option("file", {
      alias: "f",
      type: "string",
      default: DefaultFilePath,
      describe:
        "Path to the file to use to load boundary data from, e.g., /app/data/my_file.json"
    })
    .option("sleep", {
      alias: "s",
      type: "number",
      default: 10,
      describe:
        "Amount of time to sleep in milliseconds between creating listings for each boundary"
    })
    .option("number", {
      alias: "n",
      type: "number",
      default: 1,
      describe: "Number of addresses to lookup for each polygon"
    })
    .option("verify", {
      type: "boolean",
      describe:
        "Verify that you want to execute API requests for a large number of addresses"
    })
    .option("output-path", {
      alias: "o",
      type: "string",
      default: DefaultOutputPath,
      describe: "Path to save the file to"
    })
    .alias("h", "help")
    .help("help")
    .usage(`Usage: $0 [options]`)
    .epilogue(
      "Generate random geospatial data to use for random listing generator script"
    ).argv;

  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  return argv;
};

const main = async () => {
  try {
    const argv = await processArgv();

    if (argv.number > VerificationMax && !argv.verify) {
      console.log(
        `Number argument of "${argv.number}" is too large.`,
        `Must pass "--verify" flag in order to do API requests for batches larger than ${VerificationMax}`,
        "In order to avoid overages."
      );
      process.exit(1);
    }
    console.warn(
      "Warning! Be careful about running this too much.",
      "We can get charged a lot for overages for Geocode API requests."
    );
    const boundaries = JSON.parse(
      fs.readFileSync(argv.file, "utf-8")
    ) as IBoundary[];
    const listingGeocodeData: GeneratedListingGeocodeData[] = [];
    for (const boundary of boundaries) {
      const data = await generateRandomGeospatialDataForPoly(
        boundary.geometry,
        argv.number
      );
      listingGeocodeData.push(...data);
      console.debug(
        `${data.length} items created for boundary ${boundary.name}`
      );
      console.debug(
        `Sleeping ${argv.sleep} seconds before next batch of ${argv.number}`
      );
    }
    fs.writeFileSync(
      argv.outputPath,
      JSON.stringify(listingGeocodeData, null, 2)
    );
    console.info(`${listingGeocodeData.length} items created.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? `"${error.message}"` : "";
    console.error(
      "Encountered error generating geospatial listing data",
      errorMessage
    );
    process.exit(1);
  }
};

main();
