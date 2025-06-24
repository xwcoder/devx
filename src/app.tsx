import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppContext } from "@/context"
import Application from "@/application"

export default function App() {
  return (
    <AppContext>
      <SidebarProvider
        style={
          {
            // "--sidebar-width": "calc(var(--sidebar-width-icon) + 1px)",
            "--sidebar-width": "150px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="[width:calc(100%-var(--sidebar-width))]!">
          <main className="p-6">
            <Application />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AppContext>
  )
}
