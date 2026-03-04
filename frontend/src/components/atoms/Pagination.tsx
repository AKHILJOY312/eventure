import { Box, Button, Typography } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  // totalPages is helpful if your API provides it
  hasMore?: boolean;
}

export function Pagination({
  currentPage,
  onPageChange,
  hasMore = true,
}: PaginationProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mt: 4,
        pb: 2,
      }}
    >
      <Button
        variant="outlined"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      <Typography fontWeight={600}>Page {currentPage}</Typography>

      <Button
        variant="outlined"
        disabled={!hasMore} // Disable if no more data
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </Box>
  );
}
