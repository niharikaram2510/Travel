import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;

    const result = await pool.query(
      `
      SELECT *
      FROM trips
      WHERE trip_id = $1;
      `,
      [tripId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      trip: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching trip:", error);

    return NextResponse.json(
      { message: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}