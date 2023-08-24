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

export function formatPhoneNumber(value:any) {
  //if value is falsy eg if the user deletes the input, then just return
  if (!value) return value;

  //clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d]/g, '');

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code to early
  if (phoneNumberLength < 4) return phoneNumber;

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
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
    // @ts-ignore
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
