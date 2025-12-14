import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { User } from 'lucide-react';

export function SidebarUserNav() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton className="h-10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="truncate">Guest</span>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
