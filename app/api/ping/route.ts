import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Consulta PostgreSQL para verificar se a conexão está ativa
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro no ping do banco:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
