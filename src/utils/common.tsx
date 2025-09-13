import { sidebarType, TimeFormatType } from "../types/enums";
import { SideBarContentType, TimeParts } from "../types/types";
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
  // {
  //   id: "settings",
  //   type: sidebarType.LINK,
  //   title: "Settings",
  //   path: "/settings",
  //   Icon: <SettingsIcon className="w-5 h-5" />,
  //   children: [
  //     {
  //       id: "account",
  //       type: sidebarType.LINK,
  //       title: "Account",
  //       path: "/settings/account",
  //       Icon: <AccountIcon className="w-6 h-6" />,
  //     },
  //     {
  //       id: "preferences",
  //       type: sidebarType.LINK,
  //       title: "Preferences",
  //       path: "/settings/preferences",
  //       Icon: <PreferencesIcon className="w-6 h-6" />,
  //     },
  //   ],
  // },
  {
    id: "home",
    type: sidebarType.FUNCTION,
    title: "Log out",
    operation: "logout",
    Icon: <LogoutIcon className="w-6 h-6 pl-1" />,
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


export const brandColors = [
  "#ddd6fe", // 4.
  "#d5cafe", // 5.
  "#c4b5fd", // 6.
  "#bca3fc", // 7.
  "#b191fa", // 8.
  "#a78bfa", // 9.
  "#9c7df7", // 10.
  "#8b5cf6", // 11.
  "#834af3", // 12.
  "#7c3aed", // 13.
  "#6d28d9", // 14.
  "#641fcf", // 15.
  "#5b21b6", // 16.
  "#4c1d95", // 17.
  "#3f187d", // 18.
  "#351267", // 19.
  "#2b0e50", // 20. darkest shade
];

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function secondsToTimeParts(totalSeconds: number): TimeParts {
  const hours = Math.floor(((totalSeconds / 1000) / 60) / 60);
  const minutes = Math.floor((totalSeconds / 1000) / 60);
  const seconds = totalSeconds / 1000;
  return { hours, minutes, seconds };
}

export function timePartsToString(
  timeParts: TimeParts,
  timeFormat: TimeFormatType
): string {
  const { hours, minutes, seconds } = timeParts;

  const HH = hours.toString().padStart(2, "0");
  const MM = minutes.toString().padStart(2, "0");
  const SS = seconds.toString().padStart(2, "0");

  switch (timeFormat) {
    case TimeFormatType.HH:
      return HH;

    case TimeFormatType.HHMM:
      return `${HH}:${MM}`;

    case TimeFormatType.HHMMSS:
      return `${HH}:${MM}:${SS}`;

    case TimeFormatType.MM:
      return MM;

    case TimeFormatType.MMSS:
      return `${MM}:${SS}`;

    case TimeFormatType.SS:
      return SS;

    case TimeFormatType.HR:
      return `${hours} hr`;

    case TimeFormatType.HR_MIN:
      return `${hours} hr ${minutes} min`;

    case TimeFormatType.MIN:
      return `${minutes} min`;

    case TimeFormatType.MIN_SEC:
      return `${minutes} min ${seconds} sec`;

    case TimeFormatType.SEC:
      return `${seconds} sec`;

    case TimeFormatType.HR_MIN_SEC:
      {
        const parts: string[] = [];
        if (hours) parts.push(`${hours} hr`);
        if (minutes) parts.push(`${minutes} min`);
        if (seconds) parts.push(`${seconds} sec`);
        return parts.join(" ") || "0 sec";
      }

    default:
      return `${HH}:${MM}:${SS}`; // fallback
  }
}

