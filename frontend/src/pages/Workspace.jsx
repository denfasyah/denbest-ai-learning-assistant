import React from 'react';
import { useParams } from 'react-router-dom';

const Workspace = () => {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h1>Document Workspace</h1>
      <p>Menganalisis dokumen ID: {id}</p>
    </div>
  );
};

export default Workspace;
