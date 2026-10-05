import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
  ClipboardList,
  BarChart3,
  User,
  X,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

function Sidebar({ isOpen, setIsOpen }) {
  const navigationGroups = [
    {
      group: "Overview",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Scholarships", path: "/scholarships", icon: GraduationCap },
        { name: "AI Recommendations", path: "/recommendations", icon: Sparkles },
      ],
    },
    {
      group: "AI & Analytics",
      items: [
        { name: "Success Prediction", path: "/prediction", icon: Target },
        { name: "Profile Improvement", path: "/improvements", icon: TrendingUp },
        { name: "Reports & Insights", path: "/reports", icon: BarChart3 },
      ],
    },
    {
      group: "Student Management",
      items: [
        { name: "My Applications", path: "/applications", icon: ClipboardList },
        { name: "Student Profile", path: "/profile", icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-50
          w-72
          h-screen
          bg-white
          border-r border-slate-200/90
          flex flex-col
          transform
          transition-transform
          duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Scholar<span className="text-blue-600">Mate</span>
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable nav items */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.group}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-blue-50/80 text-blue-700 shadow-xs border border-blue-100/80"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 transition-colors ${
                                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom helper card */}
        <div className="p-4 border-t border-slate-200/80 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Verified Platform</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  100% verified scholarship sources & real-time updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
