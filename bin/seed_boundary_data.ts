import type { IBoundary } from "../models/BoundaryModel";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import {
  connectToDatabase,
  disconnectDatabase
} from "../lib/mongoose_script_connection";
import Boundary from "../models/BoundaryModel";

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
        "Path to the file to use to load boundary data, e.g., /app/data/my_file.json"
    })
    .alias("h", "help")
    .help("help")
    .usage(`Usage: $0 [options]`).argv;

  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  return argv;
};

const main = async (): Promise<void> => {
  const argv = await processArgv();

  try {
    await connectToDatabase();
    console.log("Creating boundaries...");
    const boundaryData = JSON.parse(
      fs.readFileSync(argv.file, "utf-8")
    ) as IBoundary[];
    const boundaries = await Boundary.create(boundaryData);
    console.log(`${boundaries.length} boundaries created.`);
    // If we don't call this it will only create the _id and one other index in MongoDB Atlas. No idea why as it works
    // fine with a local instance of MongoDB.
    await Boundary.syncIndexes();
    console.log("Finished syncing all indexes.");
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

main();
