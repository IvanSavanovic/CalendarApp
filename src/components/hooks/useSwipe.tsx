import {Dimensions, GestureResponderEvent} from 'react-native';
const windowWidth = Dimensions.get('window').width;

/**
 * A React Hook that enables left and right swipe gestures
 * @param onSwipeLeft void function that is called for left swipe direction
 * @param onSwipeRight void function that is called for right swipe direction
 * @param rangeOffset precision of swipe detection
 * @returns onTouchStart and onTouchEnd
 */
export const useSwipe = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  rangeOffset = 4,
) => {
  let firstTouch = 0;

  // Set user touch start position
  const onTouchStart = (e: GestureResponderEvent) => {
    firstTouch = e.nativeEvent.pageX;
  };

  // When touch ends check for swipe directions
  const onTouchEnd = (e: GestureResponderEvent) => {
    // Get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;

    // Check if position is growing positively and has reached specified range
    if (positionX - firstTouch > range) {
      onSwipeRight && onSwipeRight();
    }
    // Check if position is growing negatively and has reached specified range
    else if (firstTouch - positionX > range) {
      onSwipeLeft && onSwipeLeft();
    }
  };

  return {onTouchStart, onTouchEnd};
};
