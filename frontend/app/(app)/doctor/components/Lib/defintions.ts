
export interface patient	{
		"name": string,
		"gender": string,
		"age": number,
		"profile_picture": string,
		"date_of_birth": string,
		"phone_number": string,
        "emergency_contact": string;
		"insurance_type": string,
		"diagnosis_history": diagnosis_history[],
		"diagnostic_list": diagnostic_list[],
		"lab_results":string[]
	}
type Level = "Normal"|"Higher than Average"|"Lower than Average"
export interface  diagnosis_history {
  id: number;
  month: string;
  year: number;
  blood_pressure_systolic_value: number | null;
  blood_pressure_systolic_levels: Level;
  blood_pressure_diastolic_value: number | null;
  blood_pressure_diastolic_levels: Level;
  heart_rate_value: number | null;
  heart_rate_levels: Level;
  respiratory_rate_value: number | null;
  respiratory_rate_levels: Level;
  temperature_value: number | null;
  temperature_levels: Level;
}

	export interface diagnostic_list 			{
		"name": string,
		"description": string,
		"status": string
	}