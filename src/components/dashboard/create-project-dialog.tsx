"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: Project) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inputMode, setInputMode] = useState<"prompt" | "api">("prompt");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [error, setError] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          input_mode: inputMode,
          prompt_template: inputMode === "prompt" ? promptTemplate : undefined,
          api_endpoint: inputMode === "api" ? apiEndpoint : undefined,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        onCreated(json.data);
        onOpenChange(false);
        resetForm();
        setError("");
      } else {
        setError(json.error || "Failed to create project");
      }
    } catch (err) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPromptTemplate("");
    setApiEndpoint("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Set up an AI feature to test with simulated scenarios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Project name</Label>
            <Input
              placeholder="e.g., AI Customer Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the AI feature and what it does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Input mode</Label>
            <Select
              value={inputMode}
              onValueChange={(v) => setInputMode(v as "prompt" | "api")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prompt">Prompt template</SelectItem>
                <SelectItem value="api">API endpoint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputMode === "prompt" ? (
            <div className="space-y-2">
              <Label>Prompt template (system prompt)</Label>
              <Textarea
                placeholder="You are a helpful customer support agent..."
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>API endpoint (POST)</Label>
              <Input
                placeholder="https://api.example.com/chat"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!name || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
