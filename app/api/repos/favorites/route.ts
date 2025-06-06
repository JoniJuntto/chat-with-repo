import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";

// GET /api/repos/favorites - Get user's favorite repositories
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Verify that the requesting user is accessing their own favorites
    if (userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const repos = await prisma.favoriteRepository.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching favorite repos:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/repos/favorites - Add a new favorite repository
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { userId, repoUrl } = body;

    if (!userId || !repoUrl) {
      return new NextResponse("User ID and repository URL are required", {
        status: 400,
      });
    }

    // Verify that the requesting user is adding to their own favorites
    if (userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse GitHub URL to get owner and repo name
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return new NextResponse("Invalid GitHub repository URL", { status: 400 });
    }

    const [, owner, name] = match;

    // Check if repository already exists in favorites
    const existingRepo = await prisma.favoriteRepository.findFirst({
      where: {
        userId,
        repoUrl,
      },
    });

    if (existingRepo) {
      return new NextResponse("Repository already in favorites", {
        status: 400,
      });
    }

    const repo = await prisma.favoriteRepository.create({
      data: {
        userId,
        repoUrl,
        owner,
        name,
      },
    });

    return NextResponse.json(repo);
  } catch (error) {
    console.error("Error adding favorite repo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
