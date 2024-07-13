import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
      const cookieStore = cookies();
      cookieStore.delete("token");
  
      return NextResponse.json(
      { message: 'Token deleted', success: true},
      { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }