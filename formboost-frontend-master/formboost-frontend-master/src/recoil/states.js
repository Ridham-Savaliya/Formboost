import { atom } from "recoil";

export const formListState = atom({
  key: "formListState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (initial state)
});

export const formSubmissionDataState = atom({
  key: "formSubmissionDataState",
  default: "",
});

export const formStatsState = atom({
  key: "formStatsState",
  default: {
    totalForms: 0,
    totalSubmissionsThisMonth: 0,
    totalSubmissionsLastMonth: 0,
    totalSubmissionsAllTime: 0,
  },
});
