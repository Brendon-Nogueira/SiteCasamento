import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Listar ou buscar convidados
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (search) {
      // busca convidado
      const guests = await prisma.guest.findMany({
        where: {
          nome: {
            contains: search,
            mode: "insensitive",
          },
        },
        orderBy: {
          nome: "asc",
        },
        take: 10, // limita buscas públicas para evitar spam
      });
      return NextResponse.json(guests);
    }

    // Se não tiver busca, retorna tudo (usado pelo admin)
    const allGuests = await prisma.guest.findMany({
      orderBy: {
        nome: "asc",
      },
    });
    return NextResponse.json(allGuests);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar convidados" },
      { status: 500 }
    );
  }
}

// POST - Criar convidado 
export async function POST(req: NextRequest) {
  try {
    const { nome, email, whatsapp, confirmed, qtd_adultos, qtd_criancas, observacao, acompanhantes } = await req.json();

    if (!nome || !whatsapp) {
      return NextResponse.json(
        { error: "Nome e WhatsApp são obrigatórios" },
        { status: 400 }
      );
    }

    const newGuest = await prisma.guest.create({
      data: {
        nome,
        email: email || null,
        whatsapp,
        confirmed: confirmed || false,
        qtd_adultos: qtd_adultos !== undefined ? Math.min(Number(qtd_adultos), 10) : 1,
        qtd_criancas: qtd_criancas !== undefined ? Number(qtd_criancas) : 0,
        observacao: observacao || null,
        acompanhantes: acompanhantes || null,
      },
    });

    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar convidado" },
      { status: 500 }
    );
  }
}
