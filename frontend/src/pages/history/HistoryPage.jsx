import { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { HISTORY_ACTIVITIES } from "../../features/history/constants/historyData";
import HistoryCard from "../../features/history/components/HistoryCard";
import HistoryToolbar from "../../features/history/components/HistoryToolbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../features/learning/components/EmptyState";
import Pagination from "../../features/learning/components/Pagination";

const ITEMS_PER_PAGE = 5;

const HistoryPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(() => {
    let filtered = [...HISTORY_ACTIVITIES];

    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.file.toLowerCase().includes(search.toLowerCase())
    );

    if (filter !== "all") {
      filtered = filtered.filter((item) => item.type === filter);
    }

    return filtered;
  }, [search, filter]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <Clock3 className="h-8 w-8 text-white" />
          </div>
          <div className="max-w-3xl">
            <Badge variant="indigo" className="mb-3">Audit Logs</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Learning Activity Center
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Track all your AI interactions, summaries, flashcards, and study sessions in one centralized timeline.
            </p>
          </div>
        </div>
      </Card>

      {/* TOOLBAR */}
      <HistoryToolbar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        filter={filter}
        onFilterChange={(val) => { setFilter(val); setCurrentPage(1); }}
      />

      {/* CONTENT */}
      {filteredActivities.length === 0 ? (
        <EmptyState 
          title="No Activity Found" 
          description="Your search criteria didn't match any learning records."
          showAction={false}
        />
      ) : (
        <div className="space-y-6">
          {paginatedActivities.map((activity) => (
            <HistoryCard key={activity.id} activity={activity} />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
