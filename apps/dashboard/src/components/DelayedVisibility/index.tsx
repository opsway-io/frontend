import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface DelayedVisibilityProps {
  children: ReactNode | ReactNode[];
  delay?: number;
}

const DelayedVisibility: FunctionComponent<DelayedVisibilityProps> = (
  props
) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, props.delay);
  }, []);

  return <>{visible ? props.children : null}</>;
};

DelayedVisibility.defaultProps = {
  delay: 1000,
};

export default DelayedVisibility;
