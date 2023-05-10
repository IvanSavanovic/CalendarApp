import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme, TextInput} from 'react-native-paper';

interface AddEventModalProps {
  /** Open/close modal */
  open: boolean;
  /** Set open/close */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventModal = ({open, setOpen}: AddEventModalProps) => {
  const theme = useTheme();
  const [eventName, setEventName] = useState<string>('');
  const [eventInformation, setEventInformation] = useState<string>('');

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
            label={'Event information'}
            onChangeText={setEventInformation}
            value={eventInformation}
          />
        </View>
      </Modal>
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
