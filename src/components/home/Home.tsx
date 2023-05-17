import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Surface, useTheme, Text} from 'react-native-paper';
import {useWindowDimensions} from 'react-native';

import MyCalendar, {CalendarEvent} from '../calendar/MyCalendar';
import EventModal from '../modal/Event';

const Home = () => {
  const theme = useTheme();
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selcetedDate, setSelectedDate] = useState<Date>(new Date());
  const [openEvent, setOpenEvent] = useState<boolean>(false);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent[]>([]);
  const [editEvent, setEditEvent] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const {width} = useWindowDimensions();
  const colors: string[] = [
    'purple',
    'green',
    'red',
    'blue',
    'yellow',
    'orange',
  ];

  const renderAddEventButton = () => {
    const disabled = !(
      activeDate.getMonth() === selcetedDate.getMonth() &&
      activeDate.getFullYear() === selcetedDate.getFullYear()
    );
    const right = {right: width > 400 ? '29%' : 30};

    return (
      <View style={[styles.addEventView, right]}>
        <TouchableOpacity
          style={[
            styles.addEventButton,
            {
              backgroundColor: disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.secondary,
            },
          ]}
          onPress={() => setOpenEvent(true)}
          disabled={disabled}>
          <Text style={styles.addEventButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEventDescription = () => {
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

        if (
          startDate <= selcetedDate &&
          selcetedDate <= endDate &&
          activeDate.getMonth() === selcetedDate.getMonth()
        ) {
          return (
            <Surface key={index} style={[styles.eventDescription]}>
              <TouchableOpacity
                onPress={() => {
                  setOpenEvent(true);
                  setEditEvent(true);
                  setSelectedEvent(val);
                }}>
                <Text variant="titleLarge" style={styles.eventDescriptionLabel}>
                  {val.eventName}
                </Text>
                <View
                  style={[
                    styles.divider,
                    {
                      borderColor: colors[index],
                    },
                  ]}
                />
                {val.location && (
                  <Text variant="bodyMedium">
                    <Text style={styles.eventDescriptionLabel}>Location: </Text>
                    {val.location}
                  </Text>
                )}
                <Text variant="bodyMedium">
                  <Text style={styles.eventDescriptionLabel}>Start: </Text>
                  {val.eventStartDate}
                </Text>
                <Text variant="bodyMedium">
                  <Text style={styles.eventDescriptionLabel}>End: </Text>
                  {val.eventEndDate}
                </Text>
                {val.eventDescription && (
                  <Text variant="bodyMedium">
                    <Text style={styles.eventDescriptionLabel}>
                      Description:{' '}
                    </Text>
                    {val.eventDescription}
                  </Text>
                )}
              </TouchableOpacity>
            </Surface>
          );
        }
      });
    } else {
      return <></>;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView style={{backgroundColor: theme.colors.background}}>
        <View style={styles.calendarView}>
          <MyCalendar
            activeDate={activeDate}
            setActiveDate={setActiveDate}
            selcetedDate={selcetedDate}
            setSelectedDate={setSelectedDate}
            calendarEvent={calendarEvent}
            colors={colors}
          />
          {renderAddEventButton()}
          <View style={styles.eventDescriptionContainer}>
            {renderEventDescription()}
          </View>
          <EventModal
            open={openEvent}
            setOpen={setOpenEvent}
            calendarEvent={calendarEvent}
            setCalendarEvent={setCalendarEvent}
            editEvent={editEvent}
            setEditEvent={setEditEvent}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  calendarView: {paddingTop: 20, paddingBottom: 20},
  addEventView: {
    position: 'absolute',
    top: 410,
    right: 30,
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
  eventDescriptionContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  eventDescription: {
    minWidth: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 20,
  },
  eventDescriptionLabel: {
    fontWeight: '700',
  },
  divider: {
    minWidth: '100%',
    borderWidth: 1,
  },
});
