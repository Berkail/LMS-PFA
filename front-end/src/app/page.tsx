import NonDashboardNavBar from "@/components/NonDashboardNavBar";
import Landing from "@/app/(nondashboard)/landing/page";

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavBar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>

    </div>
  );
}