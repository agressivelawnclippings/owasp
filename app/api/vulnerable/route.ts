import { NextResponse } from 'next/server';

function mockDatabaseCall(userId: string) {
  // Simulating a database failure on unexpected input
  if (userId.includes("'") || userId.includes('"')) {
    const error = new Error("SQL Syntax Error near " + userId);
    // Artificially embedding sensitive data like a real vulnerable DB setup might do
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
    // VULNERABILITY: Mishandling of Exceptional Conditions
    // We are directly returning the raw error object, exposing the stack trace 
    // and sensitive internal context to the end-user.
    return NextResponse.json({
      success: false,
      error: error.message,
      stackTrace: error.stack,
      dbInfo: error.dbContext // Leaking sensitive internal infrastructure data
    }, { status: 500 });
  }
}
