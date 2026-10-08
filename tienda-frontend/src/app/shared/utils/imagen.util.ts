export const PRODUCTO_PLACEHOLDER = '/images/producto-placeholder.svg';

export function manejarErrorImagenProducto(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (img.src.endsWith(PRODUCTO_PLACEHOLDER)) return;
  img.src = PRODUCTO_PLACEHOLDER;
}
