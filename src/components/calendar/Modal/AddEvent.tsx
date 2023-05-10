import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';

interface AddEventModalProps {
  /** Open/close modal */
  open: boolean;
  /** Set open/close */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventModal = ({open, setOpen}: AddEventModalProps) => {
  return (
    <View>
      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        onBackButtonPress={() => {
          setOpen(false);
        }}>
        <View style={styles.main}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal>
    </View>
  );
};

export default AddEventModal;

const styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: '#ffffff'},
});
