import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { COLORS, MONO_FONT } from "@/styles/theme";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function useGlitchText(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!active) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, idx) => {
            if (idx < iteration) return target[idx];
            if (char === " ") return " ";
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join(""),
      );
      if (iteration >= target.length) clearInterval(interval);
      iteration += 0.5;
    }, 30);
    return () => clearInterval(interval);
  }, [target, active]);

  return display;
}

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(true);
  const [scanLine, setScanLine] = useState(0);
  const [blink, setBlink] = useState(true);

  const errorCode = useGlitchText("404", glitchActive);
  const headline = useGlitchText("NODE_NOT_FOUND", glitchActive);

  useEffect(() => {
    const t = setTimeout(() => setGlitchActive(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(interval);
  }, []);

  const logLines = [
    "> INITIALIZING_REQUEST...",
    "> ROUTING_MATRIX: ACTIVE",
    "> TARGET_NODE: UNKNOWN",
    "> SCANNING_REGISTRY... FAILED",
    "> ERROR: DESTINATION_UNREACHABLE",
    "> SYSTEM_HALTED",
  ];

  return (
    <Box
      sx={{
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle scanline overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(
            transparent ${scanLine}%,
            rgba(255,255,255,0.015) ${scanLine + 0.5}%,
            transparent ${scanLine + 1}%
          )`,
          zIndex: 0,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          width: "100%",
          maxWidth: 420,
          bgcolor: COLORS.primaryUI,
          color: "white",
          borderRadius: 4,
          border: `1px solid ${COLORS.accent}`,
          boxShadow: `0 0 20px ${COLORS.accent}22`,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Corner decorators */}
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => (
          <Box
            key={corner}
            sx={{
              position: "absolute",
              width: 12,
              height: 12,
              borderColor: COLORS.accent,
              borderStyle: "solid",
              opacity: 0.5,
              ...(corner === "topLeft" && {
                top: 10,
                left: 10,
                borderWidth: "1px 0 0 1px",
              }),
              ...(corner === "topRight" && {
                top: 10,
                right: 10,
                borderWidth: "1px 1px 0 0",
              }),
              ...(corner === "bottomLeft" && {
                bottom: 10,
                left: 10,
                borderWidth: "0 0 1px 1px",
              }),
              ...(corner === "bottomRight" && {
                bottom: 10,
                right: 10,
                borderWidth: "0 1px 1px 0",
              }),
            }}
          />
        ))}

        {/* Giant 404 */}
        <Typography
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 900,
            fontSize: { xs: "5rem", md: "7rem" },
            lineHeight: 1,
            textAlign: "center",
            color: COLORS.accent,
            letterSpacing: -2,
            mb: 1,
            textShadow: `0 0 30px ${COLORS.accent}88, 0 0 60px ${COLORS.accent}44`,
            userSelect: "none",
          }}
        >
          {errorCode}
        </Typography>

        {/* Headline */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 900,
            mb: 1,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          {headline}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mb: 3,
            opacity: 0.6,
            fontFamily: MONO_FONT,
          }}
        >
          REQUESTED_RESOURCE_DOES_NOT_EXIST_IN_REGISTRY
        </Typography>

        {/* Log output */}
        <Box
          sx={{
            bgcolor: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 1,
            p: 2,
            mb: 3,
          }}
        >
          {logLines.map((line, i) => (
            <Typography
              key={i}
              sx={{
                fontFamily: MONO_FONT,
                fontSize: "0.65rem",
                opacity: i === logLines.length - 1 ? 1 : 0.5,
                color: i === logLines.length - 1 ? "#f44336" : "white",
                lineHeight: 1.8,
              }}
            >
              {line}
              {i === logLines.length - 1 && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 6,
                    height: "0.7em",
                    bgcolor: "#f44336",
                    ml: 0.5,
                    verticalAlign: "middle",
                    opacity: blink ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                />
              )}
            </Typography>
          ))}
        </Box>

        {/* Actions */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            mb: 1.5,
            py: 1.5,
            bgcolor: COLORS.accent,
            color: COLORS.primaryUI,
            fontWeight: 900,
            fontFamily: MONO_FONT,
            letterSpacing: 1,
            "&:hover": { bgcolor: "#e88a46" },
          }}
        >
          RETURN_TO_HOME
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            py: 1.5,
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 700,
            fontFamily: MONO_FONT,
            fontSize: "0.75rem",
            letterSpacing: 1,
            "&:hover": {
              borderColor: COLORS.accent,
              color: COLORS.accent,
              bgcolor: "transparent",
            },
          }}
        >
          GO_BACK
        </Button>

        {/* Status strip */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: MONO_FONT,
              fontSize: "0.6rem",
              opacity: 0.4,
            }}
          >
            ERR_CODE: 0x0000_0404
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#f44336",
                boxShadow: "0 0 6px #f44336",
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.3 },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: MONO_FONT,
                fontSize: "0.6rem",
                color: "#f44336",
                opacity: 0.8,
              }}
            >
              SYS_FAULT
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
