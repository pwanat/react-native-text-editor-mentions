import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    borderColor: '#00446A',
    paddingTop: 10,
    paddingBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    position: 'relative',
    zIndex: 1000,
  },
  editorContainer: {
    height: 160,
  },
  textContainer: {
    alignSelf: 'stretch',
    position: 'relative',
    minHeight: 160,
    maxHeight: 160,
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingHorizontal: 20,
    minHeight: 160,
    position: 'absolute',
    top: 0,
    alignSelf: 'stretch',
    width: '100%',
    // top: -3.9,
    // left: 1,
  },
  inputAndroid: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    paddingHorizontal: 20,
    minHeight: 160,
    position: 'absolute',
    alignSelf: 'stretch',
    width: '100%',
    top: -4.9,
    left: 0,
  },
  formmatedTextWrapper: {
    minHeight: 160,
    position: 'absolute',
    top: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
  },
  formmatedText: {
    fontSize: 16,
    fontWeight: '400',
  },
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
  mentionRender: {
    color: '#244dc9',
    fontSize: 14,
  },
  placeholderText: {
    color: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  },
  mentionList: {
    marginTop: 0,
  },
});