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

export function getRandomIntBetweenInclusive(min:number, max:number){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function formatNumber(value:number) {
  return value?.toLocaleString('en-US', {
    minimumIntegerDigits: 3,
    useGrouping: true
  });
}

export function formatMoneyValue(input:any) {
  return input?.toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
}

export function formatDateWithAbbreviatedMonth(date:any) {
  let parsedDate = new Date(Date.parse(date));
  let dateString = parsedDate.toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );
  return dateString;
}

// util for storing memoji file names
export const arrayOfMemojiFileNames = [
  '1627.png',
  '1949.png',
  '2529.png',
  '2738.png',
  '2821.png',
  '3201.png',
  '3359.png',
  '3379.png',
  '3552.png',
  '4122.png',
  '4314.png'
]
