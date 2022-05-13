import { FunctionComponent } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import Placeholder from "../../../components/Placeholder";

const IncidentsView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>Incidents</ContainerHeader>

            <Placeholder />
        </Container>
    );
};

export default IncidentsView;
