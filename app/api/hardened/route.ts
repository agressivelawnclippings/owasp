import { NextResponse } from 'next/server';

function mockDatabaseCall(userId: string) {
  if (userId.includes("'") || userId.includes('"')) {
    const error = new Error("SQL Syntax Error near " + userId);
    (error as any).dbContext = {
      dbUrl: "postgresql://admin:supersecret_db_p4ssw0rd@internal-db:5432/prod",
      internalIp: "10.0.4.52",
      activeQueries: 14
    };
    throw error;
  }
  return { id: userId, name: "Alice", role: "User" };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '1';

  try {
    const data = mockDatabaseCall(id);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    // HARDENED: Secure Error Handling
    // 1. Log the full details internally for monitoring and debugging
    console.error("[CRITICAL DB ERROR]", {
      message: error.message,
      stack: error.stack,
      context: error.dbContext,
      timestamp: new Date().toISOString()
    });

    // 2. Return a standardized generic error message to the user (Fail Securely)
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred while processing your request. Please try again later."
    }, { status: 500 });
  }
}
