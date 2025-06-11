'use client'

import { signOut } from "next-auth/react";
import Link from "next/link";

interface SignedInHeaderProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function SignedInHeader({ user }: SignedInHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold text-sm hover:underline">
            Makkara
          </Link>
          <div className="flex items-center gap-3">
            {user.image && (
              <img
                src={user.image}
                alt={user.name ?? "avatar"}
                className="w-6 h-6 rounded-full border border-border"
              />
            )}
            <button
              onClick={() => signOut()}
              className="text-sm font-medium hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
