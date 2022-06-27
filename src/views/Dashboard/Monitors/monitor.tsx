import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import Placeholder from "../../../components/Placeholder";

const MonitorView: FunctionComponent = () => {
    const { id } = useParams<string>();

    return (
        <Container>
            <ContainerHeader>{id}</ContainerHeader>

            <Placeholder />
        </Container>
    );
};

export default MonitorView;
