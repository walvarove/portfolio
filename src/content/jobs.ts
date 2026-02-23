import { differenceInMonths, differenceInYears } from "date-fns";

type Job = {
  company: string;
  link: string;
  start: string;
  end: string;
  description: string;
  job: string;
  teckStack: string[];
};

const calculateDuration = (start: string, end: string | null) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const diffMonths = differenceInMonths(endDate, startDate);
  const diffYears = differenceInYears(endDate, startDate);
  console.log("");

  if (diffYears > 0) {
    return diffYears + " years and " + (diffMonths % 11) + " months";
  } else {
    return diffMonths + " months";
  }
};

const toSimpleDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const getYear = (date: string) => {
  return new Date(date).getFullYear();
};

export { calculateDuration, getYear, toSimpleDate };
