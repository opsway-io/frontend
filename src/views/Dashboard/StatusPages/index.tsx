import { Card, CardContent, CardHeader } from "@mui/material";
import { FunctionComponent } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";

const StatusPagesView: FunctionComponent = () => {
    return (
        <Container>
            <ContainerHeader>Status pages</ContainerHeader>

            <Card>
                <CardHeader title="Settings" />
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nesciunt sed mollitia at. Unde quidem voluptas quod accusantium laudantium! Saepe ipsam cupiditate corrupti, sunt nostrum ratione laboriosam asperiores sed provident.
                </CardContent>
            </Card>


            <Card>
                <CardHeader title="Look and feel" />
                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum nesciunt sed mollitia at. Unde quidem voluptas quod accusantium laudantium! Saepe ipsam cupiditate corrupti, sunt nostrum ratione laboriosam asperiores sed provident.
                </CardContent>
            </Card>
        </Container>
    );
};

export default StatusPagesView;
