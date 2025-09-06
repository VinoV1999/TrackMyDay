import { sidebarType } from "../types/enums";
import { SideBarContentType } from "../types/types";
import {
  AccountIcon,
  CompareEffortsIcon,
  HomeIcon,
  LogoutIcon,
  PreferencesIcon,
  SettingsIcon,
  ViewEffortsIcon,
} from "./Icons";

export const sidebarRoutes: SideBarContentType[] = [
  {
    id: "home",
    type: sidebarType.LINK,
    title: "Home",
    path: "/",
    Icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    id: "view",
    type: sidebarType.LINK,
    title: "View",
    path: "/view",
    Icon: <ViewEffortsIcon className="w-6 h-6" />,
  },
  {
    id: "compare",
    type: sidebarType.LINK,
    title: "Compare",
    path: "/compare",
    Icon: <CompareEffortsIcon className="w-6 h-6" />,
  },
  {
    id: "settings",
    type: sidebarType.LINK,
    title: "Settings",
    path: "/settings",
    Icon: <SettingsIcon className="w-5 h-5" />,
    children: [
      {
        id: "account",
        type: sidebarType.LINK,
        title: "Account",
        path: "/settings/account",
        Icon: <AccountIcon className="w-6 h-6" />,
      },
      {
        id: "preferences",
        type: sidebarType.LINK,
        title: "Preferences",
        path: "/settings/preferences",
        Icon: <PreferencesIcon className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "home",
    type: sidebarType.FUNCTION,
    title: "Log out",
    operation: "logout",
    Icon: <LogoutIcon className="w-5 h-5" />,
  },
];

export const dateTitle = (date: Date): string => {
  const isToday =
    date.getDate() === new Date().getDate() &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear();
  const isYesterday =
    date.getDate() === new Date().getDate() - 1 &&
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear();
  if (isToday) {
    return "Today's Effort";
  }
  if (isYesterday) {
    return "Yesterday's Effort";
  }
  return `${date.toLocaleDateString()}'s Effort`;
};
