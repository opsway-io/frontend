import { FunctionComponent } from "react";

interface ConditionalProps {
  value?: any;
  target?: any;
  mode?: "show" | "hide";
  children?: React.ReactNode | React.ReactNode[];
}

const Conditional: FunctionComponent<ConditionalProps> = (props) => {
  const isTargetValue = props.target
    ? props.value === props.target
    : !!props.value;
  const show = props.mode === "show" ? isTargetValue : !isTargetValue;

  return <>{show ? props.children : null}</>;
};

Conditional.defaultProps = {
  mode: "show",
};

export default Conditional;
