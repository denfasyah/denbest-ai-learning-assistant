import DocumentCardLearning from './DocumentCardLearning';

const DocumentGridLearning = ({
  documents,
  handleFavorite,
  handleRename,
  handleDelete,
  formatUploadTime,
  openMenuId,
  setOpenMenuId,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCardLearning
          key={doc.id}
          doc={doc}
          handleFavorite={handleFavorite}
          handleRename={handleRename}
          handleDelete={handleDelete}
          formatUploadTime={formatUploadTime}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />
      ))}
    </div>
  );
};

export default DocumentGridLearning;