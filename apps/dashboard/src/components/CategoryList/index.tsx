import { Box, Divider, Stack, Typography } from "@mui/material";
import React, { Fragment, FunctionComponent } from "react";

interface CategoryListProps {
  divided?: boolean;
  spacing?: number;
  children: React.ReactNode | React.ReactNode[];
}

const CategoryList: FunctionComponent<CategoryListProps> = (props) => {
  const children: React.ReactNode[] = React.Children.toArray(props.children);

  return (
    <Stack spacing={props.spacing}>
      {children.map((child, index) => {
        return (
          <Fragment key={index}>
            {props.divided && index > 0 && <Divider key={index} />}
            {child}
          </Fragment>
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
  description?: string | React.ReactNode | React.ReactNode[];
  children: string | React.ReactNode | React.ReactNode[];
  divided?: boolean;
  spacing?: number;
  childrenSpacing?: number;
}

const CategoryListItem: FunctionComponent<CategoryListItemProps> = (props) => {
  return (
    <Stack
      alignItems="left"
      spacing={props.spacing}
      direction={{ md: "column", lg: "row" }}
    >
      <Box
        sx={{
          maxWidth: {
            md: "100%",
            lg: "300px",
          },
          flexShrink: 0,
          flexGrow: 1,
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          {props.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
          {props.description}
        </Typography>
      </Box>

      {props.divided && (
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { md: "none", lg: "block" },
          }}
        />
      )}

      <Stack spacing={props.childrenSpacing} flexGrow={1}>
        {props.children}
      </Stack>
    </Stack>
  );
};

CategoryListItem.defaultProps = {
  divided: true,
  spacing: 2,
  childrenSpacing: 2,
};

export { CategoryList, CategoryListItem };
