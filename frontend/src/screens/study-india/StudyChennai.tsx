import StudyIndiaCityPage from "@/components/education-loan/StudyIndiaCityPage";
import { indianCities } from "@/data/studyIndiaCities";
const heroImg = "/assets/study-chennai-hero.png";
const StudyChennai = () => (
  <StudyIndiaCityPage city={indianCities.chennai} heroImg={heroImg} />
);
export default StudyChennai;
