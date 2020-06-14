import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './MentionListItemStyles';

export class MentionListItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    onSuggestionTap: PropTypes.func,
    editorStyles: PropTypes.object,
  };

  onSuggestionTap = (user, hidePanel) => {
    const { onSuggestionTap } = this.props;
    onSuggestionTap(user);
  };

  render() {
    const { item: user, editorStyles } = this.props;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.suggestionItem, editorStyles.mentionListItemWrapper]}
          onPress={() => this.onSuggestionTap(user)}
        >
          <FastImage
            style={styles.fastImage}
            source={{
              uri: user.avatar,
              priority: FastImage.priority.high,
            }}
          />

          <View style={[styles.text, editorStyles.mentionListItemTextWrapper]}>
            <Text style={[styles.title, editorStyles.mentionListItemTitle]}>
              {user.name}
            </Text>
            <Text
              style={[styles.username, editorStyles.mentionListItemUsername]}
            >
              @{user.username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MentionListItem;
