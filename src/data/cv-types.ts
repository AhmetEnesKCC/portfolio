export type CvProfile = {
  name: string;
  headline: string;
  location: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
};

export type CvSkillGroup = {
  category: string;
  items: string[];
};

export type CvExperience = {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
};

export type CvEducation = {
  id: string;
  school: string;
  location: string;
  degree: string;
  dateRange: string;
};

export type CvAward = {
  id: string;
  title: string;
  detail: string;
  date: string;
};

export type CvData = {
  profile: CvProfile;
  professionalSummary: string;
  skills: CvSkillGroup[];
  experience: CvExperience[];
  education: CvEducation[];
  awards: CvAward[];
  rawLatex: string;
};

