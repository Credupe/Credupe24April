import StudyAbroadCountryPage from "@/components/education-loan/StudyAbroadCountryPage";
import { studyAbroadCountries } from "@/data/studyAbroadCountries";
const heroImg = "/assets/study-ireland-hero.png";
const StudyIreland = () => (
  <StudyAbroadCountryPage country={studyAbroadCountries.ireland} heroImg={heroImg} />
);
export default StudyIreland;
