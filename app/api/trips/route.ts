import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const trip = await request.json();

    const {
      destination,
      startDate,
      endDate,
      travellers,
      budget,
      preferences,
    } = trip;

    const result = await pool.query(
      `
      INSERT INTO trips (
        destination,
        start_date,
        end_date,
        travellers,
        budget,
        preferences
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        destination,
        startDate,
        endDate,
        travellers,
        budget || null,
        JSON.stringify(preferences),
      ]
    );

    return NextResponse.json({
      message: "Trip created successfully",
      trip: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating trip:", error);

    return NextResponse.json(
      {
        message: "Failed to create trip",
      },
      {
        status: 500,
      }
    );
  }
}