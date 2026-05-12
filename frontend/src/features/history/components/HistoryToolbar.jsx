import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const HistoryToolbar = ({ 
  search, 
  onSearchChange, 
  filter, 
  onFilterChange 
}) => {
  const filterOptions = [
    { label: "All Activity", value: "all" },
    { label: "AI Summary", value: "summary" },
    { label: "Quiz", value: "quiz" },
    { label: "Flashcard", value: "flashcard" },
    { label: "AI Assistant", value: "assistant" },
    { label: "Notes", value: "notes" },
    { label: "Documents", value: "document" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
      <div className="w-full lg:max-w-md">
        <Input 
          placeholder="Search activity history..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>

      <div className="w-full lg:w-48">
        <Select 
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          options={filterOptions}
        />
      </div>
    </div>
  );
};


export default HistoryToolbar;
