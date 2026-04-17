export type AlertLevel = 'critical' | 'warn' | 'info';

export interface Alert {
  id: string;
  level: AlertLevel;
  text: string;
}
