import re

with open("src/pages/Dashboard/Monitors/Detail/components/ResponseTimesGraph.tsx", "r") as f:
    content = f.read()

# Replace colors
old_colors = """      colors: isAnomalyMode
        ? [
            theme.palette.primary.main, // Actual: Blue
            theme.palette.success.main, // Expected: Green
            theme.palette.text.secondary, // Upper Limit: Grey
            theme.palette.text.secondary, // Lower Limit: Grey
            theme.palette.error.main, // Anomaly: Red
          ]
        : [
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
          ],"""

new_colors = """      colors: isAnomalyMode
        ? [
            theme.palette.primary.main, // Actual: Blue
            theme.palette.success.main, // Expected: Green
            "rgba(100,100,100,0.2)", // Confidence Bounds (RangeArea)
            theme.palette.error.main, // Anomaly: Red
          ]
        : [
            "#008FFB", // DNS - Blue
            "#00E396", // TCP - Green
            "#FEB019", // TLS - Yellow
            "#FF4560", // Processing - Red
            "#775DD0", // Transfer - Purple
          ],"""
content = content.replace(old_colors, new_colors)

# Replace stroke
old_stroke = """      stroke: {
        curve: "smooth",
        width: isAnomalyMode ? [3, 2, 1.5, 1.5, 0] : 4,
        dashArray: isAnomalyMode ? [0, 0, 5, 5, 0] : 0,
      },"""

new_stroke = """      stroke: {
        curve: "smooth",
        width: isAnomalyMode ? [3, 2, 0, 0] : 2,
        dashArray: isAnomalyMode ? [0, 5, 0, 0] : 0,
      },"""
content = content.replace(old_stroke, new_stroke)

# Replace fill
old_fill = """      fill: {
        type: "solid",
        opacity: isAnomalyMode ? [1, 0.8, 0.1, 0.1, 1] : 0.6,
      },"""

new_fill = """      fill: {
        type: isAnomalyMode ? "solid" : "gradient",
        opacity: isAnomalyMode ? [1, 1, 0.2, 1] : 0.8,
        gradient: isAnomalyMode ? undefined : {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },"""
content = content.replace(old_fill, new_fill)

# Replace grid
old_grid = """      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },"""

new_grid = """      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        },
      },"""
content = content.replace(old_grid, new_grid)

# Replace xaxis
old_xaxis = """      xaxis: {
        axisBorder: {
          show: true,
          color: theme.palette.divider,
        },
        range: isAnomalyMode ? props.interval + 86400000 : props.interval,
        type: "datetime",
        tickAmount: 10,
        labels: {
          formatter: (value) => {
            return moment(value).format("DD/MM-HH:mm");
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },"""

new_xaxis = """      xaxis: {
        axisBorder: {
          show: true,
          color: theme.palette.divider,
        },
        range: isAnomalyMode ? props.interval + 86400000 : props.interval,
        type: "datetime",
        tickAmount: 10,
        labels: {
          formatter: (value) => {
            if (props.interval > 86400000 * 3) {
              return moment(value).format("MMM DD");
            }
            return moment(value).format("MMM DD, HH:mm");
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },"""
content = content.replace(old_xaxis, new_xaxis)

# Replace yaxis
old_yaxis = """      yaxis: {
        type: "numeric",
        labels: {
          formatter: (value) => {
            return `${value} ms`;
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },"""

new_yaxis = """      yaxis: {
        type: "numeric",
        labels: {
          formatter: (value) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(2)} s`;
            }
            return `${Math.round(value)} ms`;
          },
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },"""
content = content.replace(old_yaxis, new_yaxis)

# Replace markers
old_markers = """      markers: {
        size: isAnomalyMode ? [0, 0, 0, 0, 6] : 0,
        hover: {
          size: 4,
        },
      },"""

new_markers = """      markers: {
        size: isAnomalyMode ? [0, 0, 0, 6] : 0,
        hover: {
          size: 4,
        },
      },"""
content = content.replace(old_markers, new_markers)

# Replace tooltip
old_tooltip = """      tooltip: {
        enabled: true,
        theme: "dark",
      },"""

new_tooltip = """      tooltip: {
        enabled: true,
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => {
            if (value == null) return "N/A";
            if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
            return `${Math.round(value)} ms`;
          }
        }
      },"""
content = content.replace(old_tooltip, new_tooltip)

# Fix anomaly mode series mapping
old_anomaly_series = """      return [
        {
          name: "Actual Response Time",
          type: "line" as const,
          data: actualData,
        },
        {
          name: "Expected Time (Profile)",
          type: "line" as const,
          data: expectedData,
        },
        {
          name: "Confidence Upper Bound",
          type: "line" as const,
          data: upperData,
        },
        {
          name: "Confidence Lower Bound",
          type: "line" as const,
          data: lowerData,
        },
        {
          name: "Anomaly Detected",
          type: "scatter" as const,
          data: anomalyData,
        },
      ];"""

new_anomaly_series = """      // Group upper and lower bounds into a rangeArea series
      const rangeBounds = upperData.map((u, i) => {
        const l = lowerData[i]?.y || 0;
        return {
          x: u.x,
          y: [l, u.y]
        };
      });

      return [
        {
          name: "Actual Response Time",
          type: "line" as const,
          data: actualData,
        },
        {
          name: "Expected Time (Profile)",
          type: "line" as const,
          data: expectedData,
        },
        {
          name: "Confidence Bounds",
          type: "rangeArea" as const,
          data: rangeBounds,
        },
        {
          name: "Anomaly Detected",
          type: "scatter" as const,
          data: anomalyData,
        },
      ];"""
content = content.replace(old_anomaly_series, new_anomaly_series)

with open("src/pages/Dashboard/Monitors/Detail/components/ResponseTimesGraph.tsx", "w") as f:
    f.write(content)
