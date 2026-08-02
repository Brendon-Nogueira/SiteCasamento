import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Força Next.js a rodar essa rota em tempo de execução, sem cache estático
export const dynamic = "force-dynamic";

// GET - Listar presentes
export async function GET() {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Erro na API GET /api/gifts:", error);
    return NextResponse.json(
      { error: "Erro ao listar presentes" },
      { status: 500 }
    );
  }
}

// POST - Criar presente 
export async function POST(req: NextRequest) {
  try {
    const { name, description, price, pixKey, image, qrCodeImage } = await req.json();

    if (!name || !price || !pixKey) {
      return NextResponse.json(
        { error: "Nome, preço e chave PIX são obrigatórios" },
        { status: 400 }
      );
    }

    const newGift = await prisma.gift.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        pixKey,
        imageUrl: image || "/images/gifts/placeholder.png",
        qrCodeImage: qrCodeImage || null,
      },
    });

    return NextResponse.json(newGift, { status: 201 });
  } catch (error) {
    console.error("Erro na API POST /api/gifts:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar presente" },
      { status: 500 }
    );
  }
}
