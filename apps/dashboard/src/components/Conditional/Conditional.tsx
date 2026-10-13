import { FunctionComponent, ReactNode } from "react";

interface ConditionalProps {
  value?: unknown;
  /** When set, `value` must equal `target` instead of merely being truthy. */
  target?: unknown;
  mode?: "show" | "hide";
  children?: ReactNode;
}

const Conditional: FunctionComponent<ConditionalProps> = ({
  value,
  target,
  mode = "show",
  children,
}) => {
  const matches = target ? value === target : !!value;
  const show = mode === "show" ? matches : !matches;

  return show ? children : null;
};

export default Conditional;
