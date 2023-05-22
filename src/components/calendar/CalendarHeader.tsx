import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {months} from './MyCalendar';

/**
 * Change month on click
 * @param add if true add month
 * @param activeDate see MyCalendarProps
 * @param setActiveDate set function
 */
export const onChangeMonthButtonClick = (
  add: boolean,
  activeDate: Date,
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>,
) => {
  if (add) {
    if (activeDate.getMonth() + 1 > 11) {
      setActiveDate(new Date(activeDate.getFullYear() + 1, 0, 1));
    } else {
      setActiveDate(
        new Date(
          activeDate.getFullYear(),
          activeDate.getMonth() + 1,
          activeDate.getDate(),
        ),
      );
    }
  } else {
    if (activeDate.getMonth() - 1 < 0) {
      setActiveDate(new Date(activeDate.getFullYear() - 1, 11, 1));
    } else {
      setActiveDate(
        new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1),
      );
    }
  }
};

interface CalendarHeaderProps {
  /** Active date */
  activeDate: Date;
  /** Set active date */
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarHeader = ({activeDate, setActiveDate}: CalendarHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.headerView}>
      <TouchableOpacity
        style={styles.opacityButtonChangeMonth}
        onPress={() =>
          onChangeMonthButtonClick(false, activeDate, setActiveDate)
        }>
        <Text
          adjustsFontSizeToFit={true}
          style={[
            styles.buttonHeaderMonthText,
            {color: theme.colors.onBackground},
          ]}>
          {'<'}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.headerText, {color: theme.colors.onBackground}]}>
        {months[activeDate.getMonth()] + ' '}
        {activeDate.getFullYear()}
      </Text>
      <TouchableOpacity
        style={styles.opacityButtonChangeMonth}
        onPress={() =>
          onChangeMonthButtonClick(true, activeDate, setActiveDate)
        }>
        <Text
          adjustsFontSizeToFit={true}
          style={[
            styles.buttonHeaderMonthText,
            {color: theme.colors.onBackground},
          ]}>
          {'>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerText: {
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
  opacityButtonChangeMonth: {
    width: 64,
    height: 38,
    marginBottom: -5,
  },
  buttonHeaderMonthText: {fontWeight: '900', fontSize: 20, textAlign: 'center'},
});
