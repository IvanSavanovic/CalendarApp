import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme, TextInput, Button, Text} from 'react-native-paper';
import VectorImage from 'react-native-vector-image';

import MyCalendar, {CalendarEvent} from '../calendar/MyCalendar';

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
    }
  }, [open]);

  useEffect(() => {
    if (startEventChange === true) {
      const timestring = selcetedDateStart.toLocaleString('en-GB').split(' ');
      const startDateTmp = timestring[0]
        .replace('/', '.')
        .replace('/', '.')
        .replace(',', '');
      setStartEvent(startDateTmp);
      setStartEventChange(false);
    }
  }, [selcetedDateStart, startEventChange]);

  useEffect(() => {
    if (endEventChange === true) {
      const timestring = selcetedDateEnd.toLocaleString('en-GB').split(' ');
      const endDateTmp = timestring[0]
        .replace('/', '.')
        .replace('/', '.')
        .replace(',', '');
      setEndEvent(endDateTmp);
      setEndEventChange(false);
    }
  }, [endEventChange, selcetedDateEnd]);

  useEffect(() => {
    if (editEvent === true && selectedEvent !== undefined) {
      setEventName(selectedEvent.eventName);
      setLocation(selectedEvent.location);
      setStartEvent(selectedEvent.eventStartDate);
      setEndEvent(selectedEvent.eventEndDate);
      setEventDescription(selectedEvent.eventDescription);
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
        },
      ]);
      closeMainModal();
    }
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
          <View
            style={[
              styles.calModalHeader,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={styles.calModalHeaderText}>
              {openStartEventCal ? 'Select start day' : 'Select end day'}
            </Text>
          </View>
          <View>
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
            />
          </View>
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
        </Modal>
      </View>
    );
  };

  return (
    <View>
      <Modal
        isVisible={open}
        onBackdropPress={closeMainModal}
        onBackButtonPress={closeMainModal}>
        <View style={[styles.main, {backgroundColor: theme.colors.background}]}>
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
            onChangeText={setStartEvent}
            value={startEvent}
            right={
              <TextInput.Icon
                icon={() => renderIcon()}
                onPress={() => setOpenStartEventCal(true)}
              />
            }
          />
          <TextInput
            style={styles.textInput}
            label={'End: dd.mm.yyyy'}
            onChangeText={setEndEvent}
            value={endEvent}
            right={
              <TextInput.Icon
                icon={() => renderIcon()}
                onPress={() => setOpenEndEventCal(true)}
              />
            }
          />
          <TextInput
            style={styles.textInput}
            label={'Event description'}
            onChangeText={setEventDescription}
            value={eventDescription}
          />
          <View style={styles.buttonView}>
            <Button
              style={styles.buttons}
              mode="contained"
              onPress={closeMainModal}>
              CANCEL
            </Button>
            <Button style={styles.buttons} mode="contained" onPress={pressOk}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
      {renderCalendarModal()}
    </View>
  );
};

export default EventModal;

const styles = StyleSheet.create({
  main: {alignItems: 'center', padding: 40, gap: 20},
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
});
