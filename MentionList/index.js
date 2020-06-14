import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  Animated,
  View,
  Platform,
} from 'react-native';

import MentionListItem from '../MentionListItem';
// Styles
import styles from './MentionListStyles';

export class MentionList extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array,
    editorStyles: PropTypes.object,
    isTrackingStarted: PropTypes.bool,
    suggestions: PropTypes.array,
    keyword: PropTypes.string,
    onSuggestionTap: PropTypes.func,
    horizontal: PropTypes.bool,
  };

  constructor() {
    super();
    this.previousChar = ' ';
  }

  renderSuggestionsRow = ({ item }) => (
    <MentionListItem
      onSuggestionTap={this.props.onSuggestionTap}
      item={item}
      editorStyles={this.props.editorStyles}
    />
  );

  render() {
    const { props } = this;
    const { editorStyles = {} } = props;
    const { keyword, isTrackingStarted } = props;
    const withoutAtKeyword = keyword.substr(1, keyword.length);
    const { list } = this.props;
    const suggestions =
      withoutAtKeyword !== ''
        ? list.filter(user => user.username.includes(withoutAtKeyword))
        : list;
    if (!isTrackingStarted) {
      return null;
    }

    return (
      <Animated.View
        style={[
          { ...styles.suggestionsPanelStyle },
          Platform.OS === 'ios'
            ? editorStyles.mentionsListWrapper
            : editorStyles.mentionsListWrapperAndroid,
        ]}
      >
        <FlatList
          style={[
            styles.mentionsListContainer,
            editorStyles.mentionsListContainer,
          ]}
          keyboardShouldPersistTaps="always"
          horizontal={props.horizontal || false}
          ListEmptyComponent={
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
            </View>
          }
          enableEmptySections
          data={suggestions}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={rowData => this.renderSuggestionsRow(rowData)}
          nestedScrollEnabled
        />
      </Animated.View>
    );
  }
}

export default MentionList;
