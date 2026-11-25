export const MENTAL_HEALTH_INTAKE_GENDER_OPTION = "mentalIntakeGenderRadioButton";
export const MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTION = "mentalIntakePreviousMentalHealthTreatmentRadioButton";

export const MENTAL_HEALTH_INTAKE_GENDER_OPTIONS = [
  "Male",
  "Female",
  "Transgender male",
  "Transgender female",
  "Gender queer",
  "Gender variant",
  "Prefer not to share",
  "Other",
  "Non-binary",
] as const;

export type GenderIdentityOption = (typeof MENTAL_HEALTH_INTAKE_GENDER_OPTIONS)[number];

export const MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTIONS = ["Therapist", "Psychiatrist", "Therapist and Psychiatrist", "No"] as const;

export type PreviousMentalHealthTreatmentOption = (typeof MENTAL_HEALTH_INTAKE_PREVIOUS_TREATMENT_OPTIONS)[number];
