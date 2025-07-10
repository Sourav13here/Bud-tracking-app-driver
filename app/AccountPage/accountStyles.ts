import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 16,
  },
  
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },

  driverName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  driverId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 8,
  },

  statusText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },

  // Info Card
  infoCard: {
    backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },

  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1.5,
    textAlign: 'right',
  },

  // Settings Section
  settingsSection: {
    backgroundColor: 'white',
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },

  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },

  logoutItem: {
    borderBottomWidth: 0,
  },

  logoutText: {
    color: '#dc3545',
  },
});

export default styles;