import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme, TextInput, Button} from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import MyCalendar from '../calendar/MyCalendar';

interface AddEventModalProps {
  /** Open/close modal */
  open: boolean;
  /** Set open/close */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventModal = ({open, setOpen}: AddEventModalProps) => {
  const theme = useTheme();
  const [eventName, setEventName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startEvent, setStartEvent] = useState<string>('');
  const [openStartEventCal, setOpenStartEventCal] = useState<boolean>(false);
  const [startEventChange, setStartEventChange] = useState<boolean>(false);
  const [endEvent, setEndEvent] = useState<string>('');
  const [openEndEventCal, setOpenEndEventCal] = useState<boolean>(false);
  const [endEventChange, setEndEventChange] = useState<boolean>(false);
  const [eventDescription, setEventDescription] = useState<string>('');

  const [activeDateStart, setActiveDateStart] = useState<Date>(new Date());
  const [selcetedDateStart, setSelectedDateStart] = useState<Date>(new Date());
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
    }
  }, [endEventChange, selcetedDateEnd]);

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

      setEndEventChange(false);
      setOpenEndEventCal(false);
    };

    return (
      <View>
        <Modal
          isVisible={openStartEventCal || openEndEventCal}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}>
          <MyCalendar
            activeDate={(openStartEventCal && activeDateStart) || activeDateEnd}
            setActiveDate={
              (openStartEventCal && setActiveDateStart) || setActiveDateEnd
            }
            selcetedDate={
              (openStartEventCal && selcetedDateStart) || selcetedDateEnd
            }
            setSelectedDate={
              (openStartEventCal && setSelectedDateStart) || setSelectedDateEnd
            }
          />
          <View style={{backgroundColor: theme.colors.background}}>
            <Button
              mode="text"
              onPress={() => {
                if (openStartEventCal) {
                  setStartEventChange(true);
                  setOpenStartEventCal(false);
                }
                setEndEventChange(true);
                setOpenEndEventCal(false);
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
        onBackdropPress={() => setOpen(false)}
        onBackButtonPress={() => {
          setOpen(false);
        }}>
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
            label={'Start'}
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
            label={'End'}
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
        </View>
      </Modal>
      {renderCalendarModal()}
    </View>
  );
};

export default AddEventModal;

const styles = StyleSheet.create({
  main: {alignItems: 'center', padding: 40, gap: 20},
  textInput: {
    width: '100%',
  },
});
