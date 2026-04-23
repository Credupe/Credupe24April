import StudyAbroadCountryPage from "@/components/education-loan/StudyAbroadCountryPage";
import { studyAbroadCountries } from "@/data/studyAbroadCountries";
const heroImg = "/assets/study-uk-hero.png";
const StudyUK = () => (
  <StudyAbroadCountryPage country={studyAbroadCountries.uk} heroImg={heroImg} />
);
export default StudyUK;
