import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import dbConnect from '../../../../../../lib/dbConnect'
import Listing from '../../../../../../models/ListingModel'
import Boundary from '../../../../../../models/BoundaryModel'
import { getPaginationParams } from '../../../../../../lib'
import { getBoundaryGeometryWithBounds } from '../../../../../../lib/listing_search_helpers'
import listingSearchView from '../../../../../../views/listingSearchView'
import { boundsSearchQuerySchema } from '../../../../../../zod_schemas/boundsSearchRequestSchema'

export type BoundaryParams = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: BoundaryParams) {
  await dbConnect()

  const searchParamsObject = Object.fromEntries(
    request.nextUrl.searchParams.entries()
  )
  const result = boundsSearchQuerySchema.safeParse(searchParamsObject)
  if (!result.success) {
    return NextResponse.json(result.error, { status: 400 })
  }
  const searchParams = result.data

  const boundary = await Boundary.findById(params.id)
  if (!boundary) {
    return NextResponse.json(
      { message: `No boundary found for boundary id ${params.id}.` },
      { status: 404 }
    )
  }
  const pagination = getPaginationParams(searchParams)
  const results = await Listing.findWithinBounds(
    getBoundaryGeometryWithBounds(boundary, searchParams),
    searchParams,
    pagination
  )
  return NextResponse.json(listingSearchView(results, pagination))
}
