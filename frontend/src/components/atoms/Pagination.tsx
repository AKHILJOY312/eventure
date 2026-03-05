import { Box, Button, Typography } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  totalPages?: number;
  hasMore?: boolean;
}

export function Pagination({
  currentPage,
  onPageChange,
  totalPages,
  hasMore = true,
}: PaginationProps) {
  const canGoNext = totalPages ? currentPage < totalPages : hasMore;

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

      <Typography fontWeight={600}>
        Page {currentPage}
        {totalPages ? ` of ${totalPages}` : ""}
      </Typography>

      <Button
        variant="outlined"
        disabled={!canGoNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </Box>
  );
}
