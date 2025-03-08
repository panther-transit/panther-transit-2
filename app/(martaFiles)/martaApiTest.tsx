import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { testMartaApiConnection, fetchMartaBusData, BusPosition } from '../utils/martaAPI';

import { router } from 'expo-router';

export default function MartaApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [busData, setBusData] = useState<BusPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const runTest = async () => {
    setLoading(true);
    setError('');
    setTestResult('');
    
    try {
      // Create a custom console logger that captures output
      let logOutput = '';
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        originalConsoleLog(...args);
        logOutput += args.join(' ') + '\n';
      };
      
      console.error = (...args) => {
        originalConsoleError(...args);
        logOutput += 'ERROR: ' + args.join(' ') + '\n';
      };
      
      await testMartaApiConnection();
      setTestResult(logOutput);
      
      // Reset console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      // Get the actual data
      const data = await fetchMartaBusData();
      setBusData(data);
    } catch (err) {
      setError(`Test failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MARTA API Test</Text>
      
      <Button 
        title={loading ? "Testing..." : "Run API Test"} 
        onPress={runTest} 
        disabled={loading} 
      />
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      
      {testResult ? (
        <ScrollView style={styles.logContainer}>
          <Text style={styles.logText}>{testResult}</Text>
        </ScrollView>
      ) : null}
      
      {busData.length > 0 ? (
        <View style={styles.dataContainer}>
          <Text style={styles.subtitle}>
            Retrieved {busData.length} buses
          </Text>
          <ScrollView style={styles.busDataContainer}>
            {busData.slice(0, 10).map((bus, index) => (
              <View key={bus.id} style={styles.busItem}>
                <Text>Bus ID: {bus.id}</Text>
                <Text>Route: {bus.route}</Text>
                <Text>Position: {bus.latitude.toFixed(5)}, {bus.longitude.toFixed(5)}</Text>
              </View>
            ))}
            {busData.length > 10 && (
              <Text style={styles.moreText}>
                + {busData.length - 10} more buses...
              </Text>
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );<View style={styles.container}>
      <Text style={styles.subtitle}>This is the GSU PARKING page.</Text>   
    </View>
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  logContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    maxHeight: 200,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  error: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    borderRadius: 4,
  },
  dataContainer: {
    marginTop: 16,
  },
  busDataContainer: {
    maxHeight: 300,
  },
  busItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  moreText: {
    padding: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
