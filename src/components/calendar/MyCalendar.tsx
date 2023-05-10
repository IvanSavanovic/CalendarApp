import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

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

interface MyCalendarProps {
  /** Active date should be just new Date() initialy -
   *  is used for generating date matrix changing months/years*/
  activeDate: Date;
  /** Set active date */
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>;
  /** Selected date */
  selcetedDate: Date;
  /** Set selected date */
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  /** Open/close AddEvent modal */
  openAddEvent: boolean;
  /** Set open/close AddEvent modal */
  setOpenAddEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyCalendar = ({
  selcetedDate,
  //openAddEvent,
  //setOpenAddEvent,
  setSelectedDate,
}: MyCalendarProps) => {
  const theme = useTheme();
  /** Used for generating date matrix, changing months/years */
  const [activeDate, setActiveDate] = useState<Date>(new Date());
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

  const onButtonClick = (add: boolean) => {
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

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => onButtonClick(false)}>
          <Text
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
        <TouchableOpacity onPress={() => onButtonClick(true)}>
          <Text
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

  const generateMatrix = () => {
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

  const renderRows = () => {
    let rows: JSX.Element[] = [];
    const matrix: Matrix[] = generateMatrix();

    rows = matrix.map((row: string[] | number[], rowIndex: number) => {
      const rowItems = row.map((item: string | number, colIndex: number) => {
        const textColor = {
          color: textColorForCalendarDates(Number(item), colIndex),
        };
        // Highlight current date
        const opacityBackgroundColor = {
          backgroundColor: highlightSelectedDate(Number(item)),
        };

        return (
          <TouchableOpacity
            key={
              String(colIndex) + String(Number(item) === selcetedDate.getDate())
            }
            style={[styles.dateOpacity, opacityBackgroundColor]}
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
            <Text style={[styles.textColumn, textColor]}>
              {item !== -1 ? item : ''}
            </Text>
          </TouchableOpacity>
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

  return (
    <View style={[styles.main, {backgroundColor: theme.colors.background}]}>
      {renderHeader()}
      {renderRows()}
    </View>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  main: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 10,
  },
  headerText: {
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonHeaderMonthText: {fontWeight: '900', fontSize: 20, textAlign: 'center'},
  dateOpacity: {
    width: 50,
    height: 50,
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
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
});
