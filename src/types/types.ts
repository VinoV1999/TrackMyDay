import React from "react"
import { sidebarType } from "./enums"

export type SideBarContentType = {
    id: string,
    title: string,
    type: sidebarType.LINK,
    path: string
    Icon: React.ReactElement,
    children?: SideBarContentType[]
} | {
    id: string,
    title: string,
    type: sidebarType.FUNCTION,
    operation: string,
    Icon: React.ReactElement,
    children?: SideBarContentType[]
}

export type Task = {
    id: string,
    name: string,
    category: string,
    isFavourite: boolean,
    autoEndIn?: {
        hours: number,
        minutes: number,
        seconds: number
    }
}

export type DayTasks = {
  id: string;
  task: Task;
  startAt: Date;
  endAt: Date | null;
  autoCutOff: boolean;
};

export type ActiveTask = {
    task: Task;
    startAt: Date;
    autoCutOff: boolean;
}

export type TimeParts = { 
    hours: number; 
    minutes: number; 
    seconds: number 
}