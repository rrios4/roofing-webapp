import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviateName(name:string){
  if(name){
    return (
      name 
        .split(" ")
  
        .map((part) => part[0].toUpperCase())
  
        .join("")
    )
  } else if(name === undefined) {
    return("NA")
  } else {
    return (
      "NA"
    )
  }
}
