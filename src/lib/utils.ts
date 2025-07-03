import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function remainingTime(end: Date): string {
  const totalSeconds = Math.floor((end.getTime() - Date.now()) / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if(days < 0 && hours < 0 && minutes < 0 && seconds < 0) {
    return "Election has ended"
  }

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}
