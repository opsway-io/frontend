import {
  Button,
  ButtonGroup,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { FaBox, FaSearch } from "react-icons/fa";
import { useDraggable } from "@dnd-kit/core";

interface LeftBarProps {
  idk?: string;
}

const LeftBar: FunctionComponent<LeftBarProps> = () => {
  return (
    <Paper
      sx={{
        width: 300,
        gap: 2,
      }}
      padding={2}
      component={Stack}
    >
      <Typography variant="h1" fontSize={18} fontWeight={800}>
        Components
      </Typography>

      <ButtonGroup fullWidth>
        <Button variant="contained">Add</Button>
        <Button>Layers</Button>
      </ButtonGroup>

      <OutlinedInput
        size="small"
        placeholder="Search..."
        endAdornment={
          <InputAdornment position="end">
            <FaSearch />
          </InputAdornment>
        }
      />

      <Typography variant="h2" fontSize={16} fontWeight={800}>
        Basic
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
      </Grid>

      <Typography variant="h2" fontSize={16} fontWeight={800}>
        Layout
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
      </Grid>

      <Typography variant="h2" fontSize={16} fontWeight={800}>
        Metrics
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
        <Grid item xs={4}>
          <ComponentItem />
        </Grid>
      </Grid>
    </Paper>
  );
};

interface ComponentItemProps {
  idk?: string;
}

const ComponentItem: FunctionComponent<ComponentItemProps> = () => {
  const [id, setId] = useState(0);

  useEffect(() => {
    setId(Math.floor(Math.random() * 10000));
  }, []);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(.9)`,
      }
    : undefined;

  return (
    <Paper elevation={2}>
      <Paper
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          padding: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
          userSelect: "none",

          "&:hover": {
            borderColor: "primary.main",
            cursor: "pointer",
          },
        }}
      >
        <FaBox size={18} />
        <Typography variant="caption">Box</Typography>
      </Paper>
    </Paper>
  );
};

export default LeftBar;
