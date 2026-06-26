import { Briefcase, UserCheck, Users, GraduationCap, Stethoscope, Heart } from "lucide-react";

const typeItems = [
  { title: "Salaried Employees", icon: Briefcase },
  { title: "Self Employed", icon: UserCheck },
  { title: "Senior Citizens", icon: Users },
  { title: "Students", icon: GraduationCap },
  { title: "Doctors", icon: Stethoscope },
  { title: "Women", icon: Heart },
];

const LoanByType = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">By Type</h3>
      <div className="w-10 h-1 bg-amber-400 rounded-full mb-4" />
      <div className="flex flex-col gap-3">
        {typeItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:shadow-md hover:border-amber-200 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 shrink-0 group-hover:bg-amber-100 transition-colors">
                <Icon className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LoanByType;
