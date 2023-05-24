import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';

export type TimePicker = {h: string; min: string};

interface TimepickerProps {
  /** Open/Close timepicker */
  openTimePicker: boolean;
  /** Set open/close timepicker */
  setOpenTimePicker: React.Dispatch<React.SetStateAction<boolean>>;
  /** Input value */
  value: TimePicker | undefined;
  /** Set imput value */
  setValue: React.Dispatch<React.SetStateAction<TimePicker | undefined>>;
}

const Timepicker = ({
  openTimePicker,
  setOpenTimePicker,
  value,
  setValue,
}: TimepickerProps): JSX.Element => {
  const theme = useTheme();
  const [h, setH] = useState<string>('');
  const [min, setMin] = useState<string>('');

  useEffect(() => {
    if (value) {
      setH(value.h);
      setMin(value.min);
    }
  }, [value]);

  const closeTimePicker = () => {
    setOpenTimePicker(false);
  };

  const addZero = (item: string) => {
    const time = Number(item);
    const returnedTime = time < 10 ? `0${time}` : `${time}`;
    return `${returnedTime}`;
  };

  return (
    <View>
      <Modal
        isVisible={openTimePicker}
        onBackdropPress={closeTimePicker}
        onBackButtonPress={closeTimePicker}>
        <View style={[styles.main, {backgroundColor: theme.colors.background}]}>
          <View style={styles.view}>
            <TextInput
              placeholder="00"
              keyboardType="numeric"
              value={h}
              onChangeText={setH}
              inputMode="numeric"
              maxLength={2}
              onEndEditing={() => setH(addZero(min))}
            />
            <Text style={styles.text}>:</Text>
            <TextInput
              placeholder="00"
              keyboardType="numeric"
              value={min}
              onChangeText={setMin}
              inputMode="numeric"
              maxLength={2}
              onEndEditing={() => setMin(addZero(min))}
            />
          </View>
          <View style={styles.view}>
            <Button onPress={closeTimePicker}>Close</Button>
            <Button
              onPress={() => {
                setValue({
                  h: h === '' ? '00' : addZero(h),
                  min: min === '' ? '00' : addZero(min),
                });
                closeTimePicker();
              }}>
              Ok
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Timepicker;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    padding: 10,
    width: 200,
    marginLeft: '20%',
    marginRight: '20%',
  },
  view: {flexDirection: 'row', alignItems: 'center', gap: 10},
  text: {fontSize: 18, fontWeight: '800'},
});
