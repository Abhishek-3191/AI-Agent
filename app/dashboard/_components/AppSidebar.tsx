"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Database,
  Gem,
  Headphones,
  LayoutDashboard,
  WalletCards,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs"; // correct Clerk component
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import { usePathname,useParams } from "next/navigation";

const MenuOptions = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Agents",
    url: "#",
    icon: Headphones,
  },
  {
    title: "Pricing",
    url: "#",
    icon: WalletCards,
  },
  {
    title: "Data",
    url: "#",
    icon: Database,
  },
];

const AppSidebar = () => {
    const {open}=useSidebar();
   const {userDetail,setUserDetail}=useContext(UserDetailContext);
   const path=usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <Image src="/logo.svg" alt="logo" width={35} height={35} />
      <h2 className="font-bold text-lg">AI-Agent Builder</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />

        <SidebarGroupLabel>Applications</SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {MenuOptions.map((menu, index) => {
              const Icon = menu.icon;

              return (
                <SidebarMenuItem key={index}>
                  {/* <SidebarMenuButton asChild size={open?'lg':'default'}> */}
                  <SidebarMenuButton asChild size={'lg'}
                  isActive={path==menu.url}>
                    <Link href={menu.url}>
                      <Icon className="w-5 h-5" />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            {/* Profile / User Button */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <UserButton afterSignOutUrl="/" />
                  <span>Profile</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter className='mb-10'>
       <div className="flex gap-2 items-center">
        <Gem/>
        <h2>Remainig credit:{userDetail?.token}</h2>
       </div>
       <Button>Upgrade to Unlimited</Button>
        </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
