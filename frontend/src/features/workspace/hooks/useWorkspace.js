import { useContext } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext';

const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context || (context.workspaceId === null && context.isLoading === true && !context.refetch)) {
    // Note: The second part of the check is for the default value case if needed, 
    // but usually if (!context) is enough if the provider provides a value.
    // However, the prompt specifically asks for the guard.
    throw new Error('useWorkspace must be used within WorkspaceLayout');
  }
  return context;
};

export default useWorkspace;
