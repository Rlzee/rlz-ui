import { Sidebar } from "@rlz/ui/components/ui/sidebar";
import { Folder, FileText } from "lucide-react";

export default function Example() {
  return (
    <Sidebar.Provider className="relative h-64 min-h-0 w-full max-w-md overflow-hidden rounded-lg border">
      <Sidebar className="absolute inset-y-0 h-full">
        <Sidebar.Body>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.List>
              <Sidebar.Sub>
                <Sidebar.SubTrigger>
                  <Folder /> Projects
                </Sidebar.SubTrigger>
                <Sidebar.SubList>
                  <Sidebar.SubButton>
                    <FileText /> Overview
                  </Sidebar.SubButton>
                  <Sidebar.SubButton>
                    <FileText /> Documents
                  </Sidebar.SubButton>
                </Sidebar.SubList>
              </Sidebar.Sub>
            </Sidebar.List>
          </Sidebar.Group>
        </Sidebar.Body>
      </Sidebar>
      <Sidebar.Inset className="p-4">Choose a project page.</Sidebar.Inset>
    </Sidebar.Provider>
  );
}
