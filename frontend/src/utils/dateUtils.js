export function formatDate(
  date,
  options = {}
) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(
    "en-US",
    {
      ...defaultOptions,
      ...options,
    }
  ).format(parsedDate);
}

export function formatDateTime(
  date
) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(parsedDate);
}

export function formatRelativeTime(
  date
) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  const difference =
    Date.now() -
    parsedDate.getTime();

  const seconds = Math.floor(
    Math.abs(difference) / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} minute${
      minutes !== 1 ? "s" : ""
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hour${
      hours !== 1 ? "s" : ""
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} day${
      days !== 1 ? "s" : ""
    } ago`;
  }

  return formatDate(parsedDate);
}

export function isToday(date) {
  if (!date) {
    return false;
  }

  const target = new Date(date);
  const today = new Date();

  return (
    target.getFullYear() ===
      today.getFullYear() &&
    target.getMonth() ===
      today.getMonth() &&
    target.getDate() ===
      today.getDate()
  );
}

export function isValidDate(date) {
  if (!date) {
    return false;
  }

  const parsedDate = new Date(date);

  return !Number.isNaN(
    parsedDate.getTime()
  );
}