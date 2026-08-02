import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, price, pixKey, image, qrCodeImage } = await req.json();

    if (!name || !price || !pixKey) {
      return NextResponse.json(
        { error: "Nome, preço e chave PIX são obrigatórios" },
        { status: 400 }
      );
    }

    const currentGift = await prisma.gift.findUnique({ where: { id } });
    if (!currentGift) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    const updatedGift = await prisma.gift.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        pixKey,
        imageUrl: image || currentGift.imageUrl,
        qrCodeImage: qrCodeImage || currentGift.qrCodeImage,
      },
    });

    return NextResponse.json(updatedGift);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar presente" },
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

    const gift = await prisma.gift.findUnique({ where: { id } });
    if (!gift) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    await prisma.gift.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao remover presente" },
      { status: 500 }
    );
  }
}
