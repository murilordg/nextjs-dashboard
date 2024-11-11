import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ message: "Name parameter is missing" }, { status: 400 });
    }

    return NextResponse.json({ message: `Hello, ${name}!` });
}

export async function POST(request: Request) {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
        return NextResponse.json({ message: "Invalid or missing 'name' parameter" }, { status: 400 });
    }

    return NextResponse.json({ message: `Hello, ${name}!` });
}
