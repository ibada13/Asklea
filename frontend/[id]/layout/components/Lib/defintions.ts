
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

export interface diagnosis_history {
		"month": string,
		"year": number,
		"blood_pressure": {
			"systolic": {
				"value": number,
				"levels": "Normal"|"Higher than Average"|"Lower than Average"
			},
			"diastolic": {
				"value": number,
				"levels": "Normal"|"Higher than Average"|"Lower than Average"
			}
		},
		"heart_rate": {
			"value": number,
			"levels": string
		},
		"respiratory_rate": {
			"value": number,
			"levels": string
		},
		"temperature": {
			"value": number,
			"levels": string
		}
	}

	export interface diagnostic_list 			{
		"name": string,
		"description": string,
		"status": string
	}