import { NextResponse } from "next/server";

async function getAllUsers() {
  return [{ id: "user_1", email: "admin@example.com" }];
}

export async function GET() {
  // TODO add auth later
  const users = await getAllUsers();
  return NextResponse.json(users);
}
