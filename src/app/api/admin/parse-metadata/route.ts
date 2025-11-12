import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";
import * as mm from "music-metadata";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Brak dostępu" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Plik MP3 jest wymagany" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await mm.parseBuffer(buffer, file.type);
    const common = metadata.common ?? {};

    return NextResponse.json({
      title: common.title ?? null,
      artist: common.artist ?? (common.artists ? common.artists.join(", ") : null) ?? null,
      album: common.album ?? null,
      year: common.year ?? null,
      genre: common.genre?.[0] ?? null,
      durationSeconds: metadata.format?.duration ?? null,
    });
  } catch (error) {
    console.error("parse-metadata error", error);
    return NextResponse.json({ message: "Nie udało się odczytać metadanych" }, { status: 500 });
  }
}
