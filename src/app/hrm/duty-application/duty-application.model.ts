export interface DutyApplication {
  dutyId: string | null;
  staffId: string | null;
  dutyCode: string | null;
	dutyReason: string | null;
	fromDate: string | null;
	toDate: string | null;
	selectedDate: DutyDate[] | null;
	dutyTime: number | null;
}

export interface DutyDate {
  date: string;
  isSelected: boolean;
  isHoliday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
}
