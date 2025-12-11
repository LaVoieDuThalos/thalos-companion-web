type CountsDto = { [key: string]: number };

export interface DayCountsDto {
  dayId: string;
  afternoon?: CountsDto;
  night?: CountsDto;
}
