export function formatCurrency(amount: number): string {
  return `Bs. ${amount.toFixed(0)}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatWhatsAppUrl(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.startsWith('591')) {
    return `https://wa.me/${digitsOnly}`;
  }
  return `https://wa.me/591${digitsOnly}`;
}
