export function getStatusTag(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'Open':
      return 'info';
    case 'ONGOING':
    case 'Active':
      return 'success';
    case 'FINISHED':
    case 'Ready-To-Finish':
      return 'danger';
  }
}
