import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


// SAFTEY FIX 1: Removed Font.register to prevent missing .ttf file crashes. 
// It will safely use the built-in default font for now.

const styles = StyleSheet.create({
  page: { backgroundColor: '#f8f9fa', padding: 40 }, // Removed fontFamily
  
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#1a1a1a', paddingBottom: 20, marginBottom: 40 },
  
  // Custom text-based logo style to replace the image
  logo: { width: 40, height: 'auto', objectFit: 'contain' },
  
  documentTitle: { fontSize: 10, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2 },
  clientSection: { marginBottom: 40 },
  label: { fontSize: 8, color: '#666666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 12, color: '#1a1a1a', fontWeight: 'bold' },
  
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#cccccc', paddingBottom: 8, marginBottom: 12 },
  col1: { width: '50%', fontSize: 9, color: '#666666', textTransform: 'uppercase' },
  col2: { width: '25%', fontSize: 9, color: '#666666', textTransform: 'uppercase', textAlign: 'right' },
  col3: { width: '25%', fontSize: 9, color: '#666666', textTransform: 'uppercase', textAlign: 'right' },
  
  row: { flexDirection: 'row', paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eeeeee' },
  serviceTitle: { fontSize: 11, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
  serviceDetail: { fontSize: 9, color: '#666666' },
  priceText: { fontSize: 11, color: '#1a1a1a', textAlign: 'right' },
  
  totalsSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 2, borderTopColor: '#1a1a1a' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 10, color: '#666666', textTransform: 'uppercase' },
  totalValue: { fontSize: 12, color: '#1a1a1a' },
  discountLabel: { fontSize: 10, color: '#2563eb', textTransform: 'uppercase' },
  discountValue: { fontSize: 12, color: '#2563eb' },
  
  finalTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  finalTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#1a1a1a', textTransform: 'uppercase' },
  finalTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center' },
  footerText: { fontSize: 8, color: '#999999', textAlign: 'center' },
  copyrightText: { fontSize: 7, color: '#666666', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }
});

export const ProposalPDF = ({ 
  clientName, 
  clientEmail, 
  lineItems = [], // Added fallback empty array
  subtotal = 0,   // Added fallback 0
  finalTotal = 0, // Added fallback 0
  isBundleUnlocked,
  logoUrl
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header}>
        <View>
          {/* Ensure logoUrl is passed down from the page.tsx state */}
          {logoUrl ? (
             <Image src={logoUrl} style={styles.logo} />
          ) : (
             <Text style={{ fontSize: 18, fontWeight: 'extrabold', color: '#1a1a1a' }}>ADVERGENT</Text>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.documentTitle}>Estimated Scope of Work</Text>
          <Text style={{ fontSize: 9, color: '#666', marginTop: 4 }}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.label}>Prepared For</Text>
        <Text style={styles.value}>{clientName || 'Valued Client'}</Text>
        {/* Strict check for email to avoid rendering undefined strings */}
        {clientEmail ? <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{clientEmail}</Text> : null}
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.col1}>Service & Scope</Text>
        <Text style={styles.col2}>Quantity</Text>
        <Text style={styles.col3}>Est. Cost</Text>
      </View>

      {lineItems.map((item: any, i: number) => (
        <View style={styles.row} key={i}>
          <View style={{ width: '50%' }}>
            <Text style={styles.serviceTitle}>{item.title || 'Service'}</Text>
            <Text style={styles.serviceDetail}>{item.complexityNiceName || 'Standard'}</Text>
            {item.addons && item.addons.seo && (
              <Text style={{ fontSize: 8, color: '#2563eb', marginTop: 4 }}>+ Advanced SEO Included</Text>
            )}
          </View>
          <Text style={styles.col2}>{item.receiptLabel || '1'}</Text>
          {/* Safely handle the cost number */}
          <Text style={styles.col3}>INR {item.cost ? item.cost.toLocaleString() : '0'}</Text>
        </View>
      ))}

      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>INR {subtotal.toLocaleString()}</Text>
        </View>

        {isBundleUnlocked && (
          <View style={styles.totalRow}>
            <Text style={styles.discountLabel}>Agency Ecosystem Discount (5%)</Text>
            <Text style={styles.discountValue}>- INR {(subtotal * 0.05).toLocaleString()}</Text>
          </View>
        )}

        <View style={styles.finalTotalRow}>
          <Text style={styles.finalTotalLabel}>Estimated Total</Text>
          <Text style={styles.finalTotalValue}>INR {finalTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          * This is a 95% accurate baseline estimate. Final pricing is locked in upon signing an official SOW.
        </Text>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} Advergent Marketers. All rights reserved.
        </Text>
      </View>

    </Page>
  </Document>
);