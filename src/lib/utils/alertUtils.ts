import { alerts } from '../stores/alertStore';

/**
 * Muestra una alerta de éxito
 * @param message Mensaje a mostrar
 * @param timeout Tiempo en milisegundos que se mostrará la alerta (por defecto 5000ms)
 */
export function showSuccess(message: string, timeout = 5000): void {
  alerts.success(message, timeout);
}

/**
 * Muestra una alerta de error
 * @param message Mensaje a mostrar
 * @param timeout Tiempo en milisegundos que se mostrará la alerta (por defecto 5000ms)
 */
export function showError(message: string, timeout = 5000): void {
  alerts.error(message, timeout);
}

/**
 * Muestra una alerta de consejo o información
 * @param message Mensaje a mostrar
 * @param timeout Tiempo en milisegundos que se mostrará la alerta (por defecto 5000ms)
 */
export function showAdvice(message: string, timeout = 5000): void {
  alerts.advice(message, timeout);
}

/**
 * Función principal para mostrar alertas
 * @param type Tipo de alerta: 'success', 'error', o 'advice'
 * @param message Mensaje a mostrar
 * @param timeout Tiempo en milisegundos que se mostrará la alerta (por defecto 5000ms)
 */
export function showAlert(type: 'success' | 'error' | 'advice', message: string, timeout = 5000): void {
  switch (type) {
    case 'success':
      showSuccess(message, timeout);
      break;
    case 'error':
      showError(message, timeout);
      break;
    case 'advice':
      showAdvice(message, timeout);
      break;
  }
} 