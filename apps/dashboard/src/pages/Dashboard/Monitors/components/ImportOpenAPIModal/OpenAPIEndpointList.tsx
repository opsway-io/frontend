import {
  Box,
  Checkbox,
  List,
  ListDivider,
  ListItem,
  Sheet,
  Typography,
} from "@mui/joy";
import { Fragment, FunctionComponent } from "react";
import { PreviewOpenAPIEndpoint } from "../../../../../api/endpoints/monitors";
import { getEndpointLabel, getEndpointName } from "./buildImportRequest";

interface OpenAPIEndpointListProps {
  endpoints: PreviewOpenAPIEndpoint[];
  selected: number[];
  onToggle: (index: number) => void;
  validateBodyFields?: boolean;
}

const OpenAPIEndpointList: FunctionComponent<OpenAPIEndpointListProps> = (
  props,
) => {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "lg",
        maxHeight: 300,
        overflow: "auto",
        bgcolor: "background.surface",
      }}
    >
      <List size="sm" sx={{ "--ListItem-paddingY": "8px" }}>
        {props.endpoints.map((endpoint, index) => (
          <Fragment key={getEndpointLabel(endpoint)}>
            {index > 0 && <ListDivider inset="gutter" />}
            <ListItem
              endAction={
                <Typography level="body-xs" textColor="text.tertiary" noWrap>
                  Expect {endpoint.statusCode}
                  {props.validateBodyFields !== false &&
                    endpoint.assertions &&
                    endpoint.assertions.length > 1 && (
                      <> · {endpoint.assertions.length} assertions</>
                    )}
                </Typography>
              }
              sx={{ pr: 12 }}
            >
              <Checkbox
                overlay
                size="sm"
                checked={props.selected.includes(index)}
                onChange={() => props.onToggle(index)}
                sx={{ alignItems: "flex-start", minWidth: 0 }}
                label={
                  <Box sx={{ minWidth: 0 }}>
                    <Typography level="title-sm" noWrap>
                      {getEndpointName(endpoint)}
                    </Typography>
                    <Typography
                      level="body-xs"
                      textColor="text.tertiary"
                      fontFamily="code"
                      noWrap
                    >
                      {getEndpointLabel(endpoint)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </Fragment>
        ))}
      </List>
    </Sheet>
  );
};

export default OpenAPIEndpointList;
