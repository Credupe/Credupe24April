import StudyAbroadCountryPage from "@/components/education-loan/StudyAbroadCountryPage";
import { studyAbroadCountries } from "@/data/studyAbroadCountries";
const heroImg = "/assets/study-netherlands-hero.png";
const StudyNetherlands = () => (
  <StudyAbroadCountryPage country={studyAbroadCountries.netherlands} heroImg={heroImg} />
);
export default StudyNetherlands;
