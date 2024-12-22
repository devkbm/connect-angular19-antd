export interface WorkCalendarEvent {
  id: string | null;
  text: string | null;
  start: string | Date | null;
  end: string | Date | null;
  allDay: boolean | null;
  workCalendarId: number | null;
  color?: string;
}
