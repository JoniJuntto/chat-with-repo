"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FavoriteRepo {
  id: string;
  repoUrl: string;
  name: string;
  owner: string;
  createdAt: string;
}

interface FavoriteReposProps {
  userId: string;
}

export function FavoriteRepos({ userId }: FavoriteReposProps) {
  const [repos, setRepos] = useState<FavoriteRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRepoUrl, setNewRepoUrl] = useState("");

  useEffect(() => {
    fetchFavoriteRepos();
  }, [userId]);

  const fetchFavoriteRepos = async () => {
    try {
      const response = await fetch(`/api/repos/favorites?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch favorite repos");
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error fetching favorite repos:", error);
      toast.error("Virhe suosikkirepositorioiden haussa");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;

    try {
      const response = await fetch("/api/repos/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, repoUrl: newRepoUrl }),
      });

      if (!response.ok) throw new Error("Failed to add repository");

      await fetchFavoriteRepos();
      setNewRepoUrl("");
      toast.success("Repositorio lisätty suosikkeihin");
    } catch (error) {
      console.error("Error adding repository:", error);
      toast.error("Virhe repositorion lisäämisessä");
    }
  };

  const handleRemoveRepo = async (repoId: string) => {
    try {
      const response = await fetch(`/api/repos/favorites/${repoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove repository");

      await fetchFavoriteRepos();
      toast.success("Repositorio poistettu suosikeista");
    } catch (error) {
      console.error("Error removing repository:", error);
      toast.error("Virhe repositorion poistamisessa");
    }
  };

  if (loading) {
    return <div>Ladataan suosikkirepositorioita...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suosikkirepositoriot</CardTitle>
        <CardDescription>Hallitse suosikkirepositorioitasi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddRepo} className="mb-4 flex gap-2">
          <Input
            type="text"
            placeholder="GitHub repositorion URL (esim. https://github.com/owner/repo)"
            value={newRepoUrl}
            onChange={(e) => setNewRepoUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Lisää</Button>
        </form>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          {repos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Ei vielä suosikkirepositorioita
            </p>
          ) : (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-medium">
                      {repo.owner}/{repo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {repo.repoUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lisätty:{" "}
                      {new Date(repo.createdAt).toLocaleString("fi-FI")}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveRepo(repo.id)}
                  >
                    Poista
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
