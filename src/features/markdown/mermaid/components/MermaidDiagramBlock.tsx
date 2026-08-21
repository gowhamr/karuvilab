"use client";

import React, { useEffect, useState, useRef } from "react";
import { MermaidBlock, MermaidRenderResult } from "../types";
import { mermaidManager } from "../MermaidRenderManager";
import { MermaidPreflightAnalyzer } from "../MermaidPreflight";
import { MermaidPlaceholder } from "./MermaidPlaceholder";
import { MermaidContainer } from "./MermaidContainer";
import { MermaidErrorCard } from "./MermaidErrorCard";

interface MermaidDiagramBlockProps {
  block: MermaidBlock;
}

export function MermaidDiagramBlock({ block }: MermaidDiagramBlockProps) {
  const [result, setResult] = useState<MermaidRenderResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Preflight check for diagram type
  const preflight = React.useMemo(() => {
    return MermaidPreflightAnalyzer.preflight(block.source);
  }, [block.source]);

  // 2. IntersectionObserver for viewport-based lazy rendering
  useEffect(() => {
    if (!containerRef.current) return;

    // If complexity is low or IntersectionObserver is not available, render immediately
    if (typeof IntersectionObserver === "undefined" || preflight.complexity.complexity === "low") {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" } // Pre-render when 300px away from viewport
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [preflight.complexity.complexity]);

  const generationRef = React.useRef(0);

  // 3. Diagram rendering lifecycle with generation tracking and abort cancellation
  const renderDiagram = React.useCallback(async (force = false) => {
    const currentGen = ++generationRef.current;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const ac = new AbortController();
    abortControllerRef.current = ac;

    setIsLoading(true);

    try {
      const renderRes = await mermaidManager.renderDiagram(block, {
        signal: ac.signal,
        forceRerender: force,
        generationId: currentGen,
        priority: isInViewport ? "immediate" : "queue",
      });

      if (!ac.signal.aborted && currentGen === generationRef.current) {
        setResult(renderRes);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (!ac.signal.aborted && currentGen === generationRef.current) {
        setResult({
          id: block.id,
          hash: block.hash,
          svg: "",
          error: String(err?.message || "Render failed"),
          errorKind: "RENDER_ERROR",
          source: block.source,
          timestamp: Date.now(),
          generationId: currentGen,
        });
        setIsLoading(false);
      }
    }
  }, [block, isInViewport]);

  useEffect(() => {
    if (isInViewport) {
      renderDiagram();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isInViewport, renderDiagram]);

  const diagramTypeLabel =
    preflight.type !== "unknown"
      ? preflight.type.charAt(0).toUpperCase() + preflight.type.slice(1)
      : "Mermaid";

  return (
    <div ref={containerRef} className="mermaid-block-wrapper my-6 min-w-0 max-w-full">
      {isLoading ? (
        <MermaidPlaceholder label={`Rendering ${diagramTypeLabel} diagram...`} />
      ) : result?.error ? (
        <MermaidErrorCard
          error={result.error}
          errorKind={result.errorKind}
          source={block.source}
          onRetry={() => renderDiagram(true)}
        />
      ) : result?.svg ? (
        <MermaidContainer
          id={block.id}
          svg={result.svg}
          source={block.source}
          diagramType={diagramTypeLabel}
          renderTimeMs={result.renderTimeMs}
          onRerender={() => renderDiagram(true)}
        />
      ) : null}
    </div>
  );
}
