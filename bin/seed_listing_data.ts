import type { IListing } from '../models/ListingModel'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import {
  connectToDatabase,
  disconnectDatabase
} from '../lib/mongoose_script_connection'
import Listing from '../models/ListingModel'

const DefaultFilePath = path.join(
  __dirname,
  '..',
  'data',
  'seed_data',
  'development',
  'dev_listings.json'
)

const processArgv = async () => {
  const argv = await yargs(process.argv.slice(2))
    .option('file', {
      alias: 'f',
      type: 'string',
      default: DefaultFilePath,
      describe:
        'Path to the file to use to load listing data, e.g., /app/data/my_file.json'
    })
    .alias('h', 'help')
    .help('help')
    .usage(`Usage: $0 [options]`).argv

  if (argv.help) {
    yargs.showHelp()
    process.exit(0)
  }

  return argv
}

const main = async (): Promise<void> => {
  const argv = await processArgv()

  try {
    await connectToDatabase()
    console.log('Creating listings...')
    const listingData = JSON.parse(
      fs.readFileSync(argv.file, 'utf-8')
    ) as IListing[]
    let listingsCreated = 0
    // We creating these one at a time instead of passing all the data to
    // Listing.create() because doing it that way doesn't seem to allow the slug
    // dedupe logic to work correctly.
    for (const listing of listingData) {
      await Listing.create(listing)
      listingsCreated += 1
    }
    console.log(`${listingsCreated} listings created.`)
    // If we don't call this it will only create the _id and one other index in MongoDB Atlas. No idea why as it works
    // fine with a local instance of MongoDB.
    await Listing.syncIndexes()
    console.log('Finished syncing all indexes.')
    await disconnectDatabase()
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
