import StudyAbroadCountryPage from "@/components/education-loan/StudyAbroadCountryPage";
import { studyAbroadCountries } from "@/data/studyAbroadCountries";
const heroImg = "/assets/study-france-hero.png";
const StudyFrance = () => (
  <StudyAbroadCountryPage country={studyAbroadCountries.france} heroImg={heroImg} />
);
export default StudyFrance;
