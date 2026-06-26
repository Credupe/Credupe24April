import StudyAbroadCountryPage from "@/components/education-loan/StudyAbroadCountryPage";
import { studyAbroadCountries } from "@/data/studyAbroadCountries";
const heroImg = "/assets/study-newzealand-hero.png";
const StudyNewZealand = () => (
  <StudyAbroadCountryPage country={studyAbroadCountries["new-zealand"]} heroImg={heroImg} />
);
export default StudyNewZealand;
