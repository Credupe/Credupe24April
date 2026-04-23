import StudyIndiaCityPage from "@/components/education-loan/StudyIndiaCityPage";
import { indianCities } from "@/data/studyIndiaCities";
const heroImg = "/assets/study-delhi-hero.png";
const StudyDelhi = () => (
  <StudyIndiaCityPage city={indianCities.delhi} heroImg={heroImg} />
);
export default StudyDelhi;
