import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSwipe} from '../hooks/useSwipe';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export type Matrix = string[] | number[];

export interface CalendarEvent {
  id: string;
  /** Name of event */
  eventName: string;
  /** Loacation of event */
  location: string;
  /** Start date of event */
  eventStartDate: string;
  /** End date of event */
  eventEndDate: string;
  /** Event description */
  eventDescription: string;
}

interface MyCalendarProps {
  /** Active date should be just new Date() -
   *  is used for generating date matrix changing months/years
   *  and checking if event button is disabled
   * */
  activeDate: Date;
  /** Set active date */
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>;
  /** Selected date */
  selcetedDate: Date;
  /** Set selected date */
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  /** Calendar events */
  calendarEvent?: CalendarEvent[];
  /** Colors of events */
  colors?: string[];
  /** Set open add event */
  setOpenEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  /** Hide add event button (if true button is hidden) */
  hideAddEventButton?: boolean;
  /** Resize selected date cicrle by x */
  resize?: number;
}

const MyCalendar = ({
  activeDate,
  setActiveDate,
  selcetedDate,
  setSelectedDate,
  calendarEvent,
  colors,
  setOpenEvent,
  hideAddEventButton,
  resize,
}: MyCalendarProps) => {
  const theme = useTheme();
  const [today] = useState<Date>(new Date());

  const textColorForCalendarDates = (item: number, colIndex: number) => {
    /** Highlight today in calendar */
    if (
      today.getDate() === item &&
      activeDate.getMonth() === today.getMonth() &&
      activeDate.getFullYear() === today.getFullYear() &&
      today.getDate() !== selcetedDate.getDate()
    ) {
      return theme.colors.secondary;
    }
    /** Change color of today in calendar when selected */
    if (
      today.getDate() === item &&
      activeDate.getMonth() === today.getMonth() &&
      activeDate.getFullYear() === today.getFullYear() &&
      today.getDate() === selcetedDate.getDate()
    ) {
      return theme.colors.onSecondary;
    }
    /** Change color of all sundays */
    if (colIndex === 0) {
      return theme.colors.error;
    }
    /** Change color of selected date */
    if (
      selcetedDate.getDate() === item &&
      activeDate.getMonth() === selcetedDate.getMonth() &&
      activeDate.getFullYear() === selcetedDate.getFullYear()
    ) {
      return theme.colors.onSecondary;
    }
    return theme.colors.onBackground;
  };

  const highlightSelectedDate = (item: number) => {
    if (
      item === selcetedDate.getDate() &&
      activeDate.getMonth() === selcetedDate.getMonth() &&
      activeDate.getFullYear() === selcetedDate.getFullYear()
    ) {
      return theme.colors.secondary;
    } else {
      return theme.colors.background;
    }
  };

  const onChangeMonthButtonClick = (add: boolean) => {
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

  const sizeOfPressEl = (additonlSize?: number) => {
    const tmp = additonlSize ? additonlSize : 0;
    if (resize !== undefined) {
      return {height: 50 + resize + tmp, width: 50 + resize + tmp};
    } else {
      return {height: 50 + tmp, width: 50 + tmp};
    }
  };

  const generateCalendarMatrix = () => {
    var matrix: Matrix[] = [];
    // Creates the header
    matrix[0] = weekDays;

    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();

    let maxDays = nDays[month];
    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDays += 1;
      }
    }

    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row === 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          style={styles.opacityButtonChangeMonth}
          onPress={() => onChangeMonthButtonClick(false)}>
          <Text
            adjustsFontSizeToFit={true}
            style={[
              styles.buttonHeaderMonthText,
              {color: theme.colors.onBackground},
            ]}>
            {'<'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {months[activeDate.getMonth()] + ' '}
          {activeDate.getFullYear()}
        </Text>
        <TouchableOpacity
          style={styles.opacityButtonChangeMonth}
          onPress={() => onChangeMonthButtonClick(true)}>
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

  const renderAddEventButton = () => {
    const disabled = !(
      activeDate.getMonth() === selcetedDate.getMonth() &&
      activeDate.getFullYear() === selcetedDate.getFullYear()
    );
    if (hideAddEventButton !== true) {
      return (
        <View>
          <TouchableOpacity
            style={[
              styles.addEventButton,
              {
                backgroundColor: disabled
                  ? theme.colors.onSurfaceDisabled
                  : theme.colors.secondary,
              },
            ]}
            onPress={() => setOpenEvent && setOpenEvent(true)}
            disabled={disabled}>
            <Text style={[styles.addEventButtonText]}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderEventMark = (item: string | number) => {
    if (isNaN(Number(item)) || Number(item) === -1) {
      return <></>;
    }

    if (calendarEvent && calendarEvent.length > 0) {
      return calendarEvent.map((val, index) => {
        const tmpStart = val.eventStartDate.split('.');
        const startDate = new Date(
          Number(tmpStart[2]),
          Number(tmpStart[1]) - 1,
          Number(tmpStart[0]),
        );

        const tmpEnd = val.eventEndDate.split('.');
        const endDate = new Date(
          Number(tmpEnd[2]),
          Number(tmpEnd[1]) - 1,
          Number(tmpEnd[0]),
        );

        const refDate = new Date(
          activeDate.getFullYear(),
          activeDate.getMonth(),
          Number(item),
        );

        if (startDate <= refDate && refDate <= endDate) {
          return (
            <View
              key={index}
              style={[
                styles.mark,
                {
                  backgroundColor: colors && colors[index],
                },
              ]}
            />
          );
        }
      });
    }
  };

  const renderRows = () => {
    let rows: JSX.Element[] = [];
    const matrix: Matrix[] = generateCalendarMatrix();

    rows = matrix.map((row: string[] | number[], rowIndex: number) => {
      const rowItems = row.map((item: string | number, colIndex: number) => {
        return (
          <View
            style={styles.dateAndMarkView}
            key={
              String(colIndex) + String(Number(item) === selcetedDate.getDate())
            }>
            <View
              style={[
                styles.dateOpacityView,
                sizeOfPressEl(2),
                {
                  backgroundColor: highlightSelectedDate(Number(item)),
                },
              ]}>
              <TouchableOpacity
                style={[styles.dateOpacity, sizeOfPressEl(0)]}
                disabled={Number(item) ? false : true}
                onPress={() => {
                  if (Number(item) && Number(item) > -1) {
                    setSelectedDate(
                      new Date(
                        activeDate.getFullYear(),
                        activeDate.getMonth(),
                        Number(item),
                      ),
                    );
                  }
                }}>
                <Text
                  adjustsFontSizeToFit={true}
                  style={[
                    styles.textColumn,
                    {
                      color: textColorForCalendarDates(Number(item), colIndex),
                    },
                  ]}>
                  {item !== -1 ? item : ''}
                  {colIndex === 6 && rowIndex === 6 && renderAddEventButton()}
                </Text>
              </TouchableOpacity>
            </View>
            {renderEventMark(item)}
          </View>
        );
      });

      return (
        <View
          key={rowIndex}
          style={[styles.dateRow, {backgroundColor: theme.colors.background}]}>
          {rowItems}
        </View>
      );
    });
    return rows;
  };

  const onSwipeLeft = () => {
    //Next month
    onChangeMonthButtonClick(true);
  };

  const onSwipeRight = () => {
    //Previous month
    onChangeMonthButtonClick(false);
  };

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);
  return (
    <ScrollView
      style={{
        backgroundColor: theme.colors.background,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}>
      <View style={styles.main}>
        {renderHeader()}
        {renderRows()}
      </View>
    </ScrollView>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  dateAndMarkView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateOpacityView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  dateOpacity: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  textColumn: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  dateRow: {
    flex: 1,
    width: '100%',
    maxWidth: 700,
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
  },
  mark: {
    height: 2.5,
    width: '100%',
  },
  addEventButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 100,
  },
  addEventButtonText: {
    color: '#ffffff',
    fontSize: 32,
  },
});
