import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviateName(name: string) {
  if (name) {
    return name
      .split(' ')
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase())
      .join('');
  } else {
    return 'NA';
  }
}

const AVATAR_PALETTES = [
  { bg: 'bg-rose-100',   text: 'text-rose-700'   },
  { bg: 'bg-orange-100', text: 'text-orange-700'  },
  { bg: 'bg-amber-100',  text: 'text-amber-700'   },
  { bg: 'bg-lime-100',   text: 'text-lime-700'    },
  { bg: 'bg-emerald-100',text: 'text-emerald-700' },
  { bg: 'bg-teal-100',   text: 'text-teal-700'    },
  { bg: 'bg-sky-100',    text: 'text-sky-700'     },
  { bg: 'bg-violet-100', text: 'text-violet-700'  },
  { bg: 'bg-fuchsia-100',text: 'text-fuchsia-700' },
  { bg: 'bg-pink-100',   text: 'text-pink-700'    },
];

export function getAvatarColor(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

export function getRandomIntBetweenInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function formatDate(date: any) {
  const parsedDate = new Date(Date.parse(date));
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
  // @ts-expect-error the date string need to be addressed here.
  const dateString = parsedDate.toLocaleDateString('en-US', options);
  return dateString;
}

export function formatPhoneNumber(value: any) {
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

export function formatNumber(value: number) {
  return value?.toLocaleString('en-US', {
    minimumIntegerDigits: 3,
    useGrouping: true
  });
}

export function formatMoneyValue(input: any) {
  if (typeof input !== 'number') {
    return input?.toLocaleString(undefined, {
      minimumFractionDigits: 2
    });
  }

  const roundedValue = Math.ceil(input * 100) / 100; // Rounds up to 2 decimal places
  return roundedValue.toLocaleString(undefined, {
    minimumFractionDigits: 2
  });
}

export function formatDateWithAbbreviatedMonth(date: any) {
  const parsedDate = new Date(Date.parse(date));
  return parsedDate.toLocaleDateString(
    // @ts-expect-error this needs to be addressed to
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );
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
];

export function monthDDYYYYFormat(date: any) {
  const parsedDate = new Date(Date.parse(date));
  return parsedDate.toLocaleDateString(
    // @ts-expect-error this needs to be address also
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );
}

export function formatDateTimeWithAbbreviatedMonth(date: any) {
  const parsedDate = new Date(Date.parse(date));
  return parsedDate.toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
