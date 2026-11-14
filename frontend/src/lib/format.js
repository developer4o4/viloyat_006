export const formatDate = (value) => new Intl.DateTimeFormat("uz-UZ", {
  day: "2-digit",
  month: "long",
  year: "numeric",
}).format(new Date(value));

export const formatTime = (value) => new Intl.DateTimeFormat("uz-UZ", {
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(value));