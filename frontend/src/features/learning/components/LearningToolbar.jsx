import { useRef } from 'react';
import { Search, Upload } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LearningToolbar = ({ 
  search, 
  onSearchChange, 
  filter, 
  onFilterChange, 
  onUpload 
}) => {
  const fileInputRef = useRef(null);

  const filterOptions = [
    { label: "Newest Upload", value: "new-upload" },
    { label: "Oldest Upload", value: "latest-upload" },
    { label: "Favorites Only", value: "favorite" },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        {/* SEARCH */}
        <div className="w-full md:max-w-sm">
          <Input 
            placeholder="Search documents..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={Search}
          />
        </div>

        {/* FILTER */}
        <div className="w-full md:w-48">
          <Select 
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            options={filterOptions}
          />
        </div>
      </div>

      {/* UPLOAD */}
      <div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={onUpload}
        />
        <Button 
          variant="primary" 
          icon={Upload} 
          onClick={() => fileInputRef.current.click()}
          className="w-full md:w-auto px-8"
        >
          Upload Document
        </Button>
      </div>
    </div>
  );
};


export default LearningToolbar;
