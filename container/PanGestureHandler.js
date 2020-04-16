
import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
 
 
export default class DraggableBox extends Component {
  constructor(props) {
    super(props);
 
    this.state = {active: false};

    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);
    this._lastOffset = { x: 0, y: 0 };
 
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            // Note that here is translationX not translateX
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      // Note that this object is not in the array above
      {
        useNativeDriver: true,
      }
    );
  }
 
  _onHandleStateChange = event => {

    const newState = event.nativeEvent.state;
    const oldState = event.nativeEvent.oldState;

    const active = newState === State.ACTIVE;

    if(this.state.active !== active){
      this.setState({
        active,
      });
    }

    if (oldState === State.ACTIVE) {

      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      
      this._translateX.setValue(0);
      this._translateY.setValue(0);

      this._translateX.setOffset(this._lastOffset.x);
      this._translateY.setOffset(this._lastOffset.y);

      // setTimeout(()=>{
      //   Animated.timing(this._translateX, {toValue: 0, useNativeDriver: true}).start();
      //   Animated.timing(this._translateY, {toValue: 0, useNativeDriver: true}).start();
      // },1000);

    
    }
  }
  
  render() {
    return (
      <>
        <PanGestureHandler
          {...this.props}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandleStateChange}
        >
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this._translateX },
                  { translateY: this._translateY },
                ],
              },
            ]}
          />
        </PanGestureHandler>
      </>
    );
  }
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  box: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    backgroundColor: '#72a',
    margin: 10,
    zIndex: 200,
  },
});
  