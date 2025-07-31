# Search

A real estate search app written with Next.js.

Currently we only have boundaries for Seattle, so the
search is limited to Seattle neighborhoods. The listing data is automatically
generated using Faker. These are not real listings.

## Installation

Install:

- Node.js >= 20.18.0
- Bun >= 1.1.34

If you use asdf/mise you can just run `asdf install` for node and bun.

Run `bun install` to install dependencies.

Run the development server with `bun run dev`.

Run the tests with `bun run test`.

## Environment Variable Setup

### Vercel

If you have access to our Vercel account you can setup the project using the
vercel CLI. To do so:

Install the CLI if necessary using `npm install -g vercel`.

Then run `vercel link` and follow the prompts. Choose "Griffin Enterprises" as
the scrope and enter "search" for the name of your existing project.

Then run `vercel env pull` to create the env.local file and download the app
secrets into it.

Add a `NEXTAUTH_SECRET` variable to the file. You can generate the secret for it with `openssl rand -base64 32`.

### Manual

Rename the `env.local.example` file to `.env.local` and add the missing values
for any blank environment variables.

#### Google Maps

Setting up Google Maps requires creating an API token on [Google Cloud Console](https://console.cloud.google.com/).
You have to enable the following APIs:

- Maps JavaScript API
- Geocoding API
- Maps Embed API
- Places API
- Street View Static API

Add the API token to the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` variable.

You also have to create a map under "Map Management" and add the Map ID to
`NEXT_PUBLIC_GOOGLE_MAPS_ID` variable.

#### MongoDB

You need a connection to an instance of MongoDB for data. The connection url
should be added to the `MONGODB_URI` variable. You can create a free
cloud instance on MongoDB Atlas or run one locally using the official MongoDB
Docker image.

#### NextAuth

You can generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

Setting up the Google and GitHub Oauth providers is a bit more involved. Each
requires a `[PROVIDER_NAME]_CLIENT_ID` and `[PROVIDER_NAME]_CLIENT_SECRET` variable. These pages describe how to
set this up for [Google](https://developers.google.com/identity/protocols/oauth2) and for
[GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps).

## Database Setup

If you have access to our MongoDB Atlas instance then it already has data to
work with in dev.

If you setup your own database you can run `bun run seed_dev_data` to seed the database with listing and boundary
data.

## Generating data

We have a number of scripts that are used to generate fake data for development
and testing. The scripts are all in the bin/ directory and the data is in the
data/ directory.

- `generate_listing_geocode_data`: This one only generates a file with geocode
  data for a set of geospatial boundaries. You feed it a file with an array of
  GeoJSON boundaries and it will randomly generate addresses and coordinates
  within each of those boundaries. **Be careful when running this script!** It
  makes requests to the Google Maps Geocoding API which can cost a lot of money
  if there are overages.

- `generate_listing_data`: Takes a json file with an array of geocode data
  (address, coordinates, etc) and generates fake listing data from it using
  Faker.js.

- `convert_seattle_neighborhood_boundaries`: Takes the City of Seattle GeoJSON
  boundary data and converts it into a form we can use in the database.

- `seed_listing_data`/`seed_boundary_data`: Just takes the static json files
  that were generated and saves them in the database.
