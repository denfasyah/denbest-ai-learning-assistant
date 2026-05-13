import DocumentCard from './DocumentCard';

const DocumentGrid = ({ 
  documents, 
  onFavorite, 
  onRename, 
  onDelete, 
  formatTime,
  openMenuId,
  setOpenMenuId
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onFavorite={onFavorite}
          onRename={onRename}
          onDelete={onDelete}
          formatTime={formatTime}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
