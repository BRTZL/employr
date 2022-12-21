import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Avatar, Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import type { User as UserModel } from "@prisma/client";
import Link from "next/link";
import * as React from "react";
import { trpc } from "../../utils/trpc";

type User = Omit<UserModel, "password" | "emailVerified" | "image">;

interface HeadCell {
  id: keyof User;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "department",
    label: "Department",
  },
  {
    id: "position",
    label: "Position",
  },
];

export default function EnhancedTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const { data } = trpc.user.getAll.useQuery({
    page,
    rowsPerPage,
  });
  const totalCount = data?.totalCount ?? 0;
  const rows = data?.users ?? [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl" sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align="left" padding={"normal"}>
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell key={"options"} align="left" padding={"normal"}>
                  Options
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="left">
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar alt={row.name} src={row.image ?? ""} />
                        </Grid>
                        <Grid item>{row.name}</Grid>
                      </Grid>
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.department}</TableCell>
                    <TableCell align="left">{row.position}</TableCell>
                    <TableCell padding="normal">
                      <Box sx={{ display: "flex" }}>
                        <IconButton
                          href={`/users/${row.id}/edit`}
                          LinkComponent={Link}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          href={`/users/${row.id}`}
                          LinkComponent={Link}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
    </Box>
  );
}
