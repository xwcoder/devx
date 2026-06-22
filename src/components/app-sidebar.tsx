import * as React from "react"
import { SquareTerminal } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { appGroups, apps } from "@/apps"
import { useAppState, useAppDispatch } from '@/context'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { app }= useAppState()
  const dispatch = useAppDispatch()

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border/80 bg-sidebar"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/70 p-3">
        <div className="flex h-11 items-center gap-3 rounded-lg px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <SquareTerminal className="size-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">
              DevX
            </div>
            <div className="truncate text-xs text-sidebar-foreground/60">
              Developer utilities
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-1 px-1 py-2">
        {appGroups.map((group) => {
          const groupApps = apps.filter((item) => item.group === group.name)

          return (
            <SidebarGroup key={group.name} className="px-2 py-1.5">
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-normal text-sidebar-foreground/55">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupApps.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={app.name === item.name}
                        className="h-9 rounded-lg px-2.5 text-sidebar-foreground/78 transition-all duration-150 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                        onClick={() => dispatch({ type: 'set-app', payload: item })}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
