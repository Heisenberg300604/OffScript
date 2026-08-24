import { AppSidebar, BrandNav } from "@/components/offscript";
import DashboardClient from "./dashboard-client";

export default function DashboardPage() {
  return <div className="min-h-screen bg-background"><BrandNav/><div className="flex pt-16"><AppSidebar/><DashboardClient/></div></div>;
}
