/**
 * EditorUtils contains helper
 * functions for our Editor
 */
import React from 'react';
import { Text, TouchableOpacity, Linking } from 'react-native';
import styles from './EditorStyles';

export const formatMentionNode = (txt, key, navigation, userId) => (
  <Text
    key={key}
    style={styles.mentionRender}
    onPress={() => navigation.push('ProfileScreen', { profileID: userId })}
  >
    {txt}
  </Text>
);

export const formatLinkNode = (link, key) => (
  <Text
    key={key}
    style={styles.mentionRender}
    onPress={() => Linking.openURL(link)}
  >
    {link}
  </Text>
);

export const displayTextWithMentions = (
  inputText,
  formatMentionNode,
  navigation
) => {
  /**
   * Use this function to parse mentions markup @[username](id) in the string value.
   */
  if (inputText === '') {
    return null;
  }

  const retLines = inputText.split('\n');
  const formattedText = [];
  retLines.forEach((retLine, rowIndex) => {
    const mentions = EU.findMentions(retLine);
    if (mentions.length) {
      let lastIndex = 0;
      if (mentions.length) {
        mentions.forEach((men, index) => {
          const initialStr = retLine.substring(lastIndex, men.start);
          lastIndex = men.end + 1;
          formattedText.push(initialStr);
          const formattedMention = formatMentionNode(
            `@${men.username}`,
            `${index}-${men.id}-${rowIndex}`,
            navigation,
            `${men.id}`
          );
          formattedText.push(formattedMention);
          if (mentions.length - 1 === index) {
            const lastStr = retLine.substr(lastIndex); // remaining string
            formattedText.push(lastStr);
          }
        });
      }
    } else {
      formattedText.push(retLine);
    }
    // formattedText.push('\n');
  });
  return formattedText;
};

export const displayTextWithLinks = (retLines, formatLinkNode) => {
  /**
   * Use this function to parse links in the string value.
   */
  if (retLines.length === 0) {
    return null;
  }
  const formattedText = [];
  retLines.forEach((retLine, rowIndex) => {
    const links = EU.findLinks(retLine);
    if (links.length) {
      let lastIndex = 0;
      links.forEach((men, index) => {
        const initialStr = retLine.substring(lastIndex, men.start);
        lastIndex = men.end + 1;
        formattedText.push(initialStr);
        const formattedLink = formatLinkNode(`${men.link}`);
        formattedText.push(formattedLink);
        if (links.length - 1 === index) {
          const lastStr = retLine.substr(lastIndex); // remaining string
          formattedText.push(lastStr);
        }
      });
    } else {
      formattedText.push(retLine);
    }
  });
  return formattedText;
};

export const EU = {
  specialTagsEnum: {
    mention: 'mention',
    strong: 'strong',
    italic: 'italic',
    underline: 'underline',
  },
  isKeysAreSame: (src, dest) => src.toString() === dest.toString(),
  getLastItemInMap: map => Array.from(map)[map.size - 1],
  getLastKeyInMap: map => Array.from(map.keys())[map.size - 1],
  getLastValueInMap: map => Array.from(map.values())[map.size - 1],
  updateRemainingMentionsIndexes: (map, { start, end }, diff, shouldAdd) => {
    const newMap = new Map(map);
    const keys = EU.getSelectedMentionKeys(newMap, { start, end });
    keys.forEach(key => {
      const newKey = shouldAdd
        ? [key[0] + diff, key[1] + diff]
        : [key[0] - diff, key[1] - diff];
      const value = newMap.get(key);
      newMap.delete(key);
      // ToDo+ push them in the same order.
      newMap.set(newKey, value);
    });
    return newMap;
  },
  getSelectedMentionKeys: (map, { start, end }) => {
    const mantionKeys = [...map.keys()];
    const keys = mantionKeys.filter(
      ([a, b]) => EU.between(a, start, end) || EU.between(b, start, end)
    );
    return keys;
  },
  findMentionKeyInMap: (map, cursorIndex) => {
    // const keys = Array.from(map.keys())
    // OR
    const keys = [...map.keys()];
    const key = keys.filter(([a, b]) => EU.between(cursorIndex, a, b))[0];
    return key;
  },
  addMenInSelection: (selection, prevSelc, mentions) => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings
     * meaning their indexes in the string start from 0
     * While user made a selection automatically add mention in the selection.
     */
    const sel = { ...selection };
    mentions.forEach((value, [menStart, menEnd]) => {
      if (EU.diff(prevSelc.start, prevSelc.end) < EU.diff(sel.start, sel.end)) {
        // user selecting.
        if (EU.between(sel.start, menStart, menEnd)) {
          // move sel to the start of mention
          sel.start = menStart; // both men and selection is 0th index
        }
        if (EU.between(sel.end - 1, menStart, menEnd)) {
          // move sel to the end of mention
          sel.end = menEnd + 1;
        }
      } else {
        // previousSelection.diff > currentSelection.diff //user deselecting.
        if (EU.between(sel.start, menStart, menEnd)) {
          // deselect mention to the end of mention
          sel.start = menEnd + 1;
        }
        if (EU.between(sel.end, menStart, menEnd)) {
          // deselect mention to the start of mention
          sel.end = menStart;
        }
      }
    });
    return sel;
  },
  moveCursorToMentionBoundry: (
    selection,
    prevSelc,
    mentions,
    isTrackingStarted
  ) => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings
     * moveCursorToMentionBoundry will move cursor to the start
     * or to the end of mention based on user traverse direction.
     */
    const sel = { ...selection };
    if (isTrackingStarted) {
      return sel;
    }
    mentions.forEach((value, [menStart, menEnd]) => {
      if (prevSelc.start > sel.start) {
        // traversing Right -to- Left  <=
        if (EU.between(sel.start, menStart, menEnd)) {
          // move cursor to the start of mention
          sel.start = menStart;
          sel.end = menStart;
        }
      } else {
        // traversing Left -to- Right =>
        if (EU.between(sel.start - 1, menStart, menEnd)) {
          // move cursor to the end of selection
          sel.start = menEnd + 1;
          sel.end = menEnd + 1;
        }
      }
    });
    return sel;
  },
  between: (x, min, max) => x >= min && x <= max,
  sum: (x, y) => x + y,
  diff: (x, y) => Math.abs(x - y),
  isEmpty: str => str === '',
  getMentionsWithInputText: inputText => {
    /**
     * translate provided string e.g. `Hey @[pawel.wanat](id:1) this is good work.`
     * populate mentions map with [start, end] : {...user}
     * translate inputText to desired format; `Hey @pawel.wanat this is good work.`
     */
    const map = new Map();
    let newValue = '';

    if (inputText === '') {
      return null;
    }
    const retLines = inputText.split('\n');

    retLines.forEach((retLine, rowIndex) => {
      const mentions = EU.findMentions(retLine);
      if (mentions.length) {
        let lastIndex = 0;
        let endIndexDiff = 0;
        mentions.forEach((men, index) => {
          newValue = newValue.concat(retLine.substring(lastIndex, men.start));
          const username = `@${men.username}`;
          newValue = newValue.concat(username);
          const menEndIndex = men.start + (username.length - 1);
          map.set([men.start - endIndexDiff, menEndIndex - endIndexDiff], {
            id: men.id,
            username: men.username,
          });
          // indexes diff with the new formatted string.
          endIndexDiff += Math.abs(men.end - menEndIndex);
          // update last index
          lastIndex = men.end + 1;
          if (mentions.length - 1 === index) {
            const lastStr = retLine.substr(lastIndex); // remaining string
            newValue = newValue.concat(lastStr);
          }
        });
      } else {
        newValue = newValue.concat(retLine);
      }
      if (rowIndex !== retLines.length - 1) {
        newValue = newValue.concat('\n');
      }
    });
    return {
      map,
      newValue,
    };
  },
  findMentions: val => {
    /**
     * Find mention e.g. `Hey @[pawel.wanat](id:1) this is good work.`
     * Both Mentions and Selections are 0-th index based in the strings
     * meaning their indexes in the string start from 0
     * findMentions finds starting and ending positions of mentions in the given text
     * @param val string to parse to find mentions
     * @returns list of found mentions
     */

    const reg = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/gim;
    const indexes = [];
    let match;
    while ((match = reg.exec(val))) {
      indexes.push({
        start: match.index,
        end: reg.lastIndex - 1,
        username: match[1],
        id: match[2],
        type: EU.specialTagsEnum.mention,
      });
    }
    return indexes;
  },
  findLinks: val => {
    /**
     * @param val string to parse to find mentions
     * @returns list of found links
     */
    const reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gim;
    const indexes = [];
    let match;

    while ((match = reg.exec(val))) {
      indexes.push({
        start: match.index,
        end: reg.lastIndex - 1,
        link: match[1],
        // type: EU.specialTagsEnum.mention,
      });
    }
    return indexes;
  },
  whenTrue: (next, current, key) =>
    /**
     * whenTrue function will be used to check the
     * boolean props for the component
     * @params {current, next, key}
     * @next: this.props
     * @current: nextProps
     * @key: key to lookup in both objects
     * and will only returns true. if nextProp is true
     * and nextProp is a different version/value from
     * previous prop
     */
    next[key] && next[key] !== current[key],
  displayTextWithMentions,
  displayTextWithLinks,
};

export default EU;
