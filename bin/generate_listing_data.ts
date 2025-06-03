import fs from "fs";
import path from "path";
import yargs from "yargs";
import {
  type GeneratedListingGeocodeData,
  createRandomListingModel
} from "../lib/random_data";

const DefaultOutputPath = path.join(
  __dirname,
  "..",
  "data",
  "seed_data",
  "development",
  "dev_listings.json"
);

const DefaultFilePath = path.join(
  __dirname,
  "..",
  "data",
  "seed_data",
  "development",
  "dev_listing_geocode_data.json"
);

const processArgv = async () => {
  const argv = await yargs(process.argv.slice(2))
    .option("file", {
      alias: "f",
      type: "string",
      default: DefaultFilePath,
      describe:
        "Path to the file to use to load listing geocode data from, e.g., /app/data/my_file.json"
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
    .epilogue("Generate random Listing data from listing geocode data file")
    .argv;

  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  return argv;
};

const main = async () => {
  try {
    const argv = await processArgv();

    const data = JSON.parse(
      fs.readFileSync(argv.file, "utf-8")
    ) as GeneratedListingGeocodeData[];
    console.info("Creating listing model data...");
    const listings = data.map((d) => createRandomListingModel(d));
    fs.writeFileSync(argv.outputPath, JSON.stringify(listings, null, 2));
    console.info(`${listings.length} listings created.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? `"${error.message}"` : "";
    console.error("Encountered error generating listing data", errorMessage);
    process.exit(1);
  }
};

main();
