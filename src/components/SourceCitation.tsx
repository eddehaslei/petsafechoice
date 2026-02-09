import { ExternalLink, BookOpen } from "lucide-react";

interface SourceCitationProps {
  source?: { name: string; url: string } | null;
}

export function SourceCitation({ source }: SourceCitationProps) {
  if (!source?.name) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-3 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/30">
        <BookOpen className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs text-muted-foreground">Source:</span>
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {source.name}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs font-medium text-foreground">{source.name}</span>
        )}
      </div>
    </div>
  );
}
