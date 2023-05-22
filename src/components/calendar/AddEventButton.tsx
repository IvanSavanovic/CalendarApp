import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

interface AddEventButtonProps {
  /** Active date */
  activeDate: Date;
  /** Selected date */
  selcetedDate: Date;
  /** Hide add event button (if true button is hidden) */
  hideAddEventButton?: boolean;
  /** Set open add event modal */
  setOpenEvent?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventButton = ({
  activeDate,
  selcetedDate,
  hideAddEventButton,
  setOpenEvent,
}: AddEventButtonProps) => {
  const theme = useTheme();
  const disabled = !(
    activeDate.getMonth() === selcetedDate.getMonth() &&
    activeDate.getFullYear() === selcetedDate.getFullYear()
  );

  if (hideAddEventButton !== true) {
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.addEventButton,
            {
              backgroundColor: disabled
                ? theme.colors.onSurfaceDisabled
                : theme.colors.secondary,
            },
          ]}
          onPress={() => setOpenEvent && setOpenEvent(true)}
          disabled={disabled}>
          <Text style={[styles.addEventButtonText]}>+</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <></>;
  }
};

export default AddEventButton;

const styles = StyleSheet.create({
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
