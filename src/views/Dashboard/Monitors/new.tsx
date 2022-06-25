import { Card, CardContent } from "@mui/material";
import { FunctionComponent } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";

const NewMonitorView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>New monitor</ContainerHeader>

            <Card>
                <CardContent></CardContent>
            </Card>
        </Container>
    );
};

export default NewMonitorView;
