import React from "react";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="relative pb-8">
      <div className="container mx-auto px-4">
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pöhinä Group Oy. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for
              developers everywhere
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <nav className="flex gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
