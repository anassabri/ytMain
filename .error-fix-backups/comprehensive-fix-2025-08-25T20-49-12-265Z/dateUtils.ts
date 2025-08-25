// Date Utils - Minimal Implementation
export const formatDate = (date: any: Date | string | number): string => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    return d.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date: any: Date | string | number): string => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    return d.toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatRelativeTime = (date: any: Date | string | number): string => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return diffMinutes + ' minute' + (diffMinutes !== 1 ? 's' : '') + ' ago';
    } else if (diffHours < 24) {
      return diffHours + ' hour' + (diffHours !== 1 ? 's' : '') + ' ago';
    } else if (diffDays < 30) {
      return diffDays + ' day' + (diffDays !== 1 ? 's' : '') + ' ago';
    } else {
      return formatDate(d);
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

export const isValidDate = (date: any): boolean => {
  try {
    const d = new Date(date);
    return !isNaN(d.getTime());
  } catch (error) {
    return false;
  }
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return hours + ':' + minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');
  } else {
    return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
  }
};