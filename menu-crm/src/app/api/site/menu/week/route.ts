import { NextResponse } from "next/server";
import { menuWeekFromCrm } from "@/lib/site/menuDay";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? url.searchParams.get("weekStart") ?? "";
  const weekStart = date.includes(".") ? date.split(".").reverse().join("-") : date;
  const result = await menuWeekFromCrm(weekStart || new Date().toISOString().slice(0, 10));
  return NextResponse.json(result);
}
