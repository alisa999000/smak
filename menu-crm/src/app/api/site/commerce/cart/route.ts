import { NextResponse } from "next/server";
import { getOrCreateCartSession } from "@/lib/site/session";
import { cartPayload } from "@/lib/site/commerce";

export async function GET(request: Request) {
  const instance = new URL(request.url).searchParams.get("instance") ?? "products";
  const session = await getOrCreateCartSession();
  return NextResponse.json(cartPayload(session, instance));
}
