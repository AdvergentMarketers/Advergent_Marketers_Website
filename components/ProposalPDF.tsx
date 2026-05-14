import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// 1. REGISTER THE RAW FONT FILES
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-Regular.ttf' },
    { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 'bold' }
  ]
});

// 2. APPLY THE FONT GLOBALLY
const styles = StyleSheet.create({
  // Changed fontFamily from 'Helvetica' to 'Montserrat'
  page: { backgroundColor: '#f8f9fa', padding: 40, fontFamily: 'Montserrat' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#1a1a1a', paddingBottom: 20, marginBottom: 40 },
  logo: { width: 60, height: 'auto', objectFit: 'contain' },
  
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
  footerText: { fontSize: 8, color: '#1a1a1a', opacity: 0.5, marginBottom: 6 },
  copyrightText: { fontSize: 7, color: '#666666', textTransform: 'uppercase', letterSpacing: 1 }
});

export const ProposalPDF = ({ 
  clientName, 
  clientEmail, 
  lineItems, 
  subtotal, 
  finalTotal, 
  isBundleUnlocked,
  logoUrl
}: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.header}>
        <View>
          <Image src={logoUrl} style={styles.logo} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.documentTitle}>Estimated Scope of Work</Text>
          <Text style={{ fontSize: 9, color: '#666', marginTop: 4 }}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.label}>Prepared For</Text>
        <Text style={styles.value}>{clientName || 'Valued Client'}</Text>
        <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{clientEmail || ''}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.col1}>Service & Scope</Text>
        <Text style={styles.col2}>Quantity</Text>
        <Text style={styles.col3}>Est. Cost</Text>
      </View>

      {lineItems.map((item: any, i: number) => (
        <View style={styles.row} key={i}>
          <View style={{ width: '50%' }}>
            <Text style={styles.serviceTitle}>{item.title}</Text>
            <Text style={styles.serviceDetail}>{item.complexityNiceName}</Text>
            {item.addons && item.addons.seo && (
              <Text style={{ fontSize: 8, color: '#2563eb', marginTop: 4 }}>+ Advanced SEO Included</Text>
            )}
          </View>
          <Text style={styles.col2}>{item.receiptLabel}</Text>
          <Text style={styles.col3}>INR {item.cost.toLocaleString()}</Text>
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