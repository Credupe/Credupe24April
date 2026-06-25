import StudyIndiaCityPage from "@/components/education-loan/StudyIndiaCityPage";
import { indianCities } from "@/data/studyIndiaCities";
const heroImg = "/assets/study-kolkata-hero.png";
const StudyKolkata = () => (
  <StudyIndiaCityPage city={indianCities.kolkata} heroImg={heroImg} />
);
export default StudyKolkata;
