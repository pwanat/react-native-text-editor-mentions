import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    // flex:1,
    maxHeight: 300,
    overflow: 'visible',
  },
  suggestionsPanelStyle: {
    marginTop: 10,
  },
  loaderContainer: {},
  mentionsListContainer: {
    height: 100,
    zIndex: 11111,
    flex: 1,
  },
  mentionsListWrapperAndroid: {
    flex: 1,
    zIndex: 11111,
  },
});
