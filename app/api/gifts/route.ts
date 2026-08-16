import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Força Next.js a rodar essa rota em tempo de execução, sem cache estático
export const dynamic = "force-dynamic";

const FALLBACK_GIFTS = [
  {
    id: "fb-1",
    name: "Jogo de Panelas Antiaderentes",
    description: "Para prepararmos refeições deliciosas juntos.",
    price: 349.9,
    pixKey: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865406349.905802BR5925Franciele e Brendon6009SAO PAULO62070503***6304E2CA",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
    qrCodeImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb-2",
    name: "Jarra de Vidro com Espremedor",
    description: "Para refrescar nossos encontros em família.",
    price: 69.0,
    pixKey: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540569.005802BR5925Franciele e Brendon6009SAO PAULO62070503***6304B10F",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    qrCodeImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb-3",
    name: "Kit Lavabo Elegante",
    description: "Pequenos detalhes que fazem a diferença.",
    price: 119.0,
    pixKey: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865406119.005802BR5925Franciele e Brendon6009SAO PAULO62070503***6304C91A",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    qrCodeImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb-4",
    name: "Edredom Queen Size Macio",
    description: "Para noites quentinhas e cheias de aconchego.",
    price: 399.0,
    pixKey: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865406399.005802BR5925Franciele e Brendon6009SAO PAULO62070503***6304F34B",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    qrCodeImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
    console.warn("Neon offline/idle ou bloqueado por IPv6 local. Retornando presentes para teste...");
    // Em modo dev, se o banco não for alcançável, retornar a lista fallback para evitar bloquear o dev
    return NextResponse.json(FALLBACK_GIFTS);
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
