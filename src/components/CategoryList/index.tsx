import { Divider, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface CategoryListProps {
    divided?: boolean;
    spacing?: number;
    children: React.ReactNode[];
}

const CategoryList: FunctionComponent<CategoryListProps> = (props) => {
    return (
        <Stack spacing={props.spacing}>
            {props.children.map((child, index) => {
                return (
                    <>
                        {props.divided && index > 0 && <Divider />}
                        {child}
                    </>
                );
            })}
        </Stack>
    );
};

CategoryList.defaultProps = {
    divided: true,
    spacing: 2,
};

interface CategoryListItemProps {
    title: string | React.ReactNode | React.ReactNode[];
    description: string | React.ReactNode | React.ReactNode[];
    children: string | React.ReactNode | React.ReactNode[];
    divided?: boolean;
    spacing?: number;
}

const CategoryListItem: FunctionComponent<CategoryListItemProps> = (props) => {
    return (
        <Stack direction="row" alignItems="left" spacing={props.spacing}>
            <span
                style={{
                    width: 300,
                    flexShrink: 0,
                    flexGrow: 0,
                }}
            >
                <Typography variant="h6">{props.title}</Typography>
                <Typography variant="subtitle2">{props.description}</Typography>
            </span>

            {props.divided && <Divider orientation="vertical" flexItem />}

            <span
                style={{
                    width: "100%",
                }}
            >
                {props.children}
            </span>
        </Stack>
    );
};

CategoryListItem.defaultProps = {
    divided: true,
    spacing: 2,
};

export { CategoryList, CategoryListItem };
