export function getStatusTag(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'OPEN':
      return 'success';
    case 'ACTIVE':
      return 'info';
    case 'FINISHED':
      return 'danger';
  }
}
