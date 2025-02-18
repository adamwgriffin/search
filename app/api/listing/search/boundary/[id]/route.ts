import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import mongooseConnect from '../../../../../../lib/mongooseConnect'
import Listing from '../../../../../../models/ListingModel'
import Boundary from '../../../../../../models/BoundaryModel'
import { getPaginationParams } from '../../../../../../lib'
import { getBoundaryGeometryWithBounds } from '../../../../../../lib/listing_search_helpers'
import listingSearchBoundaryView from '../../../../../../views/listingSearchBoundaryView'
import {
  type BoundarySearchParams,
  boundarySearchRequestSchema
} from '../../../../../../zod_schemas/boundarySearchRequestSchema'

export type BoundaryRequstParams = {
  params: BoundarySearchParams
}

export async function GET(
  request: NextRequest,
  { params }: BoundaryRequstParams
) {
  await mongooseConnect()

  const searchParamsObject = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  )
  const result = boundarySearchRequestSchema.safeParse({
    query: searchParamsObject,
    params
  })
  if (!result.success) {
    return NextResponse.json(result.error, { status: 400 })
  }
  const searchParams = result.data.query

  const boundary = await Boundary.findById(params.id)
  if (!boundary) {
    return NextResponse.json(
      { message: `No boundary found for boundary id ${params.id}.` },
      { status: 404 }
    )
  }
  const pagination = getPaginationParams(searchParams)
  const bounds = getBoundaryGeometryWithBounds(boundary, searchParams)
  // Map viewport bounds were included but the boundary was moved outside the
  // viewport, so there's nothing to search.
  if (bounds === null) {
    return NextResponse.json(
      listingSearchBoundaryView(boundary, null, pagination)
    )
  }
  const results = await Listing.findWithinBounds(
    bounds,
    searchParams,
    pagination
  )
  return NextResponse.json(
    listingSearchBoundaryView(boundary, results, pagination)
  )
}
