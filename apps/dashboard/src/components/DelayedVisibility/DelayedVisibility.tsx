import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface DelayedVisibilityProps {
  children: ReactNode;
  delay?: number;
}

/** Renders its children only after `delay` ms, to avoid flashing loaders. */
const DelayedVisibility: FunctionComponent<DelayedVisibilityProps> = ({
  delay = 1000,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return visible ? children : null;
};

export default DelayedVisibility;
