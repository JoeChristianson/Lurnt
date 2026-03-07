import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

interface Tab {
  key: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultTab ?? tabs[0]?.key ?? "");

  const tabBarStyle: CSSProperties = {
    display: "flex",
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    marginBottom: "1rem",
  };

  const getTabStyle = (isActive: boolean): CSSProperties => ({
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "none",
    background: "none",
    fontSize: "0.9rem",
    fontWeight: isActive ? 600 : 400,
    color: isActive ? theme.colors.primary : theme.colors.textMuted,
    borderBottom: isActive
      ? `2px solid ${theme.colors.primary}`
      : "2px solid transparent",
  });

  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div>
      <div style={tabBarStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={getTabStyle(tab.key === activeKey)}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  );
}
