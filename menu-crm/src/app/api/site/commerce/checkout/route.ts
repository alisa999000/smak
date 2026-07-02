import { NextResponse } from "next/server";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/site/commerce";
import { getOrCreateCartSession } from "@/lib/site/session";
import { cartPayload } from "@/lib/site/commerce";

export async function GET() {
  const session = await getOrCreateCartSession();
  const cart = cartPayload(session, "products");
  return NextResponse.json({
    ok: true,
    cart,
    deliveries: DELIVERY_METHODS,
    payments: PAYMENT_METHODS,
  });
}
