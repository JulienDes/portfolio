export type FormationType = 'certification' | 'degree' | 'diploma';

export type FormationStatus =
  | { en: 'Certified'; fr: 'Certifié' }
  | { en: 'Completed'; fr: 'Complété' }
  | { en: 'In Progress'; fr: 'En cours' };

export interface Formation {
  id: string;
  type: FormationType;
  title: { en: string; fr: string };
  institution: string;
  date: string;
  duration?: { en: string; fr: string };
  description: { en: string; fr: string };
  skills: string[];
  referenceUrl?: string | null;
  credentialUrl?: string | null;
  formateur?: string | null;
  diplome?: { en: string; fr: string };
  statut?: FormationStatus;
}
