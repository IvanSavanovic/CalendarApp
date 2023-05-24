import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme, TextInput, Button, Text} from 'react-native-paper';
import VectorImage from 'react-native-vector-image';

import MyCalendar from '../calendar/MyCalendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timepicker, {TimePicker} from '../timepicker/Timepicker';
import {CalendarEvent} from '../home/Home';

//type FormError = Omit<CalendarEvent, 'id'>;

interface EventModalProps {
  /** Open/close modal */
  open: boolean;
  /** Set open/close modal */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Calendar event */
  calendarEvent: CalendarEvent[];
  /** Set calendar event */
  setCalendarEvent: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  /** Is edit modal */
  editEvent: boolean;
  /** Set is edit modal */
  setEditEvent: React.Dispatch<React.SetStateAction<boolean>>;
  /** Selected calendar event */
  selectedEvent?: CalendarEvent;
  /** Set selected calendar event  */
  setSelectedEvent: React.Dispatch<
    React.SetStateAction<CalendarEvent | undefined>
  >;
}

const EventModal = ({
  open,
  setOpen,
  calendarEvent,
  setCalendarEvent,
  editEvent,
  setEditEvent,
  selectedEvent,
  setSelectedEvent,
}: EventModalProps) => {
  const theme = useTheme();
  const [eventName, setEventName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  //START DATE CALENDAR
  const [startEvent, setStartEvent] = useState<string>('');
  const [openStartEventCal, setOpenStartEventCal] = useState<boolean>(false);
  const [startEventChange, setStartEventChange] = useState<boolean>(false);
  const [activeDateStart, setActiveDateStart] = useState<Date>(new Date());
  const [selcetedDateStart, setSelectedDateStart] = useState<Date>(new Date());
  //END DATE CALENDAR
  const [endEvent, setEndEvent] = useState<string>('');
  const [openEndEventCal, setOpenEndEventCal] = useState<boolean>(false);
  const [endEventChange, setEndEventChange] = useState<boolean>(false);
  const [activeDateEnd, setActiveDateEnd] = useState<Date>(new Date());
  const [selcetedDateEnd, setSelectedDateEnd] = useState<Date>(new Date());
  //TIMEPICKERS
  const [openTimePickerStart, setOpenTimePickerStart] =
    useState<boolean>(false);
  const [startTime, setStartTime] = useState<TimePicker>();
  const [openTimePickerEnd, setOpenTimePickerEnd] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<TimePicker>();

  const CALENDAR_EVENT_STORAGE_KEY = 'CALENDAR_EVENT_STORAGE_KEY';

  useEffect(() => {
    if (open === false) {
      setEventName('');
      setLocation('');
      setStartEvent('');
      setEndEvent('');
      setEventDescription('');
      setActiveDateStart(new Date());
      setSelectedDateStart(new Date());
      setStartEventChange(false);
      setActiveDateEnd(new Date());
      setSelectedDateEnd(new Date());
      setEndEventChange(false);
      setOpenTimePickerStart(false);
      setStartTime(undefined);
      setOpenTimePickerEnd(false);
      setEndTime(undefined);
    }
  }, [open]);

  const setStartDateValue = useCallback(
    (val: string) => {
      if (endEvent === '') {
        setStartEvent(val);
      } else {
        const tmpStart = val.split('.');
        const startDate = new Date(
          Number(tmpStart[2]),
          Number(tmpStart[1]) - 1,
          Number(tmpStart[0]),
        );

        const tmpEnd = endEvent.split('.');
        const endDate = new Date(
          Number(tmpEnd[2]),
          Number(tmpEnd[1]) - 1,
          Number(tmpEnd[0]),
        );

        setStartEvent(val);
        if (endDate < startDate) {
          setEndEvent(val);
        }
      }
    },
    [endEvent],
  );

  useEffect(() => {
    if (startEventChange === true) {
      const timestring = selcetedDateStart.toLocaleString('en-GB').split(' ');
      const startDateTmp = timestring[0]
        .replace('/', '.')
        .replace('/', '.')
        .replace(',', '');
      setStartDateValue(startDateTmp);
      setStartEventChange(false);
    }
  }, [selcetedDateStart, setStartDateValue, startEventChange]);

  const setEndDateValue = useCallback(
    (val: string) => {
      if (startEvent === '') {
        setStartEvent(val);
        setEndEvent(val);
      } else {
        const tmpStart = startEvent.split('.');
        const startDate = new Date(
          Number(tmpStart[2]),
          Number(tmpStart[1]) - 1,
          Number(tmpStart[0]),
        );

        const tmpEnd = val.split('.');
        const endDate = new Date(
          Number(tmpEnd[2]),
          Number(tmpEnd[1]) - 1,
          Number(tmpEnd[0]),
        );

        setEndEvent(val);
        if (endDate < startDate) {
          setStartEvent(val);
        }
      }
    },
    [startEvent],
  );

  useEffect(() => {
    if (endEventChange === true) {
      const timestring = selcetedDateEnd.toLocaleString('en-GB').split(' ');
      const endDateTmp = timestring[0]
        .replace('/', '.')
        .replace('/', '.')
        .replace(',', '');
      setEndDateValue(endDateTmp);
      setEndEventChange(false);
    }
  }, [selcetedDateEnd, endEventChange, setEndDateValue]);

  useEffect(() => {
    if (editEvent === true && selectedEvent !== undefined) {
      setEventName(selectedEvent.eventName);
      setLocation(selectedEvent.location);
      setStartEvent(selectedEvent.eventStartDate);
      setEndEvent(selectedEvent.eventEndDate);
      setEventDescription(selectedEvent.eventDescription);
      setStartTime(selectedEvent.startTime);
      setEndTime(selectedEvent.endTime);
    }
  }, [editEvent, selectedEvent]);

  const closeMainModal = () => {
    setOpen(false);
    setEditEvent(false);
    setSelectedEvent(undefined);
  };

  const pressOk = () => {
    if (editEvent === true && selectedEvent !== undefined) {
      const tmp = calendarEvent;
      const i = tmp.findIndex(item => item.id === selectedEvent.id);
      tmp[i] = {
        id: Math.random() + eventName,
        eventName: eventName ? eventName : '',
        location: location ? location : '',
        eventStartDate: startEvent ? startEvent : '',
        eventEndDate: endEvent ? endEvent : '',
        eventDescription: eventDescription ? eventDescription : '',
        startTime: startTime,
        endTime: endTime,
      };
      setCalendarEvent(tmp);
      closeMainModal();
    } else {
      setCalendarEvent([
        ...calendarEvent,
        {
          id: Math.random() + eventName,
          eventName: eventName ? eventName : '',
          location: location ? location : '',
          eventStartDate: startEvent ? startEvent : '',
          eventEndDate: endEvent ? endEvent : '',
          eventDescription: eventDescription ? eventDescription : '',
          startTime: startTime,
          endTime: endTime,
        },
      ]);
      closeMainModal();
    }
  };

  const removeValueFromAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem(CALENDAR_EVENT_STORAGE_KEY);
      return true;
    } catch (e) {
      console.error(e);
    }
    console.log('Removed value from storage.');
  };

  const renderIcon = () => {
    return (
      <VectorImage source={require('../../assets/icons/calendar-plus.svg')} />
    );
  };

  const renderCalendarModal = () => {
    const closeModal = () => {
      if (openStartEventCal) {
        setStartEventChange(false);
        setOpenStartEventCal(false);
      }
      if (openEndEventCal) {
        setEndEventChange(false);
        setOpenEndEventCal(false);
      }
    };

    return (
      <View>
        <Modal
          isVisible={openStartEventCal || openEndEventCal}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}>
          <View>
            <ScrollView style={{backgroundColor: theme.colors.background}}>
              <View
                style={[
                  styles.calModalHeader,
                  {backgroundColor: theme.colors.background},
                ]}>
                <Text style={styles.calModalHeaderText}>
                  {openStartEventCal ? 'Select start date' : 'Select end date'}
                </Text>
              </View>
              <MyCalendar
                activeDate={
                  (openStartEventCal && activeDateStart) || activeDateEnd
                }
                setActiveDate={
                  (openStartEventCal && setActiveDateStart) || setActiveDateEnd
                }
                selcetedDate={
                  (openStartEventCal && selcetedDateStart) || selcetedDateEnd
                }
                setSelectedDate={
                  (openStartEventCal && setSelectedDateStart) ||
                  setSelectedDateEnd
                }
                hideAddEventButton={true}
                resize={-5}
              />
              <View
                style={[
                  styles.calModalButtons,
                  {backgroundColor: theme.colors.background},
                ]}>
                <Button
                  mode="text"
                  onPress={() => {
                    if (openStartEventCal) {
                      setStartEventChange(true);
                      setOpenStartEventCal(false);
                    }
                    if (openEndEventCal) {
                      setEndEventChange(true);
                      setOpenEndEventCal(false);
                    }
                  }}>
                  OK
                </Button>
                <Button mode="text" onPress={closeModal}>
                  CANCEL
                </Button>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };

  const renderDelete = () => {
    if (editEvent) {
      return (
        <TouchableOpacity
          onPress={() => {
            removeValueFromAsyncStorage().then(
              res => res && setCalendarEvent([]),
            );
            closeMainModal();
          }}>
          <Text style={{color: theme.colors.error}}>Delete event</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderTimeView = () => {
    const displayTime = (item: TimePicker | undefined) => {
      if (item && item.h && item.min) {
        return <Text>{item.h + ':' + item.min} </Text>;
      } else {
        return <Text>00:00 </Text>;
      }
    };

    return (
      <View>
        <View style={styles.renderTimeMain}>
          <View style={styles.renderTimeView}>
            <Text style={styles.renderTimeText}>Start: </Text>
            <TouchableOpacity onPress={() => setOpenTimePickerStart(true)}>
              <View style={styles.renderTimeView}>
                {displayTime(startTime)}
                <VectorImage
                  source={require('../../assets/icons/clock-plus-outline.svg')}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.renderTimeView}>
            <Text style={styles.renderTimeText}>End time: </Text>
            <TouchableOpacity onPress={() => setOpenTimePickerEnd(true)}>
              <View style={styles.renderTimeView}>
                {displayTime(endTime)}
                <VectorImage
                  source={require('../../assets/icons/clock-plus-outline.svg')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Timepicker
          openTimePicker={openTimePickerStart}
          setOpenTimePicker={setOpenTimePickerStart}
          value={startTime}
          setValue={setStartTime}
        />
        <Timepicker
          openTimePicker={openTimePickerEnd}
          setOpenTimePicker={setOpenTimePickerEnd}
          value={endTime}
          setValue={setEndTime}
        />
      </View>
    );
  };

  return (
    <View>
      <Modal
        isVisible={open}
        onBackdropPress={closeMainModal}
        onBackButtonPress={closeMainModal}>
        <View>
          <ScrollView>
            <View
              style={[styles.main, {backgroundColor: theme.colors.background}]}>
              <TextInput
                style={styles.textInput}
                label={'Event name'}
                onChangeText={setEventName}
                value={eventName}
              />
              <TextInput
                style={styles.textInput}
                label={'Location'}
                onChangeText={setLocation}
                value={location}
              />
              <TextInput
                style={styles.textInput}
                label={'Start: dd.mm.yyyy'}
                onChangeText={setStartDateValue}
                value={startEvent}
                inputMode="numeric"
                right={
                  <TextInput.Icon
                    icon={() => renderIcon()}
                    onPress={() => setOpenStartEventCal(true)}
                    forceTextInputFocus={false}
                  />
                }
              />
              <TextInput
                style={styles.textInput}
                label={'End: dd.mm.yyyy'}
                value={endEvent}
                onChangeText={setEndDateValue}
                inputMode="numeric"
                right={
                  <TextInput.Icon
                    icon={() => renderIcon()}
                    onPress={() => setOpenEndEventCal(true)}
                    forceTextInputFocus={false}
                  />
                }
              />
              {renderTimeView()}
              <TextInput
                style={styles.textInput}
                label={'Event description'}
                onChangeText={setEventDescription}
                value={eventDescription}
              />
              {renderDelete()}
              <View style={styles.buttonView}>
                <Button
                  style={styles.buttons}
                  mode="contained"
                  onPress={closeMainModal}>
                  CANCEL
                </Button>
                <Button
                  style={styles.buttons}
                  mode="contained"
                  onPress={pressOk}>
                  OK
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {renderCalendarModal()}
    </View>
  );
};

export default EventModal;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    padding: 40,
    gap: 20,
  },
  textInput: {
    width: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 30,
  },
  buttons: {
    width: 120,
  },
  calModalButtons: {
    paddingBottom: 10,
  },
  calModalHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  calModalHeaderText: {
    fontSize: 22,
    fontWeight: '600',
  },
  renderTimeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  renderTimeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderTimeText: {
    fontSize: 16,
  },
});
