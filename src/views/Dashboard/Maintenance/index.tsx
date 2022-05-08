import { Card, CardContent } from "@mui/material";
import { FunctionComponent } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";

const MaintenanceView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>Maintenance</ContainerHeader>

            <Card>
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum illum, consectetur beatae ducimus
                    dicta aperiam ipsam, ab suscipit accusamus, harum quam corrupti voluptatem iusto! Delectus assumenda
                    qui ducimus. Perspiciatis, ipsa.
                </CardContent>
            </Card>
        </Container>
    );
};

export default MaintenanceView;
