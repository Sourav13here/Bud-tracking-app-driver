import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header Styles
headerContainer: {
  position:'absolute',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'transparent', 
  paddingHorizontal: 16,
  paddingVertical: 12,
  paddingTop: 50,
  width:'100%',

  // Remove shadow and elevation
  elevation: 0,                // Android
  shadowColor: 'transparent', // iOS
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
},

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderColor:'black',
    borderWidth:1,
  },

  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  accountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },

  accountIcon: {
    fontSize: 20,
    color: 'white',
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
    borderColor: '#050505ff',
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
  backgroundColor: 'transparent',
  borderRadius: 20,
},

stoppagesHeader: {
  backgroundColor: '#1f2937',
  paddingHorizontal: 16,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#374151',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

stoppagesTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#F3F4F6',
  marginBottom: 4,
},

stoppagesSubtitle: {
  fontSize: 14,
  color: '#9CA3AF',
},

stoppagesHeaderRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

refreshButton: {
  padding: 5,
  borderRadius: 5,
  backgroundColor: '#374151',
},

stoppagesList: {
  paddingHorizontal: 16,
  paddingBottom: 20,
},

stoppageItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: '#c3c9cfff',
  paddingVertical: 16,
  paddingHorizontal: 16,
  marginVertical: 4,
  borderRadius: 12,
  // elevation: 2,
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 1 },
  // shadowOpacity: 0.1,
  // shadowRadius: 2,
  borderWidth:2,
  borderColor: '#101111ff', 
},

stoppageNumber: {
  width: 60,
  height: 60,
  borderRadius: 16,
  backgroundColor: '#919896ff',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},

stoppageNumberText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#070707ff',
},

stoppageName: {
  fontSize: 16,
  fontWeight: '700',
  color: '#0b0b0bff',
  marginBottom: 4,
},

stoppageDetails: {
  flex: 1,
},

stoppageCoordinates: {
  fontSize: 12,
  color: '#9CA3AF',
  marginBottom: 2,
  fontFamily: 'monospace',
},

stoppageRoute: {
  fontSize: 12,
  color: '#0c0c0cff',
  fontWeight: '500',
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
  color: '#9CA3AF',
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
  color: '#9CA3AF',
  marginBottom: 20,
  textAlign: 'center',
},

retryButton: {
  backgroundColor: '#10B981',
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
  backgroundColor: '#1f2937',
  borderRadius: 15,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'black',
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
  borderWidth:1,
},
});
export default styles;