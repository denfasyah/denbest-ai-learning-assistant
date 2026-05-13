import { createContext } from 'react';

const WorkspaceContext = createContext({
  workspaceId: null,
  workspace: null,
  document: null,
  isLoading: true,
  error: null,
  refetch: () => {}
});

export { WorkspaceContext };
