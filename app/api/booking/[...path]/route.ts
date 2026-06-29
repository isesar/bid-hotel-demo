import { NextRequest, NextResponse } from "next/server";

const REMOTE_API =
  process.env.BOOKING_API_URL ?? "https://test-booking-api.bid.workers.dev";

async function proxyRequest(request: NextRequest, path: string[]) {
  const url = `${REMOTE_API}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers({ accept: "application/json" });

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method === "GET") {
    init.next = { revalidate: 300 };
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }
    init.body = await request.text();
  }

  const response = await fetch(url, init);
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}
