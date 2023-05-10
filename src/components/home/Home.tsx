import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MyCalendar from '../calendar/MyCalendar';
import AddEventModal from '../modal/AddEvent';
import {useTheme} from 'react-native-paper';

const Home = () => {
  const theme = useTheme();
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [selcetedDate, setSelectedDate] = useState<Date>(new Date());
  const [openAddEvent, setOpenAddEvent] = useState<boolean>(false);

  const renderAddEventButton = () => {
    const disabled = !(
      activeDate.getMonth() === selcetedDate.getMonth() &&
      activeDate.getFullYear() === selcetedDate.getFullYear()
    );

    return (
      <View style={styles.addEventView}>
        <TouchableOpacity
          style={[
            styles.addEventButton,
            {
              backgroundColor: disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.secondary,
            },
          ]}
          onPress={() => setOpenAddEvent(true)}
          disabled={disabled}>
          <Text style={styles.addEventButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <MyCalendar
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        selcetedDate={selcetedDate}
        setSelectedDate={setSelectedDate}
        openAddEvent={openAddEvent}
        setOpenAddEvent={setOpenAddEvent}
      />
      {renderAddEventButton()}
      <AddEventModal open={openAddEvent} setOpen={setOpenAddEvent} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEventView: {
    position: 'absolute',
    top: 485,
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
});
