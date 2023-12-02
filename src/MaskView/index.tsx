import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface MaskViewProps {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  translatable?: boolean;
  toggleDisplay?: boolean;
  displayDuration?: number;
  translateDuration?: number;
  MaskWidth?: number;
  MaskHeight?: number;
  boundaryWidth?: number;
  boundaryHeight?: number;
  orientation: string; 
  width?: number;
  height?: number;
}

const MaskView: React.FC<MaskViewProps> = ({
  children,
  initialPosition = { x: 0, y: 0 },
  translatable = false,
  toggleDisplay = false,
  displayDuration = 35000, // Repeat every 35 seconds
  translateDuration = 15000, // Repeat every 15 seconds
  MaskWidth = 50,
  MaskHeight = 50,
  boundaryWidth,
  boundaryHeight,
  orientation, 
  width = 360,
  height = 750,
}) => {
  // Animated values for position and opacity
  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Function to make the view invisible
  const makeInvisible = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => makeVisible(), 5000);
    });
  }, [opacity]);

  // Function to make the view visible
  const makeVisible = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  // Random position generator
  const generateRandomPosition = useCallback(() => {
    const maxWidth =
      boundaryWidth || (orientation === 'landscape' ? height : width); 
    const maxHeight =
      boundaryHeight || (orientation === 'landscape' ? width : height); 

    const x = Math.random() * (maxWidth - MaskWidth);
    const y = Math.random() * (maxHeight - MaskHeight);
    return { x, y };
  }, [
    orientation,
    boundaryWidth,
    boundaryHeight,
    MaskWidth,
    MaskHeight,
    height,
    width,
  ]);

  // Move to a new random position with animation
  const moveToRandomPosition = useCallback(() => {
    if (translatable) {
      const newPosition = generateRandomPosition();
      Animated.timing(position, {
        toValue: newPosition,
        duration: translateDuration / 2,
        useNativeDriver: true,
      }).start();
    }
  }, [translatable, generateRandomPosition, position, translateDuration]);

  // Adjust position based on orientation
  const adjustPositionForOrientationChange = useCallback(() => {
    const isLandscape = orientation?.toLocaleLowerCase()?.includes('landscape');

    if (isLandscape) {
      // Calculate new position only if in landscape mode
      const newMaxWidth = boundaryWidth || width;
      const newMaxHeight = boundaryHeight || height;

      const newX = newMaxWidth - MaskWidth - 10; // 10 pixels from the right edge
      const newY = (newMaxHeight - MaskHeight) / 2; // Vertically centered

      position.setValue({ x: newX, y: newY });
    } else {
      // If not in landscape, reset to initial position
      position.setValue(initialPosition);
    }
  }, [
    orientation,
    boundaryWidth,
    boundaryHeight,
    MaskWidth,
    MaskHeight,
    position,
  ]);

  // UseEffect for orientation change
  useEffect(() => {
    adjustPositionForOrientationChange();
  }, [
    adjustPositionForOrientationChange,
    orientation,
    boundaryWidth,
    boundaryHeight,
  ]);

  // Interval-based effects for translate and display
  useEffect(() => {
    let translateInterval: NodeJS.Timeout | undefined;
    let displayInterval: NodeJS.Timeout | undefined;

    if (translatable) {
      translateInterval = setInterval(moveToRandomPosition, translateDuration);
    }
    if (toggleDisplay) {
      displayInterval = setInterval(makeInvisible, displayDuration);
    }

    return () => {
      if (translateInterval) clearInterval(translateInterval);
      if (displayInterval) clearInterval(displayInterval);
    };
  }, [
    translatable,
    toggleDisplay,
    moveToRandomPosition,
    makeInvisible,
    translateDuration,
    displayDuration,
  ]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          width: MaskWidth,
          height: MaskHeight,
          zIndex: 9999,
          transform: position.getTranslateTransform(),
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={{ opacity }}>{children}</Animated.View>
    </Animated.View>
  );
};

export default MaskView;
