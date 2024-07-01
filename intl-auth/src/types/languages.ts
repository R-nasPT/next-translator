export type LanguagesTypes = "en" | "th";

export interface LanguagesProps {
    params: {
      lng: LanguagesTypes;
    };
  }