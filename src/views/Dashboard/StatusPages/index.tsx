import { Card, CardContent, CardHeader } from "@mui/material";
import { FunctionComponent } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import Placeholder from "../../../components/Placeholder";

const StatusPagesView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>Status pages</ContainerHeader>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    <Placeholder />
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Look and feel" />
                <CardContent>
                    <Placeholder />
                </CardContent>
            </Card>
        </Container>
    );
};

export default StatusPagesView;
