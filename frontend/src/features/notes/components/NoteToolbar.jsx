import React from 'react';
import { Search, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NoteToolbar = ({ 
  search, 
  onSearchChange, 
  filter, 
  onFilterChange, 
  onCreateClick 
}) => {
  const filterOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
      <div className="flex flex-1 flex-col lg:flex-row lg:items-center gap-4">
        <div className="w-full lg:max-w-md">
          <Input 
            placeholder="Search notes, tags, content..." 
            value={search}
            onChange={onSearchChange}
            icon={Search}
          />
        </div>

        <div className="w-full lg:w-48">
          <Select 
            value={filter}
            onChange={onFilterChange}
            options={filterOptions}
          />
        </div>
      </div>

      <Button 
        variant="primary" 
        icon={Plus} 
        onClick={onCreateClick}
        className="w-full lg:w-auto"
      >
        New Note
      </Button>
    </div>
  );
};

export default NoteToolbar;
