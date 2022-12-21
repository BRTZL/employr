import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/trpc";

export default function UserDetailsPage() {
  const { query } = useRouter();
  const { data, isLoading } = trpc.user.getById.useQuery({
    id: query.userId as string,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box m={4}>
        <Grid container spacing={2} mb={4}>
          <Grid item xs={8}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={1}>
                <Avatar alt={data?.name} src={data?.image ?? ""} />
              </Grid>
              <Grid item>
                <Typography variant="h4" fontWeight="bold">
                  {data?.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Typography>{data?.email}</Typography>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="h6">{data?.department}</Typography>
            <Typography variant="subtitle1">{data?.role}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Notes From other Users
        </Typography>
        {data?.notes.map((note) => (
          <Grid key={note.id} container>
            <Grid xs={12}>
              <Typography variant="h5">{note.title}</Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant="body1">{note.content}</Typography>
            </Grid>
          </Grid>
        ))}
        {data?.notes.length === 0 && (
          <Typography variant="body1" mb={2}>
            No notes yet
          </Typography>
        )}

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Projects
        </Typography>
        {data?.projects.map((project) => (
          <Accordion key={project.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography>{project.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Tasks</Typography>
              <ul>
                {data?.tasks
                  .filter((task) => task.projectId === project.id)
                  .map((task) => (
                    <li key={task.id}>{task.name}</li>
                  ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
