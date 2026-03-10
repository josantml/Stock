import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'es-AR',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  // 2. LÓGICA DE SALTO (STEP)
  // Si el valor máximo es muy alto, se aumenta el paso para que no haya tantas etiquetas
  let step = 1000; // Por defecto salta de 1 mil en 1 mil

  if (topLabel >= 50000) {
    step = 10000; // De 10 mil en 10 mil (ej: 50k, 40k, 30k...)
  } else if (topLabel >= 10000) {
    step = 5000;  // De 5 mil en 5 mil (ej: 10k, 5k, 0k) <--- Tu ejemplo deseado
  } else if (topLabel >= 5000) {
    step = 2500;  // De 2.5 mil en 2.5 mil
  }

  for (let i = topLabel; i >= 0; i -= step) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
