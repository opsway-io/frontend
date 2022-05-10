import { FunctionComponent } from "react";

interface ContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

const Container: FunctionComponent<ContainerProps> = (props) => {
    return (
        <>
            {props.children}
        </>
    );
};

export default Container;
