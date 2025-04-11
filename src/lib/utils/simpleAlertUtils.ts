export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  ADVICE = "advice",
}

export interface ShowAlertEventDetail {
  message: string;
  type: AlertType;
  duration?: number;
}

export const SHOW_ALERT_EVENT = "show-alert";

export function showAlert(
  message: string,
  type: AlertType,
  duration?: number
): void {
  const event = new CustomEvent<ShowAlertEventDetail>(SHOW_ALERT_EVENT, {
    detail: {
      message,
      type,
      duration,
    },
    bubbles: true,
  });

  document.dispatchEvent(event);
}

export function showSuccessAlert(message: string, duration?: number): void {
  showAlert(message, AlertType.SUCCESS, duration);
}

export function showErrorAlert(message: string, duration?: number): void {
  showAlert(message, AlertType.ERROR, duration);
}

export function showInfoAlert(message: string, duration?: number): void {
  showAlert(message, AlertType.INFO, duration);
}

export function showAdviceAlert(message: string, duration?: number): void {
  showAlert(message, AlertType.ADVICE, duration);
}
