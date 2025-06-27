import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    
    // Loading styles
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
        fontWeight: '500',
    },
    
    // Map container - Top half
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    
    // Time overlay
    timeOverlay: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    timeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    // Control buttons
    controlsContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'column',
    },
    controlButton: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    activeControlButton: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        fontSize: 20,
    },
    
    // Legend
    legend: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 10,
        color: '#666',
    },
    
    // Callout styles
    calloutContainer: {
        padding: 10,
        minWidth: 150,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    calloutText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    
    // Bus Stoppages Section - Bottom half
    stoppagesContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    stoppagesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    stoppagesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    stoppagesList: {
        flex: 1,
        padding: 20,
    },
    
    // Empty state styles
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    emptyStateButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyStateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Info panel styles
    infoPanel: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        width: width * 0.85,
        maxWidth: 320,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    infoPanelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoPanelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    closeButton: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
        padding: 4,
    },
    infoPanelText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    trackButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    trackButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    
    // Additional styles for better UX
    activeButton: {
        color: '#2196F3',
    },
    
    // Route planning styles (for future use)
    routeContainer: {
        backgroundColor: '#f9f9f9',
        margin: 8,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    routeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    routeInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    routeStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    routeStat: {
        alignItems: 'center',
    },
    routeStatValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    routeStatLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});

export default styles;