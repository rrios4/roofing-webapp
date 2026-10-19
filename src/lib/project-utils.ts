export type ProjectStatusVariant =
  | 'gray'
  | 'blue'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'red'
  | 'default';

export function getStatusVariant(statusName: string | undefined): ProjectStatusVariant {
  switch (statusName) {
    case 'Lead':
      return 'gray';
    case 'Estimate Sent':
      return 'blue';
    case 'Approved / Booked':
      return 'orange';
    case 'In Progress':
      return 'yellow';
    case 'Inspection / Punch List':
      return 'orange';
    case 'Invoice Sent':
      return 'blue';
    case 'Completed':
      return 'green';
    default:
      return 'gray';
  }
}
