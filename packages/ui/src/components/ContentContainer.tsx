import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

const CLASS_NAME = "erz-content-container";

const styleTag = `
.${CLASS_NAME} {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
@media (max-width: ${theme.breakpoints.mobile}) {
  .${CLASS_NAME} {
    max-width: 100%;
  }
}
`;

interface ContentContainerProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function ContentContainer({ children, style }: ContentContainerProps) {
  return (
    <>
      <style>{styleTag}</style>
      <div className={CLASS_NAME} style={style}>
        {children}
      </div>
    </>
  );
}
