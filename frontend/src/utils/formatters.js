export function formatNumber(
  value,
  maximumFractionDigits = 0
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits,
    }
  ).format(Number(value));
}

export function formatScore(score) {
  if (
    score === null ||
    score === undefined ||
    Number.isNaN(Number(score))
  ) {
    return "—";
  }

  return `${Math.round(Number(score))}`;
}

export function formatPercentage(
  value,
  maximumFractionDigits = 0
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `${Number(value).toFixed(
    maximumFractionDigits
  )}%`;
}

export function formatDuration(
  milliseconds
) {
  if (
    milliseconds === null ||
    milliseconds === undefined ||
    Number.isNaN(Number(milliseconds))
  ) {
    return "—";
  }

  const totalSeconds =
    Number(milliseconds) / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds = Math.round(
    totalSeconds % 60
  );

  return `${minutes}m ${seconds}s`;
}

export function truncateText(
  text,
  maxLength = 50
) {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(
    0,
    maxLength
  )}...`;
}

export function formatUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);

    return parsedUrl.hostname.replace(
      /^www\./,
      ""
    );
  } catch {
    return url;
  }
}

export function formatDevice(device) {
  if (!device) {
    return "Unknown";
  }

  const normalized =
    String(device).toLowerCase();

  if (normalized === "desktop") {
    return "Desktop";
  }

  if (normalized === "mobile") {
    return "Mobile";
  }

  if (normalized === "tablet") {
    return "Tablet";
  }

  return device;
}