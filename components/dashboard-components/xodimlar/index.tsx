"use client";
import { request } from "@/request";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  IconButton,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  useTheme,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  Phone,
  ArrowDropDown,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status?: string;
  role?: string;
}

interface EmployeeResponse {
  content: Employee[];
}

export default function EmployeeList() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);

  const { data, isLoading, isError } = useQuery<EmployeeResponse>({
    queryKey: ["xodimlar"],
    queryFn: async () => {
      const res = await request.get("/employee/get-all");
      return res.data ?? { content: [] };
    },
  });

  useEffect(() => {
    if (data?.content) {
      let result = data.content;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (em) =>
            em.firstName.toLowerCase().includes(term) ||
            em.lastName.toLowerCase().includes(term) ||
            em.phoneNumber.toLowerCase().includes(term)
        );
      }

      if (activeFilters.length > 0) {
        result = result.filter((em) => {
          if (activeFilters.includes("active") && em.status !== "active")
            return false;
          if (activeFilters.includes("manager") && em.role !== "manager")
            return false;
          return true;
        });
      }

      setFilteredData(result);
    }
  }, [data, searchTerm, activeFilters]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  if (isError)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Chip
          label="Xatolik yuz berdi, iltimos qayta urunib ko'ring"
          color="error"
          variant="outlined"
          sx={{ px: 2, py: 1, fontSize: "0.9rem" }}
        />
      </Box>
    );

  const displayData = isLoading
    ? []
    : filteredData.length > 0
    ? filteredData
    : data?.content ?? [];

  return (
    <Box sx={{ p: 4, pt: 0 }}>
      <Box
        sx={{
          zIndex: 1100,
          py: 3,
          mb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 36,
                height: 36,
                fontSize: "1rem",
              }}
            >
              {displayData.length || 0}
            </Avatar>
            Xodimlar ro&apos;yxati
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              endIcon={<ArrowDropDown />}
              onClick={handleFilterClick}
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                minWidth: 120,
              }}
            >
              Filtrlash
              {activeFilters.length > 0 && (
                <Chip
                  label={activeFilters.length}
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Button>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  p: 2,
                  minWidth: 200,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Filtrlash
              </Typography>
              <MenuItem dense>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={activeFilters.includes("active")}
                      onChange={() => toggleFilter("active")}
                    />
                  }
                  label="Faol xodimlar"
                />
              </MenuItem>
              <MenuItem dense>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={activeFilters.includes("manager")}
                      onChange={() => toggleFilter("manager")}
                    />
                  }
                  label="Menejerlar"
                />
              </MenuItem>
              <MenuItem dense>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={activeFilters.includes("new")}
                      onChange={() => toggleFilter("new")}
                    />
                  }
                  label="Yangi xodimlar"
                />
              </MenuItem>
              <Box
                sx={{
                  pt: 1,
                  mt: 1,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Button
                  size="small"
                  fullWidth
                  onClick={() => setActiveFilters([])}
                  disabled={activeFilters.length === 0}
                >
                  Tozalash
                </Button>
              </Box>
            </Menu>

            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.dark },
                minWidth: 160,
              }}
            >
              Yangi xodim
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, maxWidth: 500 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Xodimlarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              },
            }}
          />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.grey[50],
                "& th": {
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  py: 2,
                },
              }}
            >
              <TableCell>№</TableCell>
              <TableCell>Ism</TableCell>
              <TableCell>Familiya</TableCell>
              <TableCell>Telefon raqam</TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={140} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton
                      variant="circular"
                      width={32}
                      height={32}
                      sx={{ display: "inline-block", mr: 1 }}
                    />
                    <Skeleton
                      variant="circular"
                      width={32}
                      height={32}
                      sx={{ display: "inline-block" }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Search
                      sx={{ fontSize: 40, color: theme.palette.text.disabled }}
                    />
                    <Typography variant="body1" color="textSecondary">
                      {searchTerm || activeFilters.length > 0
                        ? "Filtrga mos xodimlar topilmadi"
                        : "Xodimlar topilmadi"}
                    </Typography>
                    {(searchTerm || activeFilters.length > 0) && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSearchTerm("");
                          setActiveFilters([]);
                        }}
                      >
                        Filtrlarni tozalash
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((em, index) => (
                <TableRow
                  key={em.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{em.firstName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{em.lastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={em.phoneNumber}
                      size="small"
                      icon={<Phone fontSize="small" />}
                      sx={{
                        borderRadius: 1,
                        bgcolor: theme.palette.grey[100],
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: theme.palette.primary.light,
                        "&:hover": { bgcolor: theme.palette.primary.main },
                      }}
                    >
                      <Edit fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: theme.palette.error.light,
                        "&:hover": { bgcolor: theme.palette.error.main },
                      }}
                    >
                      <Delete fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}