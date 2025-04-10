import { writable } from 'svelte/store';

// Tipos de alerta
export type AlertType = 'error' | 'success' | 'advice';

// Interfaz para las alertas
export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  timeout?: number;
}

// Función para crear un store de alertas
function createAlertStore() {
  const { subscribe, update } = writable<Alert[]>([]);
  
  // Contador para IDs únicos
  let nextId = 1;

  // Añadir una nueva alerta
  const addAlert = (type: AlertType, message: string, timeout = 5000) => {
    const id = nextId++;
    const alert: Alert = {
      id,
      type,
      message,
      timeout
    };
    
    update(alerts => [...alerts, alert]);
    
    // Auto-eliminar después del timeout (si es mayor que 0)
    if (timeout > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, timeout);
    }
    
    return id;
  };

  // Eliminar una alerta por ID
  const removeAlert = (id: number) => {
    update(alerts => alerts.filter(alert => alert.id !== id));
  };

  // Limpiar todas las alertas
  const clearAlerts = () => {
    update(() => []);
  };

  // Métodos de ayuda para tipos específicos de alertas
  const success = (message: string, timeout = 5000) => addAlert('success', message, timeout);
  const error = (message: string, timeout = 5000) => addAlert('error', message, timeout);
  const advice = (message: string, timeout = 5000) => addAlert('advice', message, timeout);

  return {
    subscribe,
    addAlert,
    removeAlert,
    clearAlerts,
    success,
    error,
    advice
  };
}

// Exportar la instancia del store
export const alerts = createAlertStore(); 