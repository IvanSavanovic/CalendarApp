import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Surface, useTheme, Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import MyCalendar from '../calendar/MyCalendar';
import EventModal from '../modal/Event';
import {TimePicker} from '../timepicker/Timepicker';

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
  /** Start time */
  startTime: TimePicker | undefined;
  /** End time */
  endTime: TimePicker | undefined;
}

const Home = () => {
  const theme = useTheme();
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selcetedDate, setSelectedDate] = useState<Date>(new Date());
  const [openEvent, setOpenEvent] = useState<boolean>(false);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent[]>([]);
  const [editEvent, setEditEvent] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const colors: string[] = [
    'purple',
    'green',
    'red',
    'blue',
    'yellow',
    'orange',
    'maroon',
    'lime',
    'fuchsia',
    'aqua',
  ];
  const CALENDAR_EVENT_STORAGE_KEY = 'CALENDAR_EVENT_STORAGE_KEY';

  const getCalendarEventData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CALENDAR_EVENT_STORAGE_KEY);
      if (jsonValue !== null) {
        const res: CalendarEvent[] = JSON.parse(jsonValue);
        return res;
      }
    } catch (e) {
      console.error(e);
    }
  };

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;

    // Check if the user pressed the "Mark as read" action
    if (pressAction) {
      if (
        type === EventType.ACTION_PRESS &&
        pressAction.id === 'mark-as-read'
      ) {
        // Update
        await getCalendarEventData();

        // Remove the notification
        if (notification && notification.id) {
          await notifee.cancelNotification(notification.id);
        }
      }
    }
  });

  const onDisplayNotification = async (item: CalendarEvent) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: item.eventName,
      body:
        'DisplayNotification' +
        item.eventDescription +
        `${item.location ? ' at ' + item.location : ''}`,
      android: {
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const triggerMaker = (calEvent: CalendarEvent) => {
    const tmpStart = calEvent.eventStartDate.split('.');
    const startDate = new Date(
      Number(tmpStart[2]),
      Number(tmpStart[1]) - 1,
      Number(tmpStart[0]),
    );
    if (calEvent.startTime && calEvent.startTime.h && calEvent.startTime.min) {
      startDate.setHours(Number(calEvent.startTime.h));
      startDate.setMinutes(Number(calEvent.startTime.min));
    }

    const now = new Date();
    if (now > startDate) {
      return;
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: startDate.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    return trigger;
  };

  const triggerNotification = async (
    item: CalendarEvent,
    trigger: TimestampTrigger,
  ) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.createTriggerNotification(
      {
        id: item.id,
        title: item.eventName + 'triggerNotification',
        body:
          'TriggerNotification' +
          item.eventDescription +
          `${item.location ? ' at ' + item.location : ''}`,
        android: {
          channelId: channelId,
        },
      },
      trigger,
    );
  };

  const checkTime = useCallback(() => {
    const now = new Date();
    if (calendarEvent && calendarEvent.length > 0) {
      calendarEvent.forEach(item => {
        const tmpStart = item.eventStartDate.split('.');
        const startDate = new Date(
          Number(tmpStart[2]),
          Number(tmpStart[1]) - 1,
          Number(tmpStart[0]),
        );
        startDate.setHours(item.startTime ? Number(item.startTime.h) : 0);
        startDate.setMinutes(item.startTime ? Number(item.startTime.min) : 0);

        const tmpEnd = item.eventEndDate.split('.');
        const endDate = new Date(
          Number(tmpEnd[2]),
          Number(tmpEnd[1]) - 1,
          Number(tmpEnd[0]),
        );
        endDate.setHours(item.endTime ? Number(item.endTime.h) : 0);
        endDate.setMinutes(item.endTime ? Number(item.endTime.min) : 0);

        const tmpNow = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        tmpNow.setHours(now.getHours());
        tmpNow.setMinutes(now.getMinutes());

        triggerMaker(item);
        if (tmpNow >= startDate && tmpNow <= endDate) {
          if (tmpNow.getDate() === startDate.getDate()) {
            if (
              item.startTime !== undefined &&
              now.getHours() >= Number(item.startTime.h) &&
              now.getMinutes() >= Number(item.startTime.min)
            ) {
              onDisplayNotification(item);
            }
          } else if (tmpNow.getDate() === endDate.getDate()) {
            if (
              item.endTime !== undefined &&
              now.getHours() <= Number(item.endTime.h) &&
              now.getMinutes() <= Number(item.endTime.min)
            ) {
              onDisplayNotification(item);
            }
          } else {
            onDisplayNotification(item);
          }
        } else {
          const tmp = triggerMaker(item);
          if (tmp) {
            triggerNotification(item, tmp);
          }
        }
      });
    }
  }, [calendarEvent]);

  useEffect(() => {
    checkTime();
  }, [checkTime]);

  const storeCalendarEvent = async (value: CalendarEvent[]) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(CALENDAR_EVENT_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getCalendarEventData().then(res => res && setCalendarEvent(res));
  }, []);

  useEffect(() => {
    if (calendarEvent && calendarEvent.length > 0) {
      storeCalendarEvent(calendarEvent).catch(err => console.error(err));
    }
  }, [calendarEvent, editEvent]);

  const renderEventDescription = () => {
    const displayTime = (item: TimePicker | undefined) => {
      if (item && item.h && item.min) {
        return ' at ' + item.h + ':' + item.min + 'h';
      } else {
        return ' at ' + '00' + ':' + '00' + 'h';
      }
    };

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
                <View>
                  <Text
                    variant="titleLarge"
                    style={styles.eventDescriptionLabel}>
                    {val.eventName}
                  </Text>
                </View>
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
                  {displayTime(val.startTime)}
                </Text>
                <Text variant="bodyMedium">
                  <Text style={styles.eventDescriptionLabel}>End: </Text>
                  {val.eventEndDate}
                  {displayTime(val.endTime)}
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
            setOpenEvent={setOpenEvent}
          />
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
