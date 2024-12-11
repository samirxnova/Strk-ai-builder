import React, { Fragment } from 'react';

import type { TVulnerability } from '@/sdk/src/types';

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import strkBuilderLogo from '@/assets/images/strk-ai-logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    color: '#333',
    padding: 20
  },
  frontPage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 40,

    logo: {
      width: 200,
      marginBottom: 20
    },

    title: {
      fontWeight: 'bold',
      fontSize: 36,
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 20
    }
  },
  section: {
    marginVertical: 15,

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#222'
    },

    subtitle: {
      fontSize: 22,
      fontWeight: 'semibold',
      marginBottom: 8,
      color: '#555'
    },

    text: {
      fontSize: 16,
      lineHeight: 1.6,
      color: '#666',
      marginBottom: 12
    }
  }
});

interface IAuditPdf {
  audit: TVulnerability[];
  title?: string;
  author?: string;
}

export default function AuditPdf({
  audit,
  title = 'Strk AI Builder - Smart Contract Audit',
  author = 'Strk AI Builder'
}: IAuditPdf) {
  return (
    <Document title={title} author={author}>
      <Page size='A4' style={styles.page}>
        <View style={styles.frontPage}>
          <Image src={strkBuilderLogo} style={styles.frontPage.logo} />
          <Text style={styles.frontPage.title}>Smart Contract Audit</Text>
        </View>
      </Page>
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.section.title}>Audit Summary</Text>
          {audit.map((vulnerability, index) => (
            <Fragment key={`${vulnerability.severity}-${index}`}>
              <Text style={styles.section.subtitle}>{vulnerability.severity}</Text>
              <Text style={styles.section.text}>{vulnerability.description}</Text>
            </Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
}
