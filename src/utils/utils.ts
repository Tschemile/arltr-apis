
export function checkOverlap(startTime: string, endTime: string): boolean {
    return (
      new Date(endTime).getTime() >= new Date(startTime).getTime() ||
      new Date(startTime).getTime() <= new Date(endTime).getTime()
    );
  }