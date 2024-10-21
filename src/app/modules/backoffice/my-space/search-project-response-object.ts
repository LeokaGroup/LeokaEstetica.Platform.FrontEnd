interface Workspace {
  workSpaceId: number;
  projectId: number;
  projectManagementName: string;
  isOwner: boolean;
  isSetupProjectNameAndPrefix: boolean;
  companyId: number;
  companyName: string;
}

export default interface SearchProjectResponseObject {
  userCompanyWorkSpaces: Workspace[];
  otherCompanyWorkSpaces: Workspace[];
}
