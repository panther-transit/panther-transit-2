import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/*Header with menu button*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name="menu" size={30} color="#0039A6" />
        </TouchableOpacity>
      </View>
      
      {/*Sidebar menu*/}
      {menuOpen && (
        <View style={styles.sidebar}>
          <Pressable style={styles.closeButton} onPress={() => setMenuOpen(false)}>
            <Ionicons name="close" size={30} color="#0039A6" />
          </Pressable>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.push('/(menu)/alerts');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="warning-outline" size={24} color="#0039A6" style={styles.menuIcon} />
            <Text style={styles.menuItem}>Alerts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.push('/(menu)/settings');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#0039A6" style={styles.menuIcon} />
            <Text style={styles.menuItem}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.replace('../');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#0039A6" style={styles.menuIcon} />
            <Text style={styles.menuItem}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}></Text>
        <Text style={styles.subtitle}></Text>
        <Text style={styles.welcome}>Welcome to Panther Transit!</Text>
        
        <Text style={styles.sectionTitle}>Safety Tips & Emergency Info</Text>
        <Text style={styles.subtitle}>• Be aware of your surroundings and report suspicious activity.</Text>
        <Text style={styles.subtitle}>• Call GSU Police at (404) 413-2100 if you notice anything unusual.</Text>
        <Text style={styles.subtitle}>• Use the GSU LiveSafe App or Campus Crime Stoppers at 404-577-TIPS to submit tips.</Text>
        <Text style={styles.subtitle}>• Request a safety escort on campus by calling (404) 413-2100.</Text>
        <Text style={styles.subtitle}>• Contact Crime Prevention at (404) 413-3213 for safety programs and tips.</Text>
        
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>• GSU Police Department: (404) 413-3333</Text>
        <Text style={styles.subtitle}>• GSU Emergency: (404) 413-2100</Text>
        <Text style={styles.subtitle}>• MARTA Customer Service: (404) 848-5000</Text>
        <Text style={styles.subtitle}>• Safe Ride (GSU Escort Service): (404) 413-2100</Text>
        <Text style={styles.subtitle}>• Email: police@gsu.edu</Text>
        
        <Text style={styles.sectionTitle}>Upcoming Events Affecting Traffic & Parking</Text>
        <Text style={styles.subtitle}>• GSU Panthers Game Day (Feb 28th): Road closures near Center Parc Stadium.</Text>
        <Text style={styles.subtitle}>• Downtown Concert (March 5th): Heavy traffic expected near State Farm Arena.</Text>
        <Text style={styles.subtitle}>• Construction Alert: Parking Lot C closed for renovations until April 15th.</Text>
        <Text style={styles.subtitle}></Text>
        <Text style={styles.subtitle}></Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#D22B2B',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#0039A6',
  },
  menuIcon: {
    marginRight: 10,
  }
});