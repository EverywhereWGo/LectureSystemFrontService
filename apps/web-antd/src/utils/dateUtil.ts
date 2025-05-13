import dayjs from 'dayjs';

/**
 * 格式化日期为字符串
 * @param date 日期
 * @param format 格式化字符串，默认为 YYYY-MM-DD
 * @returns 格式化后的日期字符串
 */
export function formatToDate(date?: dayjs.ConfigType, format = 'YYYY-MM-DD'): string {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

/**
 * 格式化日期为带有时间的字符串
 * @param date 日期
 * @param format 格式化字符串，默认为 YYYY-MM-DD HH:mm:ss
 * @returns 格式化后的日期时间字符串
 */
export function formatToDateTime(date?: dayjs.ConfigType, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

/**
 * 格式化为友好的日期时间
 * @param date 日期
 * @returns 友好的日期时间字符串
 */
export function formatToFriendlyDateTime(date?: dayjs.ConfigType): string {
  if (!date) {
    return '';
  }
  
  const dateTime = dayjs(date);
  const now = dayjs();
  
  // 今天发布的内容显示"xx小时前"、"xx分钟前"
  if (dateTime.isSame(now, 'day')) {
    const hours = now.diff(dateTime, 'hour');
    if (hours > 0) {
      return `${hours}小时前`;
    }
    
    const minutes = now.diff(dateTime, 'minute');
    if (minutes > 0) {
      return `${minutes}分钟前`;
    }
    
    return '刚刚';
  }
  
  // 昨天发布的内容显示"昨天 xx:xx"
  if (dateTime.isSame(now.subtract(1, 'day'), 'day')) {
    return `昨天 ${dateTime.format('HH:mm')}`;
  }
  
  // 前天发布的内容显示"前天 xx:xx"  
  if (dateTime.isSame(now.subtract(2, 'day'), 'day')) {
    return `前天 ${dateTime.format('HH:mm')}`;
  }
  
  // 一周内发布的内容显示"星期x xx:xx"
  if (dateTime.isAfter(now.subtract(1, 'week'))) {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${weekDays[dateTime.day()]} ${dateTime.format('HH:mm')}`;
  }
  
  // 一周前发布的内容显示完整的日期时间
  return dateTime.format('YYYY-MM-DD HH:mm');
}

/**
 * 格式化为相对时间
 * @param date 日期
 * @returns 相对时间字符串
 */
export function formatToRelativeTime(date?: dayjs.ConfigType): string {
  if (!date) {
    return '';
  }
  
  const dateTime = dayjs(date);
  const now = dayjs();
  const diffMinutes = now.diff(dateTime, 'minute');
  
  if (diffMinutes < 1) {
    return '刚刚';
  }
  
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  
  const diffHours = now.diff(dateTime, 'hour');
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  
  const diffDays = now.diff(dateTime, 'day');
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  
  const diffWeeks = now.diff(dateTime, 'week');
  if (diffWeeks < 4) {
    return `${diffWeeks}周前`;
  }
  
  const diffMonths = now.diff(dateTime, 'month');
  if (diffMonths < 12) {
    return `${diffMonths}个月前`;
  }
  
  return `${now.diff(dateTime, 'year')}年前`;
} 