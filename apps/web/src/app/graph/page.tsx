"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import {
  ReactFlow,
  Background,
  Controls,
  type Node as FlowNode,
  type Edge as FlowEdge,
  type NodeMouseHandler,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ContentContainer,
  Stack,
  Text,
  Banner,
  Card,
  Button,
  theme,
} from "@lurnt/ui";
import { useState } from "react";

const STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  completed: { bg: "#22c55e", border: "#16a34a" },
  unlocked: { bg: "#3b82f6", border: "#2563eb" },
  locked: { bg: "#9ca3af", border: "#6b7280" },
};

function layoutNodes(
  graphNodes: Array<{
    nodeId: string;
    nodeTitle: string;
    status: string;
  }>,
  graphEdges: Array<{
    sourceNodeId: string;
    targetNodeId: string;
    relation: string;
  }>,
): FlowNode[] {
  // Build adjacency for topological sort (prerequisites)
  const prereqTargets = new Map<string, Set<string>>();
  for (const edge of graphEdges) {
    if (edge.relation === "prerequisite") {
      if (!prereqTargets.has(edge.sourceNodeId)) {
        prereqTargets.set(edge.sourceNodeId, new Set());
      }
      prereqTargets.get(edge.sourceNodeId)!.add(edge.targetNodeId);
    }
  }

  // Compute depth (longest path from a root)
  const depths = new Map<string, number>();
  const nodeIds = graphNodes.map((n) => n.nodeId);

  function getDepth(nodeId: string, visited: Set<string>): number {
    if (depths.has(nodeId)) return depths.get(nodeId)!;
    if (visited.has(nodeId)) return 0; // cycle protection
    visited.add(nodeId);

    const prereqs = prereqTargets.get(nodeId);
    if (!prereqs || prereqs.size === 0) {
      depths.set(nodeId, 0);
      return 0;
    }

    let maxPrereqDepth = 0;
    for (const prereqId of prereqs) {
      maxPrereqDepth = Math.max(
        maxPrereqDepth,
        getDepth(prereqId, visited) + 1,
      );
    }
    depths.set(nodeId, maxPrereqDepth);
    return maxPrereqDepth;
  }

  for (const id of nodeIds) {
    getDepth(id, new Set());
  }

  // Group by depth level
  const levels = new Map<number, string[]>();
  for (const id of nodeIds) {
    const d = depths.get(id) ?? 0;
    if (!levels.has(d)) levels.set(d, []);
    levels.get(d)!.push(id);
  }

  const xSpacing = 280;
  const ySpacing = 120;

  return graphNodes.map((gn) => {
    const depth = depths.get(gn.nodeId) ?? 0;
    const levelNodes = levels.get(depth) ?? [];
    const indexInLevel = levelNodes.indexOf(gn.nodeId);
    const levelWidth = levelNodes.length * ySpacing;
    const colors = STATUS_COLORS[gn.status] ?? STATUS_COLORS.locked;

    return {
      id: gn.nodeId,
      position: {
        x: depth * xSpacing,
        y: indexInLevel * ySpacing - levelWidth / 2 + ySpacing / 2,
      },
      data: {
        label: gn.nodeTitle,
        status: gn.status,
      },
      style: {
        background: colors.bg,
        color: "#fff",
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 500,
        opacity: gn.status === "locked" ? 0.5 : 1,
        width: 200,
        textAlign: "center" as const,
      },
    };
  });
}

function buildFlowEdges(
  graphEdges: Array<{
    edgeId: string;
    sourceNodeId: string;
    targetNodeId: string;
    relation: string;
    weight: number;
  }>,
): FlowEdge[] {
  return graphEdges.map((ge) => ({
    id: ge.edgeId,
    source: ge.targetNodeId,
    target: ge.sourceNodeId,
    type: "default",
    animated: ge.relation === "prerequisite",
    style: {
      stroke: ge.relation === "prerequisite" ? "#3b82f6" : "#9ca3af",
      strokeWidth: ge.relation === "prerequisite" ? 2 : 1,
      strokeDasharray: ge.relation === "related" ? "5 5" : undefined,
      opacity: 0.6,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: ge.relation === "prerequisite" ? "#3b82f6" : "#9ca3af",
    },
  }));
}

interface SelectedNodeInfo {
  kgNodeId: string;
  title: string;
  description: string | null;
  status: string;
}

function GraphContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userExpertiseId = searchParams.get("ue");
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const graphQuery = trpc.knowledgeGraph.getGraph.useQuery(
    { userExpertiseId: userExpertiseId! },
    { enabled: !!userExpertiseId },
  );

  const initialNodes = useMemo(() => {
    if (!graphQuery.data) return [];
    return layoutNodes(graphQuery.data.nodes, graphQuery.data.edges);
  }, [graphQuery.data]);

  const initialEdges = useMemo(() => {
    if (!graphQuery.data) return [];
    return buildFlowEdges(graphQuery.data.edges);
  }, [graphQuery.data]);

  const [flowNodes, , onNodesChange] = useNodesState(initialNodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (!graphQuery.data) return;
      const graphNode = graphQuery.data.nodes.find(
        (n: { nodeId: string }) => n.nodeId === node.id,
      );
      if (graphNode) {
        setSelectedNode({
          kgNodeId: graphNode.id,
          title: graphNode.nodeTitle,
          description: graphNode.nodeDescription,
          status: graphNode.status,
        });
      }
    },
    [graphQuery.data],
  );

  if (!userExpertiseId) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Banner variant="danger">
          Missing user expertise ID.
        </Banner>
      </ContentContainer>
    );
  }

  if (graphQuery.isLoading) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Text>Loading your knowledge graph...</Text>
      </ContentContainer>
    );
  }

  if (graphQuery.error) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Banner variant="danger">{graphQuery.error.message}</Banner>
      </ContentContainer>
    );
  }

  if (!graphQuery.data || graphQuery.data.nodes.length === 0) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Text>No knowledge graph found. Complete your assessment first.</Text>
      </ContentContainer>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Text variant="h3" style={{ margin: 0 }}>
          {graphQuery.data.expertiseTitle}
        </Text>
        <Stack direction="row" gap="1rem" style={{ marginLeft: "auto" }}>
          <Stack direction="row" gap="0.25rem" align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: STATUS_COLORS.completed.bg,
              }}
            />
            <Text variant="small">Completed</Text>
          </Stack>
          <Stack direction="row" gap="0.25rem" align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: STATUS_COLORS.unlocked.bg,
              }}
            />
            <Text variant="small">Unlocked</Text>
          </Stack>
          <Stack direction="row" gap="0.25rem" align="center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: STATUS_COLORS.locked.bg,
              }}
            />
            <Text variant="small">Locked</Text>
          </Stack>
        </Stack>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={flowNodes.length > 0 ? flowNodes : initialNodes}
          edges={flowEdges.length > 0 ? flowEdges : initialEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* Node detail panel */}
        {selectedNode && (
          <Card
            padding="md"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              width: 300,
              zIndex: 10,
            }}
          >
            <Stack gap="0.5rem">
              <Stack
                direction="row"
                justify="space-between"
                align="center"
              >
                <Text variant="h3" style={{ margin: 0 }}>
                  {selectedNode.title}
                </Text>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ✕
                </Button>
              </Stack>
              <Stack direction="row" gap="0.25rem" align="center">
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                      STATUS_COLORS[selectedNode.status]?.bg ?? "#9ca3af",
                  }}
                />
                <Text variant="small" style={{ textTransform: "capitalize" }}>
                  {selectedNode.status}
                </Text>
              </Stack>
              {selectedNode.description && (
                <Text variant="small" style={{ color: theme.colors.textMuted }}>
                  {selectedNode.description}
                </Text>
              )}
              {selectedNode.status !== "locked" && (
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/quiz?kgNode=${selectedNode.kgNodeId}&ue=${userExpertiseId}`,
                    )
                  }
                >
                  {selectedNode.status === "completed"
                    ? "Retake Quiz"
                    : "Take Quiz"}
                </Button>
              )}
            </Stack>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function GraphPage() {
  return (
    <Suspense>
      <GraphContent />
    </Suspense>
  );
}
