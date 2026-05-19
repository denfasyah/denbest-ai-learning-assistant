import Select from '../../../components/ui/Select';

const FILTER_OPTIONS = [
  { label: 'Semua Aktivitas', value: 'all' },
  { label: 'Dokumen Diupload', value: 'document_uploaded' },
  { label: 'Chat AI', value: 'chat_sent' },
  { label: 'Summary Dibuat', value: 'summary_generated' },
  { label: 'Flashcard Dibuat', value: 'flashcard_generated' },
  { label: 'Quiz Selesai', value: 'quiz_completed' },
  { label: 'Assistant Chat', value: 'assistant_chat' },
  { label: 'Note Dibuat', value: 'note_created' },
  { label: 'Profil', value: 'profile' },
  { label: 'Pengaturan', value: 'setting' },
];

const HistoryToolbar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
      <p className="text-slate-400 font-medium text-sm">
        Filter berdasarkan jenis aktivitas:
      </p>
      <div className="w-full lg:w-56">
        <Select
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          options={FILTER_OPTIONS}
        />
      </div>
    </div>
  );
};

export default HistoryToolbar;