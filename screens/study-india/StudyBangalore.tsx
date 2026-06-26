import StudyIndiaCityPage from "@/components/education-loan/StudyIndiaCityPage";
import { indianCities } from "@/data/studyIndiaCities";
const heroImg = "/assets/study-bangalore-hero.png";
const StudyBangalore = () => (
  <StudyIndiaCityPage city={indianCities.bangalore} heroImg={heroImg} />
);
export default StudyBangalore;
