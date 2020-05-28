import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  PanGestureHandler,
  State as GestureState,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
const widthSize = Dimensions.get("window");
import Shape from "./Shape";

const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  Value,
  Clock,
  interpolate,
  divide,
  concat,
  call,
  event,
  or,
  eq,
  and,
  onChange,
  add,
} = Animated;

type Position = {
  x: Animated.Value<number>;
  y: Animated.Value<number>;
};

type State = {
  position: { x: number; y: number };
  isDragging: boolean;
};

export default class App extends React.Component {
  private dragPosition: Position = {
    x: new Value(0),
    y: new Value(0),
  };
  private dragGestureState: Animated.Value<number> = new Value(-1);

  state: State = {
    position: { x: 150, y: 200 },
    isDragging: false,
  };

  constructor(props) {
    super(props);
  }

  handleGestureEvent = event([
    {
      nativeEvent: ({ translationX, translationY, state }: any) =>
        block([
          set(this.dragPosition.x, translationX),
          set(this.dragPosition.y, translationY),
          set(this.dragGestureState, state),
        ]),
    },
  ]);

  render() {
    return (
      <View style={styles.container}>
        <Animated.Code>
          {() => {
            return onChange(this.dragGestureState, [
              // 2: BEGIN, 4: ACTIVE, 5: END
              debug("gestureState:", this.dragGestureState),
              cond(
                eq(this.dragGestureState, GestureState.BEGAN),
                call([], ([]) => {
                  this.setState({ isDragging: true });
                })
              ),
              cond(
                eq(this.dragGestureState, GestureState.END),
                call([this.dragPosition.x, this.dragPosition.y], ([x, y]) => {
                  const newPosition = {
                    x: this.state.position.x + x,
                    y: this.state.position.y + y,
                  };
                  this.setState({ position: newPosition, isDragging: false });
                })
              ),
            ]);
          }}
        </Animated.Code>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={this.handleGestureEvent}
          onHandlerStateChange={this.handleGestureEvent}
        >
          <Animated.View
            style={{
              left: this.state.position.x,
              top: this.state.position.y,
              transform: [
                this.state.isDragging
                  ? {
                      translateX: this.dragPosition.x,
                      translateY: this.dragPosition.y,
                    }
                  : {},
              ],
            }}
          >
            <Shape isActive={this.state.isDragging} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
