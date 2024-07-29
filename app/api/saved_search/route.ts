import { NextResponse } from 'next/server'
import prisma from '../../../lib/prismadb'

export async function POST(request: Request) {
  const { id } = await prisma.savedSearch.create({
    data: await request.json()
  })
  return NextResponse.json(
    { id },
    { status: 201 }
  )
}
