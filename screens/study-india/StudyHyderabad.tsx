import StudyIndiaCityPage from "@/components/education-loan/StudyIndiaCityPage";
import { indianCities } from "@/data/studyIndiaCities";
const heroImg = "/assets/study-hyderabad-hero.png";
const StudyHyderabad = () => (
  <StudyIndiaCityPage city={indianCities.hyderabad} heroImg={heroImg} />
);
export default StudyHyderabad;
