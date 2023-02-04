export type TIME_TYPE = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'

export type ACTION_TIME = 'add' | 'sub'

export function checkOverlap(startTime: string, endTime: string): boolean {
  return (
    new Date(endTime).getTime() >= new Date(startTime).getTime() ||
    new Date(startTime).getTime() <= new Date(endTime).getTime()
  )
}

/**
 * @description Get & Set
 * 
 * 
 */
export const getDaysInYear = (year: number) => {
  return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

/**
 * 
 * @description Manipulate
 *
 */
export const timeIn = ({
  date,
  duration,
  unit,
  action,
}: {
  date?: Date,
  duration: number,
  unit: TIME_TYPE,
  action: ACTION_TIME
}) => {
  const currentTime: Date = date
    ? new Date(date)
    : new Date()

  let result: number
  switch (unit) {
    case 'second': {
      result = duration * 1000
      break
    }
    case 'minute': {
      result = duration * 1000 * 60
      break
    }
    case 'hour': {
      result = duration * 1000 * 60 * 60
      break
    }
    case 'day': {
      result = duration * 1000 * 3600 * 24
      break
    }
    case 'week': {
      result = duration * 1000 * 3600 * 24 * 7
      break
    }
    case 'month': {
      result = duration * 1000 * 3600 * 24 * 30
      break
    }
    case 'year': {
      result = duration * 1000 * 3600 * 24 * 365
      break
    }
  }

  if (action === 'add') {
    result = currentTime.getTime() + result
  } else {
    result = currentTime.getTime() - result
  }
  const resultDate = new Date()
  resultDate.setTime(result)

  return resultDate
}