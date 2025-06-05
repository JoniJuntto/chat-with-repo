import React from "react";
import { Heart, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="relative pb-8">
      <div className="container mx-auto px-4">
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Chat with Repo. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for
              developers everywhere
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <nav className="flex gap-6">
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
            </nav>

            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
};

export default Footer;
