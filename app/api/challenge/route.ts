import { NextResponse } from 'next/server';

class MockDB {
    static connectStr = "Database=users.db;User=admin;Password=FLAG{arr4y_byp4ss_m1sh4ndl3d_3rr0r}";

    static async query(sql: string) {
        // Simulating a fragile query interpreter
        if (sql.includes("UNION") || sql.includes("DROP") || sql.includes("SLEEP")) {
             throw new Error("Security Exception: Illegal keyword in query. System Context: " + this.connectStr);
        }
        if (!sql.startsWith("SELECT")) {
             throw new Error(`Syntax Error in: ${sql}. Context: ${this.connectStr}`);
        }
        return { message: "Query executed successfully. Safe data returned." };
    }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let id = body.id;

    if (!id) {
       return NextResponse.json({ error: "Missing 'id' in request body." }, { status: 400 });
    }

    // THE BAD PATCH
    // The developer tried to stop SQL Injection by removing dangerous words.
    // However, they only check if it is a string!
    if (typeof id === 'string') {
        const blocklist = /UNION|DROP|SLEEP|'|"/gi;
        id = id.replace(blocklist, "");
    }

    // Attempting the database call (Concatenation makes it fragile)
    const result = await MockDB.query(`SELECT * FROM users WHERE id = ${id}`);
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    // MISHANDLED EXCEPTION
    // The application catches the exception but dumps the entire stack back
    return NextResponse.json({
      error: "A database error occurred",
      details: error.message,
      stackTracker: error.stack
    }, { status: 500 });
  }
}
