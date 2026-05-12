export function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency', currency: 'XAF', minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateTime(isoString) {
  return `${formatDate(isoString)} · ${formatTime(isoString)}`;
}
