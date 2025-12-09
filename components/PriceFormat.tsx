'use client';

import React from 'react';

export type CurrencyType = 'NPR' | 'USD' | 'INR';
export type FormatType = 'short' | 'full' | 'compact' | 'words';

interface PriceFormatProps {
  amount: number | string;
  currency?: CurrencyType;
  format?: FormatType;
  className?: string;
  showSymbol?: boolean;
  showCommas?: boolean;
  decimalPlaces?: number;
  locale?: string;
}

const PriceFormat: React.FC<PriceFormatProps> = ({
  amount,
  currency = 'NPR',
  format = 'full',
  className = '',
  showSymbol = true,
  showCommas = true,
  decimalPlaces = 2,
  locale = 'ne-NP'
}) => {
  // Convert amount to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid amounts
  if (isNaN(numAmount)) {
    return <span className={className}>Rs. 0.00</span>;
  }

  // Format based on type
  const formattedPrice =FormatPrice(numAmount, currency, format, showCommas, decimalPlaces, locale);

  return (
    <span className={`font-medium ${className}`}>
      {showSymbol ? formattedPrice : formattedPrice.replace(/[₹रू₹\s]/g, '').trim()}
    </span>
  );
};

// Utility function to format prices
export const FormatPrice = (
  amount: number,
  currency: CurrencyType = 'NPR',
  format: FormatType = 'full',
  showCommas: boolean = true,
  decimalPlaces: number = 2,
  locale: string = 'ne-NP'
): string => {
  if (isNaN(amount)) return 'Rs. 0.00';

  const absoluteAmount = Math.abs(amount);
  let formatted = '';

  switch (format) {
    case 'short':
      formatted = formatShort(absoluteAmount, decimalPlaces);
      break;
    case 'compact':
      formatted = formatCompact(absoluteAmount, decimalPlaces);
      break;
    case 'words':
      formatted = amountInWords(absoluteAmount);
      break;
    case 'full':
    default:
      formatted = formatFull(absoluteAmount, showCommas, decimalPlaces);
      break;
  }

  // Add currency symbol and sign
  const symbol = getCurrencySymbol(currency);
  const sign = amount < 0 ? '-' : '';
  const prefix = currency === 'NPR' ? 'रू ' : symbol;

  return `${sign}${prefix}${formatted}`;
};

// Full format (e.g., १,२३,४५६.७८)
const formatFull = (amount: number, showCommas: boolean, decimalPlaces: number): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: showCommas
  };

  // For Nepali locale
  try {
    const formatter = new Intl.NumberFormat('ne-NP', options);
    return formatter.format(amount);
  } catch {
    // Fallback to English
    const formatter = new Intl.NumberFormat('en-IN', options);
    return formatter.format(amount);
  }
};

// Short format (e.g., 1.23L, 12.34K)
const formatShort = (amount: number, decimalPlaces: number): string => {
  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(decimalPlaces) + 'Cr';
  } else if (amount >= 100000) {
    return (amount / 100000).toFixed(decimalPlaces) + 'L';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(decimalPlaces) + 'K';
  }
  return amount.toFixed(decimalPlaces);
};

// Compact format (e.g., 1.23 लाख, 12.34 हजार)
const formatCompact = (amount: number, decimalPlaces: number): string => {
  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(decimalPlaces) + ' करोड';
  } else if (amount >= 100000) {
    return (amount / 100000).toFixed(decimalPlaces) + ' लाख';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(decimalPlaces) + ' हजार';
  }
  return amount.toFixed(decimalPlaces);
};

// Convert amount to words (Nepali)
const amountInWords = (amount: number): string => {
  const units = ['', 'एक', 'दुई', 'तीन', 'चार', 'पाँच', 'छ', 'सात', 'आठ', 'नौ'];
  const teens = ['दस', 'एघार', 'बाह्र', 'तेह्र', 'चौध', 'पन्ध्र', 'सोह्र', 'सत्र', 'अठार', 'उन्नाइस'];
  const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठी', 'सत्तरी', 'अस्सी', 'नब्बे'];
  const thousands = ['', 'हजार', 'लाख', 'करोड', 'अर्ब', 'खर्ब', 'नील', 'पद्म', 'शंख'];

  const numToWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    if (num < 1000) return units[Math.floor(num / 100)] + ' सय ' + numToWords(num % 100);
    
    for (let i = 1; i < thousands.length; i++) {
      if (num < Math.pow(1000, i + 1)) {
        return (
          numToWords(Math.floor(num / Math.pow(1000, i))) + 
          ' ' + thousands[i] + ' ' + 
          numToWords(num % Math.pow(1000, i))
        ).trim();
      }
    }
    return '';
  };

  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);
  
  let words = numToWords(rupees) + ' रुपैया';
  if (paisa > 0) {
    words += ' र ' + numToWords(paisa) + ' पैसा';
  }
  
  return words.trim();
};

const getCurrencySymbol = (currency: CurrencyType): string => {
  const symbols = {
    'NPR': 'रू ',
    'USD': '$',
    'INR': '₹'
  };
  return symbols[currency];
};

export default PriceFormat;