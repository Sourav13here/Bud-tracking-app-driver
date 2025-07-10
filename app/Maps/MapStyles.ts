import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#black',
  },

  accountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(86, 83, 83, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },

  accountIcon: {
    fontSize: 20,
    color: 'black',
  },

  // Map Styles
  mapContainer: {
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },

  map: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },

  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  busMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2196F3',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  busEmoji: {
    fontSize: 20,
  },
// Stoppages Styles
stoppagesContainer: {
  flex: 1,
  backgroundColor: '#FFFFFF',
},

stoppagesHeader: {
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

stoppagesTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: 4,
},

stoppagesSubtitle: {
  fontSize: 14,
  color: '#666666',
},

stoppagesHeaderRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

refreshButton: {
  padding: 5,
  borderRadius: 5,
  backgroundColor: '#F5F5F5',
},

stoppagesList: {
  paddingHorizontal: 16,
  paddingBottom: 20,
},

stoppageItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: '#FFFFFF',
  paddingVertical: 16,
  paddingHorizontal: 16,
  marginVertical: 4,
  borderRadius: 12,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  borderLeftWidth: 4,
  borderLeftColor: '#4CAF50',
},

stoppageNumber: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#4CAF50',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},

stoppageNumberText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#FFFFFF',
},

stoppageName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333333',
  marginBottom: 4,
},

stoppageDetails: {
  flex: 1,
},

stoppageCoordinates: {
  fontSize: 12,
  color: '#666666',
  marginBottom: 2,
  fontFamily: 'monospace',
},

stoppageRoute: {
  fontSize: 12,
  color: '#4CAF50',
  fontWeight: '500',
  backgroundColor: '#E8F5E8',
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 4,
  alignSelf: 'flex-start',
},

// Loading States
loadingStoppagesContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 40,
},

loadingStoppagesText: {
  marginTop: 10,
  fontSize: 16,
  color: '#666666',
},

// No Stoppages State
noStoppagesContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 40,
},

noStoppagesText: {
  fontSize: 16,
  color: '#666666',
  marginBottom: 20,
  textAlign: 'center',
},

retryButton: {
  backgroundColor: '#4CAF50',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
},

retryButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '500',
},

// Map Markers
stoppageMarker: {
  backgroundColor: '#4CAF50',
  borderRadius: 15,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'white',
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
},

stoppageMarkerText: {
  color: 'white',
  fontSize: 12,
  fontWeight: 'bold',
},
});
export default styles;