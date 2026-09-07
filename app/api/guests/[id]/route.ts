import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: {
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        confirmed: body.confirmed,
        qtd_adultos: body.qtd_adultos !== undefined ? Math.min(Number(body.qtd_adultos), 10) : undefined,
        qtd_criancas: body.qtd_criancas !== undefined ? Number(body.qtd_criancas) : undefined,
        observacao: body.observacao,
        acompanhantes: body.acompanhantes !== undefined ? body.acompanhantes : undefined,
      },
    });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar convidado" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.guest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao remover convidado" },
      { status: 500 }
    );
  }
}
