import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const repoId = params.id;
    if (!repoId) {
      return new NextResponse("Repository ID is required", { status: 400 });
    }

    // Get the repository to verify ownership
    const repo = await prisma.favoriteRepository.findUnique({
      where: { id: repoId },
    });

    if (!repo) {
      return new NextResponse("Repository not found", { status: 404 });
    }

    // Verify that the requesting user owns the repository
    if (repo.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.favoriteRepository.delete({
      where: { id: repoId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing favorite repo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
