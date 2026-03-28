import api from "../api/axios";

export const getAboutUsPageImages = () => {
  return api.get("/pages/about-us/images");
};

export const getChallengeIntroductionPageImages = () => {
  return api.get("/pages/challenge-introduction/images");
};
