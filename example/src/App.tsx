import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaskView from '@ngenux/react-native-mask-view';

export default function App() {
  return (
    <View style={styles.container}>
      <MaskView
        translatable={false}
        toggleDisplay={true}
        initialPosition={{ x: 200, y: 400 }}
        translateDuration={1000}
        MaskWidth={150}
        MaskHeight={50}
        orientation='PORTRAIT'
      >
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
            opacity: 0.5,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 9,
              color: 'black',
            }}
          >
            @ngenux/react-native-mask-view
          </Text>
        </View>
      </MaskView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
