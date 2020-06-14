import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { EU, formatMentionNode, formatLinkNode } from '..';

export default class EditorRender extends Component {
  static propTypes = {
    styles: PropTypes.object,
    children: PropTypes.object,
    navigation: PropTypes.object,
  };

  render() {
    const { styles = {}, children, navigation } = this.props;

    let formattedText = EU.displayTextWithMentions(
      children.toString(),
      formatMentionNode,
      navigation
    );
    if (formattedText) {
      formattedText = EU.displayTextWithLinks(formattedText, formatLinkNode);
    }
    return <Text style={styles}>{formattedText}</Text>;
  }
}
