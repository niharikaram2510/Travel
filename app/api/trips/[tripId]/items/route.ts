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
      FROM itinerary_items
      WHERE trip_id = $1
      ORDER BY day, item_id;
      `,
      [tripId]
    );

    return NextResponse.json({
      items: result.rows,
    });
  } catch (error) {
    console.error("Error fetching itinerary items:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch itinerary items",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const item = await request.json();

    const {
      day,
      placeName,
      placeId,
      notes,
    } = item;

    const result = await pool.query(
      `
      INSERT INTO itinerary_items (
        trip_id,
        day,
        place_id,
        place_name,
        notes
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        tripId,
        day,
        placeId || null,
        placeName,
        notes || null,
      ]
    );

    return NextResponse.json({
      message: "Itinerary item added successfully",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding itinerary item:", error);

    return NextResponse.json(
      {
        message: "Failed to add itinerary item",
      },
      {
        status: 500,
      }
    );
  }
}