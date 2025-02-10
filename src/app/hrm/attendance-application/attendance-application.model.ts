export interface AttendanceApplication {
  dutyId: string | null;
  staffNo: string | null;
  dutyCode: string | null;
	dutyReason: string | null;
	fromDate: string | null;
	toDate: string | null;
	selectedDate: AttendanceDate[] | null;
	dutyTime: number | null;
}

export interface AttendanceDate {
  date: string;
  isSelected: boolean;
  isHoliday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
}
