// Configuration for Vipps payment
export const VIPPS_CONFIG = {
  phoneNumber: process.env.VIPPS_NUMBER || '106597',
  amount: '550',
  currency: 'kr',
  message: 'Merk betalinga med fullt namn, telefonnummer og t-skjortestørrelse',
}

// Catalog price
export const CATALOG_PRICE = 550 // NOK

// Contact information
export const CONTACT_INFO = {
  name: 'Kristina Sandanger',
  phone: '994 58 575',
  email: 'post@saudail.no',
  organization: 'Sauda Idrettslag',
}

// Season dates
export const SEASON_INFO = {
  start: '2025-10-01',
  end: '2026-09-15',
  kickoff: '2026-10-09',
}

